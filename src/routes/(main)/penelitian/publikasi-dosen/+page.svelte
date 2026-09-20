<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import type { PageData } from './$types';
	import { GraduationCap, ExternalLink, BookOpen, UserCheck, AlertCircle, Search } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State pencarian nama dosen
	let searchQuery = $state('');

	// Filter dosen berdasarkan input pencarian
	let filteredPublications = $derived(
		data.publications?.filter((item) =>
			item.lecturer_name.toLowerCase().includes(searchQuery.toLowerCase())
		) ?? []
	);
</script>

<div class={`mx-auto ${classTopSpace} max-w-7xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<GraduationCap class="h-4 w-4" />
			<span>Riset & Portofolio Akademik</span>
		</div>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
					Publikasi & Profil Dosen
				</h1>
				<p class="mt-2 text-sm text-text-muted">
					Daftar direktori publikasi ilmiah, rekam jejak riset, dan tautan profil akademis dosen.
				</p>
			</div>

			<!-- Input Pencarian Dosen -->
			{#if data.publications && data.publications.length > 0}
				<div class="relative min-w-[260px]">
					<Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama dosen..."
						class="w-full rounded-xl border border-border-color bg-scitech-slate/60 py-2.5 pl-10 pr-4 text-xs text-text-main placeholder-text-muted outline-none transition-all focus:border-scitech-mint focus:ring-1 focus:ring-scitech-mint"
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- GRID DOKUMEN & PUBLIKASI DOSEN -->
	{#if filteredPublications.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredPublications as item (item.id)}
				<article class="flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-scitech-mint/40 hover:shadow-xl">
					<div>
						<!-- Avatar / Icon Dosen -->
						<div class="mb-4 flex items-center gap-3">
							<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-scitech-mint/20 bg-scitech-mint/10 text-scitech-mint">
								<UserCheck class="h-6 w-6" />
							</div>
							<div>
								<span class="text-[10px] font-bold uppercase tracking-wider text-scitech-cyan">
									Dosen Pengajar
								</span>
								<h2 class="text-base font-bold text-text-main line-clamp-2" title={item.lecturer_name}>
									{item.lecturer_name}
								</h2>
							</div>
						</div>
					</div>

					<!-- Tautan Profil Publikasi -->
					<div class="mt-6 border-t border-border-color/30 pt-4">
						<span class="mb-2.5 block text-[11px] font-semibold text-text-muted">
							Tautan Portfolio Riset:
						</span>
						<div class="flex flex-col gap-2">
							<!-- Link SINTA -->
							{#if item.sinta_link}
								<a
									href={item.sinta_link}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
								>
									<span class="flex items-center gap-2">
										<BookOpen class="h-3.5 w-3.5" />
										<span>Profil SINTA</span>
									</span>
									<ExternalLink class="h-3.5 w-3.5 opacity-70" />
								</a>
							{:else}
								<div class="rounded-xl border border-border-color/20 bg-scitech-navy/30 px-3.5 py-2 text-[11px] text-text-muted">
									SINTA: Tidak tersedia
								</div>
							{/if}

							<!-- Link Google Scholar -->
							{#if item.scholar_link}
								<a
									href={item.scholar_link}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-400 transition-colors hover:bg-sky-500/20"
								>
									<span class="flex items-center gap-2">
										<GraduationCap class="h-3.5 w-3.5" />
										<span>Google Scholar</span>
									</span>
									<ExternalLink class="h-3.5 w-3.5 opacity-70" />
								</a>
							{:else}
								<div class="rounded-xl border border-border-color/20 bg-scitech-navy/30 px-3.5 py-2 text-[11px] text-text-muted">
									Scholar: Tidak tersedia
								</div>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	{:else if searchQuery}
		<!-- EMPTY STATE PENCARIAN -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<Search class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Dosen Tidak Ditemukan</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Tidak ada dosen yang cocok dengan kata kunci "<span class="text-text-main">{searchQuery}</span>".
			</p>
		</div>
	{:else}
		<!-- EMPTY STATE DATA KOSONG -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Data Publikasi Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Belum ada data publikasi dosen yang ditambahkan ke direktori.
			</p>
		</div>
	{/if}
</div>
