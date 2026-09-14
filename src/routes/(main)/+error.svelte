<script lang="ts">
	// Menggunakan state bawaan Svelte 5 & SvelteKit terbaru
	import { page } from '$app/state';
	import {
		Compass,
		Lock,
		ShieldAlert,
		ServerOff,
		HelpCircle,
		Home,
		RotateCcw,
		ArrowLeft
	} from 'lucide-svelte';

	// Reaktivitas menggunakan Rune $derived() dari Svelte 5
	let status = $derived(page.status);
	let message = $derived(page.error?.message || 'Maaf, terjadi kendala saat memuat halaman ini.');

	// Mendapatkan metadata UI yang ramah bagi pengguna umum
	let errorMeta = $derived(getErrorMeta(status));

	function getErrorMeta(code: number) {
		switch (code) {
			case 400:
				return {
					code: '400',
					title: 'Permintaan Tidak Sesuai',
					subtitle: 'Format permintaan tidak dapat diproses oleh sistem. Silakan coba kembali.',
					icon: HelpCircle,
					badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
					iconBg: 'bg-amber-50 text-amber-600 border-amber-100/80 shadow-amber-100'
				};
			case 401:
				return {
					code: '401',
					title: 'Silakan Masuk Terlebih Dahulu',
					subtitle: 'Anda harus login akun terlebih dahulu untuk mengakses fitur ini.',
					icon: Lock,
					badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
					iconBg: 'bg-sky-50 text-sky-600 border-sky-100/80 shadow-sky-100'
				};
			case 403:
				return {
					code: '403',
					title: 'Akses Dibatasi',
					subtitle: 'Maaf, Anda tidak memiliki izin untuk membuka halaman atau konten ini.',
					icon: ShieldAlert,
					badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
					iconBg: 'bg-orange-50 text-orange-600 border-orange-100/80 shadow-orange-100'
				};
			case 404:
				return {
					code: '404',
					title: 'Halaman Tidak Ditemukan',
					subtitle:
						'Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.',
					icon: Compass,
					badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
					iconBg: 'bg-blue-50 text-blue-600 border-blue-100/80 shadow-blue-100'
				};
			case 500:
			default:
				return {
					code: '500',
					title: 'Sistem Sedang Gangguan',
					subtitle:
						'Terjadi kendala teknis pada server kami. Silakan mencoba kembali beberapa saat lagi.',
					icon: ServerOff,
					badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
					iconBg: 'bg-rose-50 text-rose-600 border-rose-100/80 shadow-rose-100'
				};
		}
	}

	function handleReload() {
		window.location.reload();
	}

	function handleGoBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = '/';
		}
	}
</script>

<svelte:head>
	<title>{status} - {errorMeta.title} | Sains & Teknologi</title>
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/70 p-4 font-sans antialiased sm:p-6"
>
	<!-- Background Accent Shapes -->
	<div
		class="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"
	></div>

	<!-- Main Card Container -->
	<div
		class="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/90 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-10"
	>
		<!-- Visual Icon Container -->
		<div class="mb-6 inline-flex flex-col items-center justify-center">
			<div class="mb-4 rounded-3xl border p-5 shadow-lg {errorMeta.iconBg}">
				<!-- <svelte:component this={errorMeta.icon} class="h-12 w-12 stroke-[1.75]" /> -->

				<errorMeta.icon class="h-12 w-12 {errorMeta.badgeClass} stroke-[1.5]" />
			</div>

			<span
				class="rounded-full border px-3.5 py-1 text-xs font-semibold tracking-wide {errorMeta.badgeClass}"
			>
				KODE ERROR {errorMeta.code}
			</span>
		</div>

		<!-- Title & Subtitle -->
		<h1 class="mb-2 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
			{errorMeta.title}
		</h1>
		<p class="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-500">
			{errorMeta.subtitle}
		</p>

		<!-- Direct Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<!-- Button 1: Kembali ke Halaman Sebelumnya -->
			<button
				onclick={handleGoBack}
				class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200/80 active:scale-95 sm:w-auto"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Kembali</span>
			</button>

			<!-- Button 2: Ke Beranda Utama -->
			<a
				href="/"
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-600/20 transition-all duration-200 hover:bg-sky-700 active:scale-95 sm:w-auto"
			>
				<Home class="h-4 w-4" />
				<span>Ke Beranda</span>
			</a>
		</div>

		<!-- Secondary Link: Refresh jika bermasalah -->
		<div class="mt-8 flex items-center justify-center gap-1 border-t border-slate-100 pt-6">
			<span class="text-xs text-slate-400">Masih mengalami kendala?</span>
			<button
				onclick={handleReload}
				class="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
			>
				<RotateCcw class="h-3 w-3" />
				<span>Coba Muat Ulang</span>
			</button>
		</div>
	</div>
</div>
