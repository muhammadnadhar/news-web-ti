<script lang="ts">
	// Menggunakan state bawaan Svelte 5 & SvelteKit terbaru
	import { page } from '$app/state';
	import {
		ServerCrash,
		FileQuestion,
		ShieldAlert,
		Lock,
		AlertCircle,
		AlertTriangle,
		RotateCcw,
		LogIn,
		LayoutDashboard
	} from 'lucide-svelte';

	// Reaktivitas menggunakan Rune $derived() dari Svelte 5
	let status = $derived(page.status);
	let message = $derived(page.error?.message || 'Terjadi kesalahan sistem yang tidak terduga.');

	// Mendapatkan metadata UI secara reaktif berdasarkan status HTTP
	let errorMeta = $derived(getErrorMeta(status));

	function getErrorMeta(code: number) {
		switch (code) {
			case 400:
				return {
					title: 'Permintaan Tidak Valid (400)',
					subtitle: 'Format atau parameter data yang dikirimkan tidak sesuai.',
					icon: AlertCircle,
					accentColor: 'text-yellow-400',
					badgeBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
				};
			case 401:
				return {
					title: 'Sesi Berakhir / Belum Login (401)',
					subtitle: 'Sesi Anda telah berakhir. Silakan login kembali ke akun Admin.',
					icon: Lock,
					accentColor: 'text-amber-400',
					badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
				};
			case 403:
				return {
					title: 'Akses Ditolak (403)',
					subtitle: 'Anda tidak memiliki hak akses yang cukup untuk membuka fitur ini.',
					icon: ShieldAlert,
					accentColor: 'text-orange-400',
					badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400'
				};
			case 404:
				return {
					title: 'Halaman Tidak Ditemukan (404)',
					subtitle: 'Halaman atau data admin yang Anda cari tidak tersedia.',
					icon: FileQuestion,
					accentColor: 'text-sky-400',
					badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400'
				};
			case 500:
			default:
				return {
					title: 'Terjadi Kesalahan Server (500)',
					subtitle: 'Terjadi kendala teknis pada server atau database backend.',
					icon: ServerCrash,
					accentColor: 'text-rose-400',
					badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
				};
		}
	}

	function handleReload() {
		window.location.reload();
	}
</script>

<svelte:head>
	<title>{status} - {errorMeta.title} | Admin Panel</title>
</svelte:head>

<div
	class="bg-scitech-navy relative flex min-h-screen items-center justify-center overflow-hidden p-4 font-sans"
>
	<!-- Aesthetic Background Glows -->
	<div
		class="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-600/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-rose-600/10 blur-3xl"
	></div>

	<!-- Main Error Card -->
	<div
		class="bg-scitech-navy-glare/90 border-scitech-slate/40 relative z-10 w-full max-w-lg rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
	>
		<!-- Status Code Badge & Icon -->
		<div class="mb-6 inline-flex flex-col items-center justify-center">
			<div
				class="bg-scitech-slate/30 border-scitech-slate/50 mb-4 rounded-2xl border p-4 shadow-inner"
			>
				<svelte:component
					this={errorMeta.icon}
					class="h-12 w-12 {errorMeta.accentColor} stroke-[1.5]"
				/>
			</div>
			<span
				class="rounded-full border px-3.5 py-1 font-mono text-xs font-bold tracking-wider {errorMeta.badgeBg}"
			>
				HTTP ERROR {status}
			</span>
		</div>

		<!-- Title & Subtitle -->
		<h1 class="mb-2 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
			{errorMeta.title}
		</h1>
		<p class="mb-6 text-sm leading-relaxed text-slate-400">
			{errorMeta.subtitle}
		</p>

		<!-- System Error Message Box -->
		{#if message}
			<div
				class="bg-scitech-slate/30 border-scitech-slate/40 mb-8 flex items-start gap-3 rounded-xl border p-3.5 text-left"
			>
				<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
				<div class="font-mono text-xs leading-relaxed break-all text-slate-300">
					<span
						class="mb-0.5 block font-sans text-[10px] font-semibold tracking-wider text-slate-500 uppercase"
						>Pesan Detail:</span
					>
					{message}
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<!-- Button: Muat Ulang -->
			<button
				onclick={handleReload}
				class="bg-scitech-slate/60 hover:bg-scitech-slate border-scitech-slate/50 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 active:scale-95 sm:w-auto"
			>
				<RotateCcw class="h-4 w-4" />
				<span>Muat Ulang</span>
			</button>

			<!-- Button: Kondisional Berdasarkan Status Error -->
			{#if status === 401}
				<a
					href="/login"
					class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition-all duration-200 hover:bg-sky-500 active:scale-95 sm:w-auto"
				>
					<LogIn class="h-4 w-4" />
					<span>Login Kembali</span>
				</a>
			{:else}
				<a
					href="/admin"
					class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition-all duration-200 hover:bg-sky-500 active:scale-95 sm:w-auto"
				>
					<LayoutDashboard class="h-4 w-4" />
					<span>Dashboard Admin</span>
				</a>
			{/if}
		</div>

		<!-- Footer Link -->
		<div class="border-scitech-slate/30 mt-8 border-t pt-6">
			<a
				href="/"
				class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-sky-400"
			>
				← Kembali ke Halaman Publik
			</a>
		</div>
	</div>
</div>
