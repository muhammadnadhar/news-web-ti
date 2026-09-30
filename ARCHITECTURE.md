


### Arsitecture 

<br> 

> last add  : Sun Sep 27 02:48:09 PM WIB 2026

<br> 

```bash
Directory structure:
└── muhammadnadhar-news-web-ti/
    ├── README.md
    ├── CONTRIBUTING.md
    ├── current-commit.txt
    ├── env-example
    ├── eslint.config.js
    ├── package.json
    ├── prettier.config.js
    ├── tsconfig.json
    ├── vite.config.ts
    ├── .npmrc
    ├── .prettierignore
    ├── src/
    │   ├── app.d.ts
    │   ├── app.html
    │   ├── hooks.server.ts
    │   ├── lib/
    │   │   ├── constants.ts
    │   │   ├── crypto.ts
    │   │   ├── urls.ts
    │   │   ├── utils.ts
    │   │   ├── assets/
    │   │   │   └── uin-icon.webp
    │   │   ├── cloudinary/
    │   │   │   ├── client.ts
    │   │   │   └── server.ts
    │   │   ├── components/
    │   │   │   ├── cardSkeleton.svelte
    │   │   │   ├── draw.overlay.svelte
    │   │   │   ├── globalSkeletonUser.svelte
    │   │   │   ├── navbar.svelte
    │   │   │   ├── navbarSub.svelte
    │   │   │   ├── newsQuickDrawer.svelte
    │   │   │   ├── requestCard.svelte
    │   │   │   ├── themeActionBtn.svelte
    │   │   │   ├── admin/
    │   │   │   │   ├── btnFloatPagination.svelte
    │   │   │   │   ├── formEditor.svelte
    │   │   │   │   ├── message.svelte
    │   │   │   │   ├── sidebar.svelte
    │   │   │   │   ├── tableContent.svelte
    │   │   │   │   └── userCard.svelte
    │   │   │   └── loading/
    │   │   │       ├── spin.svelte
    │   │   │       └── tableSkeleton.svelte
    │   │   ├── converted/
    │   │   │   └── info.txt
    │   │   ├── data/
    │   │   │   ├── navbar.ts
    │   │   │   └── sidebar.ts
    │   │   ├── database/
    │   │   │   ├── core.ts
    │   │   │   ├── runtimeDb.ts
    │   │   │   └── svelteDb.ts
    │   │   ├── dto/
    │   │   │   └── admin/
    │   │   │       ├── dataset.ts
    │   │   │       ├── home.ts
    │   │   │       ├── userAdmin.ts
    │   │   │       └── article/
    │   │   │           ├── akademik.ts
    │   │   │           ├── berita.ts
    │   │   │           ├── kemahasiswaan.ts
    │   │   │           ├── kerjasama.ts
    │   │   │           ├── kurikulum.ts
    │   │   │           ├── penelitian.ts
    │   │   │           └── profile.ts
    │   │   ├── global/
    │   │   │   └── theme.ts
    │   │   ├── helper/
    │   │   │   ├── cloudinary.ts
    │   │   │   └── message.ts
    │   │   ├── repository/
    │   │   │   └── admin/
    │   │   │       ├── info.txt
    │   │   │       ├── userAdmin.ts
    │   │   │       ├── article/
    │   │   │       │   ├── berita.ts
    │   │   │       │   ├── akedemik/
    │   │   │       │   │   ├── kalender.ts
    │   │   │       │   │   ├── ketentuan-komprehensif.ts
    │   │   │       │   │   ├── modulePratikum.ts
    │   │   │       │   │   ├── pedomanKKP.ts
    │   │   │       │   │   └── pedomanTa.ts
    │   │   │       │   ├── kemahasiswaan/
    │   │   │       │   │   ├── beasiswa.ts
    │   │   │       │   │   ├── ipkTertinggi.ts
    │   │   │       │   │   └── mapres.ts
    │   │   │       │   ├── kerjasama/
    │   │   │       │   │   ├── daftar.ts
    │   │   │       │   │   └── documentasi.ts
    │   │   │       │   ├── kurikulum/
    │   │   │       │   │   ├── obe.ts
    │   │   │       │   │   └── petaMatakuliah.ts
    │   │   │       │   ├── penelitian/
    │   │   │       │   │   ├── penelitianDosen.ts
    │   │   │       │   │   ├── publikasiDosen.ts
    │   │   │       │   │   └── publikasiMahasiswa.ts
    │   │   │       │   └── profile/
    │   │   │       │       ├── akreditasi.ts
    │   │   │       │       ├── dosen&staff.ts
    │   │   │       │       ├── sejarah.ts
    │   │   │       │       ├── structure.ts
    │   │   │       │       └── visiMisi.ts
    │   │   │       ├── dataset/
    │   │   │       │   ├── angkatan.ts
    │   │   │       │   ├── beritaKategory.ts
    │   │   │       │   ├── jabatanProdi.ts
    │   │   │       │   └── semester.ts
    │   │   │       └── home/
    │   │   │           ├── dosenPrimary.ts
    │   │   │           ├── profileDashboard.ts
    │   │   │           ├── profilProdi.ts
    │   │   │           └── tablePermitan.ts
    │   │   ├── seeder/
    │   │   │   ├── dataExc.ts
    │   │   │   ├── info.txt
    │   │   │   ├── tableExc.ts
    │   │   │   ├── admin/
    │   │   │   │   ├── dataset.ts
    │   │   │   │   ├── home.ts
    │   │   │   │   ├── userAdmin.ts
    │   │   │   │   └── article/
    │   │   │   │       ├── akademik.ts
    │   │   │   │       ├── berita.ts
    │   │   │   │       ├── kemahasiswaan.ts
    │   │   │   │       ├── kerjasama.ts
    │   │   │   │       ├── kurikulum.ts
    │   │   │   │       ├── penelitian.ts
    │   │   │   │       └── profile.ts
    │   │   │   └── data/
    │   │   │       └── user.ts
    │   │   └── types/
    │   │       ├── message.ts
    │   │       ├── navbar.ts
    │   │       ├── sedebar.ts
    │   │       ├── sibebarWidgetPriview.ts
    │   │       └── tableContent.ts
    │   └── routes/
    │       ├── +layout.svelte
    │       ├── layout.css
    │       ├── (admin)/
    │       │   └── admin/
    │       │       ├── +error.svelte
    │       │       ├── +layout.svelte
    │       │       ├── +page.server.ts
    │       │       ├── article/
    │       │       │   ├── +page.svelte
    │       │       │   ├── info.txt
    │       │       │   ├── akademik/
    │       │       │   │   ├── kalender/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── formKalenderItem.svelte
    │       │       │   │   │   └── add/
    │       │       │   │   │       ├── +page.server.ts
    │       │       │   │   │       └── +page.svelte
    │       │       │   │   ├── ketentuan-komprehensif/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── formKetentuanKompre.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           ├── +page.server.ts
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   ├── modul-praktikum/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── formModulePratikum.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           ├── +page.server.ts
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   ├── pedoman-kkp/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   └── add/
    │       │       │   │   │       ├── +page.server.ts
    │       │       │   │   │       └── +page.svelte
    │       │       │   │   └── pedoman-ta/
    │       │       │   │       ├── +page.server.ts
    │       │       │   │       ├── +page.svelte
    │       │       │   │       ├── _component/
    │       │       │   │       │   └── FormGuideline.svelte
    │       │       │   │       ├── add/
    │       │       │   │       │   ├── +page.server.ts
    │       │       │   │       │   └── +page.svelte
    │       │       │   │       └── edit/
    │       │       │   │           └── [id]/
    │       │       │   │               ├── +page.server.ts
    │       │       │   │               └── +page.svelte
    │       │       │   ├── berita/
    │       │       │   │   ├── +page.server.ts
    │       │       │   │   ├── +page.svelte
    │       │       │   │   ├── _component/
    │       │       │   │   │   └── formNews.svelte
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   ├── kemahasiswaan/
    │       │       │   │   ├── beasiswa/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── formBeasiswa.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           ├── +page.server.ts
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   ├── ipktertinggi/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── FormMshIpk.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           ├── +page.server.ts
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   └── mapres/
    │       │       │   │       ├── +page.server.ts
    │       │       │   │       ├── +page.svelte
    │       │       │   │       ├── _component/
    │       │       │   │       │   └── formMhsPrestasi.svelte
    │       │       │   │       ├── add/
    │       │       │   │       │   ├── +page.server.ts
    │       │       │   │       │   └── +page.svelte
    │       │       │   │       └── edit/
    │       │       │   │           └── [id]/
    │       │       │   │               ├── +page.server.ts
    │       │       │   │               └── +page.svelte
    │       │       │   ├── kerjasama/
    │       │       │   │   ├── daftar-kerjasama/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   └── dokumentasi/
    │       │       │   │       ├── +page.server.ts
    │       │       │   │       ├── +page.svelte
    │       │       │   │       ├── _component/
    │       │       │   │       │   └── formDocActivity.svelte
    │       │       │   │       ├── add/
    │       │       │   │       │   ├── +page.server.ts
    │       │       │   │       │   └── +page.svelte
    │       │       │   │       └── edit/
    │       │       │   │           └── [id]/
    │       │       │   │               ├── +page.server.ts
    │       │       │   │               └── +page.svelte
    │       │       │   ├── kurikulum/
    │       │       │   │   ├── matakuliah/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── formCourceMap.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           ├── +page.server.ts
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   └── obe/
    │       │       │   │       ├── +page.server.ts
    │       │       │   │       └── +page.svelte
    │       │       │   ├── penelitian/
    │       │       │   │   ├── penelitian-dosen/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   ├── publikasi-dosen/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   ├── +page.svelte
    │       │       │   │   │   ├── _component/
    │       │       │   │   │   │   └── formLecturerPublication.svelte
    │       │       │   │   │   ├── add/
    │       │       │   │   │   │   ├── +page.server.ts
    │       │       │   │   │   │   └── +page.svelte
    │       │       │   │   │   └── edit/
    │       │       │   │   │       └── [id]/
    │       │       │   │   │           ├── +page.server.ts
    │       │       │   │   │           └── +page.svelte
    │       │       │   │   └── publikasi-mahasiswa/
    │       │       │   │       ├── +page.server.ts
    │       │       │   │       ├── +page.svelte
    │       │       │   │       ├── _component/
    │       │       │   │       │   └── formMshPublish.svelte
    │       │       │   │       ├── add/
    │       │       │   │       │   ├── +page.server.ts
    │       │       │   │       │   └── +page.svelte
    │       │       │   │       └── edit/
    │       │       │   │           └── [id]/
    │       │       │   │               ├── +page.server.ts
    │       │       │   │               └── +page.svelte
    │       │       │   └── profil/
    │       │       │       ├── +page.svelte
    │       │       │       ├── _components/
    │       │       │       │   └── sectionDataSejarah.svelte
    │       │       │       ├── akreditasi/
    │       │       │       │   ├── +page.server.ts
    │       │       │       │   └── +page.svelte
    │       │       │       ├── dosen/
    │       │       │       │   ├── +page.server.ts
    │       │       │       │   ├── +page.svelte
    │       │       │       │   ├── add/
    │       │       │       │   │   ├── +page.server.ts
    │       │       │       │   │   └── +page.svelte
    │       │       │       │   └── edit/
    │       │       │       │       └── [id]/
    │       │       │       │           └── +page.svelte
    │       │       │       ├── fasilitas/
    │       │       │       │   └── +page.svelte
    │       │       │       ├── sejarah/
    │       │       │       │   ├── +page.server.ts
    │       │       │       │   ├── +page.svelte
    │       │       │       │   ├── _component/
    │       │       │       │   │   └── formLeaderPriode.svelte
    │       │       │       │   ├── add/
    │       │       │       │   │   ├── +page.server.ts
    │       │       │       │   │   └── +page.svelte
    │       │       │       │   └── edit/
    │       │       │       │       └── [id]/
    │       │       │       │           ├── +page.server.ts
    │       │       │       │           └── +page.svelte
    │       │       │       ├── struktur-organisasi/
    │       │       │       │   ├── +page.server.ts
    │       │       │       │   ├── +page.svelte
    │       │       │       │   └── add/
    │       │       │       │       ├── +page.server.ts
    │       │       │       │       └── +page.svelte
    │       │       │       └── visi-misi/
    │       │       │           ├── +page.server.ts
    │       │       │           └── +page.svelte
    │       │       ├── dashboard/
    │       │       │   └── +page.svelte
    │       │       ├── dataset/
    │       │       │   ├── +page.svelte
    │       │       │   ├── angkatan/
    │       │       │   │   ├── +page.server.ts
    │       │       │   │   ├── +page.svelte
    │       │       │   │   ├── _component/
    │       │       │   │   │   └── formAngkatan.svelte
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   ├── jabatan-prodi/
    │       │       │   │   ├── +page.server.ts
    │       │       │   │   ├── +page.svelte
    │       │       │   │   ├── _component/
    │       │       │   │   │   ├── formJabatan.svelte
    │       │       │   │   │   └── selectJabatan.svelte
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   ├── kategori-berita/
    │       │       │   │   ├── +page.server.ts
    │       │       │   │   ├── +page.svelte
    │       │       │   │   ├── _component/
    │       │       │   │   │   └── formKategoriNews.svelte
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   └── semester/
    │       │       │       ├── +page.server.ts
    │       │       │       ├── +page.svelte
    │       │       │       ├── _component/
    │       │       │       │   └── formSemester.svelte
    │       │       │       ├── add/
    │       │       │       │   ├── +page.server.ts
    │       │       │       │   └── +page.svelte
    │       │       │       └── edit/
    │       │       │           └── [id]/
    │       │       │               ├── +page.server.ts
    │       │       │               └── +page.svelte
    │       │       ├── home/
    │       │       │   ├── +page.server.ts
    │       │       │   ├── +page.svelte
    │       │       │   ├── dosen/
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   ├── perminatan/
    │       │       │   │   ├── _component/
    │       │       │   │   │   └── formPeminatan.svelte
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   ├── profil-dashboard/
    │       │       │   │   ├── add/
    │       │       │   │   │   ├── +page.server.ts
    │       │       │   │   │   └── +page.svelte
    │       │       │   │   └── edit/
    │       │       │   │       └── [id]/
    │       │       │   │           ├── +page.server.ts
    │       │       │   │           └── +page.svelte
    │       │       │   └── profil-prodi/
    │       │       │       ├── add/
    │       │       │       │   └── +page.svelte
    │       │       │       └── edit/
    │       │       │           └── +page.svelte
    │       │       ├── signIn/
    │       │       │   ├── +layout@.svelte
    │       │       │   ├── +page.server.ts
    │       │       │   └── +page.svelte
    │       │       └── user/
    │       │           ├── +page.server.ts
    │       │           ├── +page.svelte
    │       │           ├── _component/
    │       │           │   └── formUser.svelte
    │       │           ├── add/
    │       │           │   ├── +page.server.ts
    │       │           │   └── +page.svelte
    │       │           ├── edit/
    │       │           │   └── [id]/
    │       │           │       ├── +page.server.ts
    │       │           │       └── +page.svelte
    │       │           └── profil/
    │       │               ├── +page.server.ts
    │       │               ├── +page.svelte
    │       │               └── example.profile.svelte
    │       └── (main)/
    │           ├── +error.svelte
    │           ├── +layout.server.ts
    │           ├── +layout.svelte
    │           ├── +page.server.ts
    │           ├── +page.svelte
    │           ├── _components/
    │           │   ├── emptyData.svelte
    │           │   ├── get.started.svelte
    │           │   ├── homeSection.svelte
    │           │   ├── mainFooter.svelte
    │           │   └── newsSection.svelte
    │           ├── akademik/
    │           │   ├── kalender/
    │           │   │   ├── +page.server.ts
    │           │   │   ├── +page.svelte
    │           │   │   └── _components/
    │           │   │       └── formAcademic.svelte
    │           │   ├── ketentuan-komprehensif/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   ├── modul-praktikum/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   ├── pedoman-kkp/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   └── pedoman-ta/
    │           │       ├── +page.server.ts
    │           │       └── +page.svelte
    │           ├── berita/
    │           │   ├── +page.server.ts
    │           │   ├── +page.svelte
    │           │   ├── [id]/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   └── kategori/
    │           │       └── [slug]/
    │           │           ├── +page.server.ts
    │           │           └── +page.svelte
    │           ├── kemahasiswaan/
    │           │   ├── beasiswa/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   ├── hima/
    │           │   │   └── +page.svelte
    │           │   ├── ipk-tertinggi/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   ├── prestasi-akademik/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   └── prestasi-non-akademik/
    │           │       ├── +page.server.ts
    │           │       └── +page.svelte
    │           ├── kerjasama/
    │           │   ├── daftar-kerjasama/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   └── dokumentasi/
    │           │       ├── +page.server.ts
    │           │       └── +page.svelte
    │           ├── kurikulum/
    │           │   ├── kurikulum-kkni/
    │           │   │   ├── info.txt
    │           │   │   └── [year]/
    │           │   │       └── +page.svelte
    │           │   ├── matakuliah/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   └── obe/
    │           │       ├── +page.server.ts
    │           │       └── +page.svelte
    │           ├── penelitian/
    │           │   ├── penelitian-dosen/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   ├── publikasi-dosen/
    │           │   │   ├── +page.server.ts
    │           │   │   └── +page.svelte
    │           │   └── publikasi-mahasiswa/
    │           │       ├── +page.server.ts
    │           │       └── +page.svelte
    │           └── profil/
    │               ├── +page.svelte
    │               ├── _components/
    │               │   └── sectionDataSejarah.svelte
    │               ├── akreditasi/
    │               │   ├── +page.server.ts
    │               │   └── +page.svelte
    │               ├── dosen-staff/
    │               │   ├── +page.server.ts
    │               │   ├── +page.svelte
    │               │   └── [id]/
    │               │       ├── +page.server.ts
    │               │       └── +page.svelte
    │               ├── fasilitas/
    │               │   └── +page.svelte
    │               ├── sejarah/
    │               │   ├── +page.server.ts
    │               │   └── +page.svelte
    │               ├── struktur-organisasi/
    │               │   ├── +page.server.ts
    │               │   └── +page.svelte
    │               └── visi-misi/
    │                   ├── +page.server.ts
    │                   └── +page.svelte
    └── static/
        └── robots.txt
```
