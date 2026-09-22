<script lang="ts">
	import { Handshake, Building2, ChevronRight } from 'lucide-svelte';
	import type { PartnershipDTO } from '$lib/types/admin/article/kerjasama';
	import { classTopSpace } from '$lib/constants';

	let { data } = $props();

	// Data kerjasama dari load server
	let partnerships = $derived<PartnershipDTO[]>(data.partnerships || []);
</script>

<svelte:head>
	<title>Daftar Kerjasama - Prodi Teknologi Informasi</title>
</svelte:head>

<section
	class={` ${classTopSpace} relative overflow-hidden border-b border-border-color/40 bg-bg-secondary/90 py-12 lg:py-16`}
>
	<div
		class="bg-scitech-mint/10 pointer-events-none absolute -top-24 -left-24 h-96 w-96 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 bg-blue-500/10 blur-3xl"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
		<div class="flex items-center gap-4">
			<div
				class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint flex h-12 w-12 items-center justify-center border shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]"
			>
				<Handshake class="h-6 w-6" />
			</div>
			<div>
				<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl lg:text-4xl">
					Daftar Kerjasama
				</h1>
				<p class="mt-1 text-xs text-text-muted sm:text-sm">
					Kemitraan strategis Prodi Teknologi Informasi dengan berbagai instansi, lembaga, dan
					industri.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Content Grid Kolom-Kolom Mitra -->
<section class="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
	{#if partnerships.length > 0}
		<!-- Responsive Grid 4 Kolom -->
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each partnerships as item (item.id)}
				<div
					class="group bg-scitech-slate/50 hover:border-scitech-mint/60 relative flex flex-col items-center justify-between border border-border-color p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]"
				>
					<!-- Frame Khusus Logo Instansi (Sangat Bersih & Berkontras Tinggi) -->
					<div
						class="mb-5 flex h-36 w-full items-center justify-center border border-border-color bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-[1.02]"
					>
						{#if item.logo_url}
							<img
								src={item.logo_url}
								alt={item.institution_name}
								class="max-h-full max-w-full object-contain transition-all duration-300"
								loading="lazy"
							/>
						{:else}
							<div class="flex flex-col items-center gap-2 text-gray-400">
								<Building2 class="h-10 w-10 stroke-1" />
								<span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
									>Logo Tidak Tersedia</span
								>
							</div>
						{/if}
					</div>

					<!-- Nama Instansi / Mitra -->
					<div class="flex flex-1 items-center justify-center pt-1">
						<h2
							class="group-hover:text-scitech-mint text-xs leading-snug font-bold text-text-main transition-colors duration-200 sm:text-sm"
						>
							{item.institution_name}
						</h2>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- EMPTY STATE KOSONG -->
		<div
			class="bg-scitech-slate/20 flex flex-col items-center justify-center border border-border-color py-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] backdrop-blur-md"
		>
			<div
				class="mb-3 flex h-12 w-12 items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
			>
				<Building2 class="h-6 w-6" />
			</div>
			<h3 class="text-base font-semibold text-text-main">Belum Ada Data Kerjasama</h3>
			<p class="mt-1 text-xs text-text-muted">Data mitra kerjasama akan segera diperbarui.</p>
		</div>
	{/if}
</section>
