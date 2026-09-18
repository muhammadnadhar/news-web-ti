<h1 align="center">
News TI ( UIN Ar-Raniry )
</h1>

<br>

> KOnsep Web cukup simple tapi besar , karena data yang di simpan di database terpisah ke table masing masing

<br>

### Stack

<p align="center">
  <img src="https://img.shields.io/badge/Framework-SvelteKit-FF3E00?logo=svelte&logoColor=white" />
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Runtime-Bun-000000?logo=bun&logoColor=white" />
  <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Icons-Lucide_Svelte-FF3E00?logo=svelte&logoColor=white" />
</p>

<br>

- `svelte` ( 5.56.1 )& `sveltekit` ( fullstack ) : framework utama yang di gunakan dalam membuat app ini
- `tailwindcss` : style framework css yang di gunakan untuk men-desain setiap halaman apliaksi ini
- `lucide-svelte` : icon di projek ini
- `MySql` : database yang di gunakan di projek ini
- `tsx` : typescrip yang akan di gunakan di
- `bun` : runtime yang di gunakan di projek ini
- `svelte-cloudinary` : koneksi ke cloudinary untuk menyimpan file gambar

<br>

### Start

```sh
# recreate this project
bun x sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:auto" --install bun web-berita-ti
```

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab

bun run dev -- --open

npm run dev -- --open
```

### New Fiwture

> beberapa fitur yg di tambhakan

- desain Dashboard lebih modren
- data dari instagram bisa langsung singkrone
- modal peringatan saat di hapus
- id di engcripsi
- admin : ada Flush Message yang menampilkan informasi yang di lakukan
- admin : scroling sidebar nyangkut dengan sempurnah wkwk

##### Admin panel

- nah di sini ada yang janggal , sya mau menambhakan verifikasi saat menghapus data

### Admin

> beberapa halaman menggunakan component untuk menampilkan sub pages yang di pisah

- user yang di buat di sini adalah admin

### Database

##### seeder

> jalakan untuk memasukan data dummy

<br>

> cek dan konfigurasi di ./src/lib/seeder/main.ts

```bash
# jalakan data dummy ( bisa dengan bun / npm /pnpm)
bun run db:seed:bun:table
bun run db:seed:bun:data

# pastikan install tsx , karena mengguakna tsx
npm run db:seed:npm:table
bun run db:seed:bun:data

```

### App Color

### Teknik

mendapatkan gambar

```bash
curl -o nama_gambar_.extension

```

### Reference

- rebuild dari web : <https://ti.fst.ar-raniry.ac.id/>
- uin web : <https://ar-raniry.ac.id/>
