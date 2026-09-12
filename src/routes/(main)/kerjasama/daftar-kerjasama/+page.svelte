<script lang="ts">
	import { Handshake, Building2, ChevronRight } from 'lucide-svelte';
  import type { PartnershipDTO } from '$lib/types/admin/article/kerjasama';

	let { data } = $props();

	// Data kerjasama dari load server
	let partnerships = $derived<PartnershipDTO[]>(data.partnerships || []);
</script>

<svelte:head>
	<title>Daftar Kerjasama - Prodi Teknologi Informasi</title>
</svelte:head>

<!-- Banner / Page Header -->
<section class="relative overflow-hidden bg-scitech-navy/90 py-12 lg:py-16">
	<div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-scitech-mint/10 blur-3xl"></div>
	<div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>

	<div class="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
		<!-- Breadcrumb -->
		<nav class="mb-4 flex items-center gap-2 text-xs font-medium text-text-main/60">
			<a href="/" class="hover:text-scitech-mint transition-colors">Home</a>
			<ChevronRight class="h-3 w-3" />
			<a href="/kerjasama" class="hover:text-scitech-mint transition-colors">Kerjasama</a>
			<ChevronRight class="h-3 w-3" />
			<span class="text-scitech-mint font-semibold">Daftar Kerjasama</span>
		</nav>

		<div class="flex items-center gap-3">
			<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-scitech-mint/10 border border-scitech-mint/20 text-scitech-mint">
				<Handshake class="h-6 w-6" />
			</div>
			<div>
				<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl lg:text-4xl">
					Daftar Kerjasama
				</h1>
				<p class="mt-1 text-xs sm:text-sm text-text-muted">
					Kemitraan strategis Prodi Teknologi Informasi dengan berbagai instansi, lembaga, dan industri.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Content Grid Kolom-Kolom Mitra -->
<section class="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
	{#if partnerships.length > 0}
		<!-- Responsive Grid 4 Kolom -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each partnerships as item (item.id)}
				<div
					class="group relative flex flex-col items-center justify-between rounded-3xl border border-border-color/10 bg-scitech-slate/60 p-6 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-scitech-mint/40 hover:shadow-scitech-mint/10"
				>
					<!-- Box Logo Instansi -->
					<div
						class="mb-5 flex h-32 w-full items-center justify-center rounded-2xl bg-white/95 p-4 shadow-inner transition-transform duration-300 group-hover:scale-105"
					>
						{#if item.logo_url}
							<img
								src={item.logo_url}
								alt={item.institution_name}
								class="max-h-full max-w-full object-contain"
								loading="lazy"
							/>
						{:else}
							<div class="flex flex-col items-center gap-2 text-gray-400">
								<Building2 class="h-10 w-10 stroke-1" />
								<span class="text-[10px] font-medium">Logo Tidak Tersedia</span>
							</div>
						{/if}
					</div>

					<!-- Nama Instansi / Mitra -->
					<h2
						class="text-xs font-bold leading-relaxed text-text-main transition-colors duration-200 group-hover:text-scitech-mint sm:text-sm"
					>
						{item.institution_name}
					</h2>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div
			class="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-scitech-slate/40 py-16 text-center backdrop-blur-xl"
		>
			<Building2 class="h-12 w-12 text-text-main/30 mb-3" />
			<h3 class="text-base font-semibold text-text-main">Belum Ada Data Kerjasama</h3>
			<p class="mt-1 text-xs text-text-muted">Data mitra kerjasama akan segera diperbarui.</p>
		</div>
	{/if}
</section>
