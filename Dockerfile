
# 
# bisa Mengguankan runtime node js  /  bun 
# 

# Stage 1 : Building  ----------------- 

# Gunakan base image Oven Bun (sudah include Node.js & Bun secara bawaan)
FROM oven/bun:1-alpine AS builder
WORKDIR /app


# Install git terlebih dahulu agar bisa melakukan cloning
RUN apk add --no-cache git

RUN git clone https://github.com/muhammadnadhar/news-web-ti.git . \
    && rm -rf .git

# Salin package.json dan semua variasi lockfile yang mungkin ada
# COPY package.json package-lock.jso[n] bun.loc[k] bun.lock[b] ./

RUN if [ -f bun.lock ] || [ -f bun.lockb ]; then \
      echo "Lockfile Bun terdeteksi. Menggunakan Bun..." && \
      bun install --frozen-lockfile; \
    else \
      echo "Lockfile NPM terdeteksi. Menggunakan NPM..." && \
      npm ci; \
    fi

# YANG DITAMBAHKAN: Menangkap argumen build dari compose untuk SvelteKit
ARG DATAUI
ARG CLOUDINARY_API_SECRET
ARG PUBLIC_CLOUDINARY_CLOUD_NAME
ARG PUBLIC_CLOUDINARY_API_KEY
ARG PUBLIC_CLOUDINARY_UPLOAD_PRESET

ENV DATAUI=$DATAUI
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
ENV PUBLIC_CLOUDINARY_CLOUD_NAME=$PUBLIC_CLOUDINARY_CLOUD_NAME
ENV PUBLIC_CLOUDINARY_API_KEY=$PUBLIC_CLOUDINARY_API_KEY
ENV PUBLIC_CLOUDINARY_UPLOAD_PRESET=$PUBLIC_CLOUDINARY_UPLOAD_PRESET

ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_PORT

ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV DB_PORT=$DB_PORT

RUN if [ -f bun.lock ] || [ -f bun.lockb ]; then \
      bun x svelte-kit sync; \
    else \
      npx svelte-kit sync; \
    fi

# Jalankan perintah build (otomatis menyesuaikan runtime)
RUN if [ -f bun.lock ] || [ -f bun.lockb ]; then \
      bun run --bun build; \
    else \
      npm run build; \
    fi

# Hapus dependencies development agar image akhir tetap kecil
RUN if [ -f bun.lock ] || [ -f bun.lockb ]; then \
      rm -rf node_modules && bun install --production; \
    else \
      npm prune --omit=dev; \
    fi

# Stage 2: Runner (Image Produksi Akhir) ------------------

FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Set environment variable produksi
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.jso[n] /app/bun.loc[k] /app/bun.lock[b] ./ 
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
# Menyalin source seeder ke runner jika file build membutuhkan file ts asli untuk seeder runtime
COPY --from=builder /app/src/lib ./src/lib
#Salin tsconfig.json asli proyek agar Bun 100% mengenali alias $lib

COPY --from=builder /app/.svelte-kit ./.svelte-kit
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

# SCRIPT RUNTIME OTOMATIS:
# Sebelum menyalakan aplikasi utama, container akan mendeteksi lockfile 
# lalu mengeksekusi migrasi tabel dan pengisian data dummy secara berurutan.
CMD if [ -f bun.lock ] || [ -f bun.lockb ]; then \
      echo "Executing Bun Database Seeders..." && \
      bun run db:seed:bun:table && \
      bun run db:seed:bun:data && \
      bun ./build/index.js; \
    else \
      echo "Executing NPM/Node Database Seeders..." && \
      npm run db:seed:npm:table && \
      npm run db:seed:npm:data && \
      node ./build/index.js; \
    fi
