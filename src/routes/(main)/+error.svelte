<script lang="ts">
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
		LayoutDashboard,
		ArrowLeft
	} from 'lucide-svelte';

	// Reaktivitas menggunakan Rune $derived() Svelte 5
	let status = $derived(page.status);
	let message = $derived(page.error?.message || 'Terjadi kesalahan sistem yang tidak terduga.');

	// Metadata UI berdasarkan status HTTP
	let errorMeta = $derived(getErrorMeta(status));

	function getErrorMeta(code: number) {
		switch (code) {
			case 400:
				return {
					title: 'Permintaan Tidak Valid (400)',
					subtitle: 'Format atau parameter data yang dikirimkan tidak sesuai.',
					icon: AlertCircle
				};
			case 401:
				return {
					title: 'Sesi Berakhir / Belum Login (401)',
					subtitle: 'Sesi Anda telah berakhir. Silakan login kembali ke akun Admin.',
					icon: Lock
				};
			case 403:
				return {
					title: 'Akses Ditolak (403)',
					subtitle: 'Anda tidak memiliki hak akses yang cukup untuk membuka fitur ini.',
					icon: ShieldAlert
				};
			case 404:
				return {
					title: 'Halaman Tidak Ditemukan (404)',
					subtitle: 'Halaman atau data admin yang Anda cari tidak tersedia.',
					icon: FileQuestion
				};
			case 500:
			default:
				return {
					title: 'Terjadi Kesalahan Server (500)',
					subtitle: 'Terjadi kendala teknis pada server atau database backend.',
					icon: ServerCrash
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
	class="flex min-h-screen items-center justify-center bg-bg-primary p-4 font-sans text-text-main"
>
	<div
		class="w-full max-w-lg border border-border-light bg-bg-secondary p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] sm:p-10"
	>
		<!-- Icon & Badge Header -->
		<div class="mb-6 inline-flex flex-col items-center justify-center">
			<div
				class="mb-4 inline-flex items-center justify-center border border-border-light bg-bg-primary p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
			>
				<svelte:component this={errorMeta.icon} class="h-10 w-10 text-status-error" />
			</div>

			<span
				class="border border-border-light bg-bg-primary px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-text-main shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
			>
				HTTP ERROR {status}
			</span>
		</div>

		<h1 class="mb-2 text-xl font-black text-text-main sm:text-2xl">
			{errorMeta.title}
		</h1>
		<p class="mb-6 text-sm leading-relaxed font-medium text-text-muted">
			{errorMeta.subtitle}
		</p>
		{#if message}
			<div
				class="mb-8 flex items-start gap-3 border border-border-light bg-bg-primary p-3.5 text-left shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
			>
				<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-status-error" />
				<div class="font-mono text-xs leading-relaxed break-all text-text-main">
					<span
						class="mb-0.5 block font-sans text-[10px] font-bold tracking-wider text-text-muted uppercase"
					>
						Pesan Detail:
					</span>
					{message}
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<button
				onclick={handleReload}
				class="inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-border-light bg-bg-primary px-5 py-2.5 text-sm font-bold text-text-main shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:bg-bg-primary/80 active:scale-95 sm:w-auto"
			>
				<RotateCcw class="h-4 w-4" />
				<span>Muat Ulang</span>
			</button>

			{#if status === 401}
				<a
					href="/admin/signIn"
					class="inline-flex w-full items-center justify-center gap-2 border border-border-light bg-accent-primary px-5 py-2.5 text-sm font-bold text-text-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95 sm:w-auto"
				>
					<LogIn class="h-4 w-4" />
					<span>Login Kembali</span>
				</a>
			{:else}
				<a
					href="/admin"
					class="inline-flex w-full items-center justify-center gap-2 border border-border-light bg-accent-primary px-5 py-2.5 text-sm font-bold text-text-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95 sm:w-auto"
				>
					<LayoutDashboard class="h-4 w-4" />
					<span>Dashboard Admin</span>
				</a>
			{/if}
		</div>

		<div class="mt-8 border-t border-border-light pt-6">
			<a
				href="/"
				class="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted transition-colors hover:text-text-main"
			>
				<ArrowLeft class="h-3.5 w-3.5" />
				<span>Kembali ke Halaman Publik</span>
			</a>
		</div>
	</div>
</div>
