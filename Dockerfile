
# 
# bisa Mengguankan runtime node js  /  bun 
# 

# Gunakan base image Oven Bun (sudah include Node.js & Bun secara bawaan)
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Salin package.json dan semua variasi lockfile yang mungkin ada
COPY package.json package-lock.jso[n] bun.loc[k] bun.lock[b] ./

RUN if [ -f bun.lock ] || [ -f bun.lockb ]; then \
      echo "Lockfile Bun terdeteksi. Menggunakan Bun..." && \
      bun install --frozen-lockfile; \
    else \
      echo "Lockfile NPM terdeteksi. Menggunakan NPM..." && \
      npm ci; \
    fi

COPY . .

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

# ==========================================
# Stage 2: Runner (Image Produksi Akhir)
# ==========================================
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Set environment variable produksi
ENV NODE_ENV=production
ENV PORT=3000

COPY package.json ./
COPY --from=builder /app/package-lock.jso[n] /app/bun.loc[k] /app/bun.lock[b] ./ 
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
# Menyalin source seeder ke runner jika file build membutuhkan file ts asli untuk seeder runtime
COPY --from=builder /app/src/lib/seeder ./src/lib/seeder

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
      npm run db:seed:bun:data && \
      node ./build/index.js; \
    fi
