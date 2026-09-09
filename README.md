<h1>
News TI
</h1>

<br>

> KOnsep Web cukup simple tapi besar , karena data yang di simpan di database terpisah ke table masing masing

<br>

### Stack

<p align="center">
  <img src="https://skillicons.dev" width="50" alt="Svelte / SvelteKit" />
  <img src="https://skillicons.dev" width="50" alt="Tailwind CSS" />
  <img src="https://skillicons.dev" width="50" alt="MySQL" />
  <img src="https://skillicons.dev" width="50" alt="TypeScript (tsx)" />
  <img src="https://skillicons.dev" width="50" alt="Bun" />

  <img src="https://shields.io" height="40" alt="Lucide Svelte" />
</p>

<br>

- `svelte` ( 5.56.1 )& `sveltekit` ( fullstack ) : framework utama yang di gunakan dalam membuat app ini
- `tailwindcss` : style framework css yang di gunakan untuk men-desain setiap halaman apliaksi ini
- `lucide-svelte` : icon di projek ini
- `MySql` : database yang di gunakan di projek ini
- `tsx` : typescrip yang akan di gunakan di
- `bun` : runtime yang di gunakan di projek ini
- `googleapis` : di butuhkan untuk
  1. menyimpan file _**img**_ ke google drive

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

- data dari instagram bisa langsung singkrone

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
bun run db:seed:bun
# pastikan install tsx , karena mengguakna tsx
npm run db:seed:npm

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
