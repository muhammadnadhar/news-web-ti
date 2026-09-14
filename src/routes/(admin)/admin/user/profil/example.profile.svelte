<!-- src/routes/admin/profile/+page.svelte -->
<script lang="ts">
	import {
		Feather,
		ShieldCheck,
		UserCog,
		Mail,
		AtSign,
		Phone,
		MapPin,
		Calendar,
		MoreHorizontal,
		CheckCircle2,
		FileText,
		Settings,
		Eye,
		UploadCloud,
		Users,
		Activity,
		ShieldAlert,
		Edit3
	} from 'lucide-svelte';
	import type { UserAdminItem } from '$lib/types/userAdmin';

	// Props data user (Dapat dikirim dari +page.server.ts)
	interface Props {
		data?: {
			user: UserAdminItem;
		};
	}

	let { data }: Props = $props();

	// Fallback Data Mockup jika data belum dikirim dari server
	const currentUser: UserAdminItem = data?.user ?? {
		id: 'usr-8921-x7',
		name: 'Dr. Kevin Smith, M.T.',
		username: 'kevin_smith',
		email: 'kevin.smith@uin.ac.id',
		password: '***',
		role: 'Author', // Ubah ke 'Administrator' / 'supervisor' untuk pengujian
		status: 'Active',
		createdAt: '2024-01-15T08:30:00Z'
	};

	// Konfigurasi dinamis berdasarkan UserRole
	const roleConfig = $derived.by(() => {
		switch (currentUser.role) {
			case 'Administrator':
				return {
					label: 'Administrator Sistem',
					badgeBg: 'bg-scitech-mint/10 text-scitech-mint border-scitech-mint/30',
					icon: ShieldCheck,
					iconColor: 'text-scitech-mint',
					intro:
						'Bertanggung jawab penuh atas pengelolaan infrastruktur portal, hak akses seluruh pengguna, keamanan data, serta konfigurasi server.',
					tasks: [
						{
							title: 'Manajemen Pengguna & Akses',
							desc: 'Mengelola akun, peran, dan lisensi hak akses seluruh staf, dosen, dan operator.',
							icon: Users,
							color: 'text-scitech-mint bg-scitech-mint/10 border-scitech-mint/20'
						},
						{
							title: 'Keamanan & Log Server',
							desc: 'Memantau pembaruan sistem, backup basis data, serta audit aktivitas pengguna.',
							icon: ShieldAlert,
							color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
						},
						{
							title: 'Konfigurasi Sistem Portal',
							desc: 'Mengatur parameter global situs, API pihak ketiga, dan pengaturan tema portal.',
							icon: Settings,
							color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
						}
					]
				};

			case 'supervisor':
				return {
					label: 'Supervisor Content & Redaksi',
					badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
					icon: UserCog,
					iconColor: 'text-amber-400',
					intro:
						'Memiliki wewenang dalam memverifikasi, meninjau kelayakan, serta menyetujui penerbitan draf artikel berita yang dikirim oleh Author.',
					tasks: [
						{
							title: 'Review & Kurasi Draf',
							desc: 'Meninjau kelayakan editorial, tata bahasa, dan fakta berita sebelum dipublikasikan.',
							icon: Eye,
							color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
						},
						{
							title: 'Persetujuan Publikasi',
							desc: 'Menerbitkan draf terpilih ke halaman utama portal publik atau menolaknya dengan catatan.',
							icon: CheckCircle2,
							color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
						},
						{
							title: 'Monitoring Kinerja Konten',
							desc: 'Menganalisis statistik pembaca berita dan tren topik populer secara berkala.',
							icon: Activity,
							color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
						}
					]
				};

			case 'Author':
			default:
				return {
					label: 'Author (Penulis Konten)',
					badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
					icon: Feather,
					iconColor: 'text-emerald-400',
					intro:
						'Fokus membuat riset tulisan, mendokumentasikan kegiatan sains dan teknologi, serta mengunggah draf berita secara berkala.',
					tasks: [
						{
							title: 'Penulisan Draf Berita',
							desc: 'Membuat dan mengedit tulisan artikel seputar berita akademik, kegiatan kampus, dan artikel sains.',
							icon: Edit3,
							color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
						},
						{
							title: 'Pengelolaan Media & Galeri',
							desc: 'Mengunggah dan merapikan dokumentasi foto/video pendukung untuk materi artikel.',
							icon: UploadCloud,
							color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
						},
						{
							title: 'Manajemen Arsip Pribadi',
							desc: 'Mengelola riwayat draf tulisan yang telah diterbitkan maupun yang masih dalam revisi.',
							icon: FileText,
							color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
						}
					]
				};
		}
	});

	// Ambil Komponen Ikon Utama
	const RoleAvatarIcon = $derived(roleConfig.icon);
</script>

<svelte:head>
	<title>Profil Pengguna - {currentUser.name}</title>
</svelte:head>

<div class="bg-scitech-navy min-h-screen p-4 text-white md:p-8">
	<div class="mx-auto max-w-5xl space-y-6">
		<!-- CARD UTAMA PROFIL -->
		<div class="bg-scitech-slate overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
			<!-- 1. HEADER BANNER SAMPUL -->
			<div class="relative h-48 w-full overflow-hidden bg-slate-800 md:h-64">
				<img
					src="/images/logo-uin.png"
					alt="Banner Header"
					class="h-full w-full object-cover opacity-30 blur-sm transition-all duration-500 hover:scale-105 hover:opacity-40"
				/>
				<div
					class="from-scitech-slate absolute inset-0 bg-gradient-to-t via-transparent to-black/40"
				></div>
			</div>

			<!-- 2. IDENTITAS UTAMA (AVATAR OVERLAP & NAMA) -->
			<div class="relative px-6 pb-6 md:px-8">
				<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<!-- Left: Avatar Icon + Info Nama -->
					<div class="flex flex-col gap-4 sm:flex-row sm:items-end">
						<!-- Avatar dengan Lucide Icon Sesuai Role -->
						<div
							class="border-scitech-slate bg-scitech-navy relative -mt-16 flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 shadow-2xl md:-mt-20 md:h-36 md:w-36"
						>
							<RoleAvatarIcon class="h-12 w-12 md:h-16 md:w-16 {roleConfig.iconColor}" />
							<span
								class="border-scitech-slate absolute right-2 bottom-2 h-4 w-4 rounded-full border-2 bg-emerald-400"
								title="Status: Active"
							></span>
						</div>

						<!-- Nama & Peran -->
						<div class="space-y-1">
							<div class="flex flex-wrap items-center gap-2">
								<h1 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
									{currentUser.name}
								</h1>
								<span
									class="rounded-full border px-3 py-0.5 text-xs font-semibold {roleConfig.badgeBg}"
								>
									{currentUser.role}
								</span>
							</div>
							<p class="text-xs font-medium text-slate-400 md:text-sm">
								{roleConfig.label} • Fakultas Sains dan Teknologi
							</p>

							<!-- Sub Meta (Lokasi & Social Contact) -->
							<div class="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
								<span class="flex items-center gap-1">
									<MapPin class="h-3.5 w-3.5 text-slate-500" />
									UIN Sunan Gunung Djati, Bandung
								</span>
								<span class="flex items-center gap-1">
									<AtSign class="h-3.5 w-3.5 text-slate-500" />
									{currentUser.username}
								</span>
							</div>
						</div>
					</div>

					<!-- Right Action Menu -->
					<div class="flex items-center gap-2 self-start md:self-end">
						<button
							class="bg-scitech-navy hover:border-scitech-mint/40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition-colors hover:text-white"
							title="Opsi Lainnya"
						>
							<MoreHorizontal class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>

			<!-- 3. KONTEN DETAIL (LAYOUT 2 KOLOM) -->
			<div class="grid grid-cols-1 gap-6 border-t border-white/10 p-6 md:p-8 lg:grid-cols-3">
				<div class="space-y-6 lg:col-span-1">
					<div class="bg-scitech-navy/60 space-y-4 rounded-2xl border border-white/5 p-5">
						<h3
							class="border-b border-white/10 pb-3 text-xs font-bold tracking-wider text-slate-400 uppercase"
						>
							Biodata & Informasi
						</h3>

						<div class="space-y-3.5 text-xs">
							<!-- Email -->
							<div class="flex items-start gap-3">
								<Mail class="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
								<div>
									<p class="text-slate-400">Email Resmi</p>
									<p class="font-medium text-slate-200">{currentUser.email}</p>
								</div>
							</div>

							<!-- Phone/Kontak -->
							<div class="flex items-start gap-3">
								<Phone class="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
								<div>
									<p class="text-slate-400">Telepon / WhatsApp</p>
									<p class="font-medium text-slate-200">+62 812-3456-7890</p>
								</div>
							</div>

							<!-- ID User -->
							<div class="flex items-start gap-3">
								<AtSign class="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
								<div>
									<p class="text-slate-400">ID Pengguna</p>
									<p class="font-mono text-slate-300">{currentUser.id}</p>
								</div>
							</div>

							<!-- Tanggal Bergabung -->
							<div class="flex items-start gap-3">
								<Calendar class="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
								<div>
									<p class="text-slate-400">Terdaftar Sejak</p>
									<p class="font-medium text-slate-200">
										{new Date(currentUser.createdAt).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- KOLOM KANAN: RINGKASAN INTRODUKSI & KARTU TUGAS -->
				<div class="space-y-6 lg:col-span-2">
					<!-- Card Ringkasan Introduksi -->
					<div class="bg-scitech-navy/60 rounded-2xl border border-white/5 p-6">
						<h3 class="mb-2 text-base font-bold text-white">Introduction</h3>
						<p class="text-xs leading-relaxed text-slate-300 md:text-sm">
							{roleConfig.intro}
						</p>
					</div>

					<!-- Card Daftar Tugas Utama Berdasarkan Role -->
					<div class="space-y-3">
						<h3 class="text-xs font-bold tracking-wider text-slate-400 uppercase">
							Tanggung Jawab & Tugas Utama ({currentUser.role})
						</h3>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
							{#each roleConfig.tasks as task}
								{@const TaskIcon = task.icon}
								<div
									class="bg-scitech-navy/40 hover:bg-scitech-navy/70 flex flex-col justify-between rounded-2xl border border-white/5 p-4 transition-all duration-200 hover:border-white/20"
								>
									<div>
										<div
											class="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border p-2 {task.color}"
										>
											<TaskIcon class="h-4 w-4" />
										</div>
										<h4 class="text-xs font-bold text-white">{task.title}</h4>
										<p class="mt-1.5 text-[11px] leading-relaxed text-slate-400">
											{task.desc}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
