<script lang="ts">
	import Spin from '$lib/components/loading/spin.svelte';
	import { classShadowDown, classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import {
		GraduationCap,
		ExternalLink,
		BookOpen,
		UserCheck,
		AlertCircle,
		Search
	} from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State pencarian nama dosen
	let searchQuery = $state('');
</script>

<div class={`${classTopSpace} mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 pb-6 text-center sm:text-left">
		<div class="r mb-3 inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold">
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
			<div class="relative min-w-[260px]">
				<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari nama dosen..."
					class="w-full rounded-2xl border border-bg-secondary-hover bg-bg-primary py-2.5 pr-4 pl-10 text-xs text-text-main placeholder-text-muted transition-all outline-none focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow"
				/>
			</div>
		</div>
	</div>

	{#await data.streamed.publications}
		<Spin />
	{:then publications}
		{@const filteredPublications = publications.filter((item) =>
			(item.lecturer_name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
		)}

		<!-- Grid dokumen & publikasi dosen (Diubah menjadi 3 Kolom) -->
		{#if filteredPublications.length > 0}
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredPublications as item (item.id)}
					<article
						class={` ${classShadowDown} s flex flex-col justify-between overflow-hidden rounded-3xl border border-bg-secondary-hover bg-bg-secondary p-6 hover:border-accent-yellow/40 hover:shadow-xl`}
					>
						<div>
							<div
								class="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left"
							>
								{#if item.photo_url}
									<img
										src={item.photo_url}
										alt={item.lecturer_name}
										class="h-20 w-20 flex-shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-accent-yellow/30"
										onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
									/>
								{:else}
									<div
										class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-accent-yellow/20 bg-accent-yellow/10 text-accent-yellow shadow-sm"
									>
										<UserCheck class="h-8 w-8" />
									</div>
								{/if}
								<div class="overflow-hidden">
									<span
										class="mb-1 inline-block rounded-full bg-accent-yellow/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-accent-yellow uppercase"
									>
										Dosen Pengajar
									</span>
									<h2
										class="line-clamp-2 text-base font-bold text-text-main"
										title={item.lecturer_name}
									>
										{item.lecturer_name}
									</h2>
									{#if item.nidn}
										<p class="mt-1 text-xs font-medium text-text-muted">NIDN: {item.nidn}</p>
									{/if}
								</div>
							</div>
						</div>

						<!-- Tautan Profil Publikasi -->
						<div class="border-t border-bg-secondary-hover pt-4">
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
										class="inline-flex items-center justify-between rounded-2xl border border-accent-yellow/30 bg-accent-yellow/10 px-4 py-2.5 text-xs font-semibold text-accent-yellow transition-colors hover:bg-accent-yellow/20"
									>
										<span class="flex items-center gap-2">
											<BookOpen class="h-4 w-4" />
											<span>Profil SINTA</span>
										</span>
										<ExternalLink class="h-3.5 w-3.5 opacity-70" />
									</a>
								{:else}
									<div
										class="rounded-2xl border border-bg-secondary-hover bg-bg-primary/50 px-4 py-2.5 text-xs text-text-muted"
									>
										SINTA: Tidak tersedia
									</div>
								{/if}

								<!-- Link Google Scholar -->
								{#if item.scholar_link}
									<a
										href={item.scholar_link}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center justify-between rounded-2xl border border-accent-blue/30 bg-accent-blue/10 px-4 py-2.5 text-xs font-semibold text-accent-blue transition-colors hover:bg-accent-blue/20"
									>
										<span class="flex items-center gap-2">
											<GraduationCap class="h-4 w-4" />
											<span>Google Scholar</span>
										</span>
										<ExternalLink class="h-3.5 w-3.5 opacity-70" />
									</a>
								{:else}
									<div
										class="rounded-2xl border border-bg-secondary-hover bg-bg-primary/50 px-4 py-2.5 text-xs text-text-muted"
									>
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
			<EmptyData
				title="Publikasi Dosen Tidak Ditemukan"
				description={`Tidak ada dosen yang cocok dengan kata kunci "${searchQuery}"`}
			/>
		{:else}
			<!-- EMPTY STATE DATA KOSONG -->
			<EmptyData
				title="Data Publikasi Belum Tersedia"
				description="Belum ada data publikasi dosen yang ditambahkan ke direktori."
			/>
		{/if}
	{:catch error}
		<div class="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">
			<p>Gagal memuat data dari server. Silakan muat ulang halaman.</p>
		</div>
	{/await}
</div>
