<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { User, BookOpen, Calendar, Search, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// State pencarian nama mahasiswa
	let searchQuery = $state('');

	// Filter data berdasarkan input pencarian
	let filteredPublications = $derived(
		data.publications?.filter((item) =>
			item.student_name.toLowerCase().includes(searchQuery.toLowerCase())
		) ?? []
	);
</script>

<div class={` ${classTopSpace} mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
			<BookOpen class="h-4 w-4" />
			<span>Karya Ilmiah Mahasiswa</span>
		</div>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
					Publikasi Mahasiswa
				</h1>
				<p class="mt-2 text-sm text-text-muted">
					Daftar karya tulis, artikel ilmiah, dan jurnal terpublikasi hasil riset mahasiswa.
				</p>
			</div>

			<!-- Input Pencarian -->
			{#if data.publications && data.publications.length > 0}
				<div class="relative min-w-[260px]">
					<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama mahasiswa..."
						class="bg-scitech-slate/60 focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-border-color py-2.5 pr-4 pl-10 text-xs text-text-main placeholder-text-muted transition-all outline-none focus:ring-1"
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- GRID DOKUMEN & PUBLIKASI MAHASISWA -->
	{#if filteredPublications.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredPublications as item (item.id)}
				{@const formattedDate = item.updated_at
					? new Date(item.updated_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article
					class="bg-scitech-slate/40 hover:border-scitech-mint/40 flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="p-6">
						<!-- Informasi Mahasiswa -->
						<div class="mb-5 flex items-center gap-3 border-b border-border-color/30 pb-4">
							<div
								class="border-scitech-mint/20 bg-scitech-mint/10 text-scitech-mint flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border"
							>
								<User class="h-5 w-5" />
							</div>
							<div>
								<span class="text-scitech-cyan text-[10px] font-bold tracking-wider uppercase">
									Penulis Utama
								</span>
								<h2
									class="line-clamp-1 text-base font-bold text-text-main"
									title={item.student_name}
								>
									{item.student_name}
								</h2>
							</div>
						</div>

						<!-- Daftar Jurnal / HTML List -->
						<div class="prose-scitech prose max-w-none text-xs prose-invert">
							<span class="mb-2 block font-semibold text-text-muted">Daftar Publikasi Jurnal:</span>
							{@html item.journal_list}
						</div>
					</div>

					<!-- Footer Card -->
					<div
						class="bg-scitech-navy/40 flex items-center justify-between border-t border-border-color/30 px-6 py-3 text-[11px] text-text-muted"
					>
						<div class="flex items-center gap-1.5">
							<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
							<span>Diperbarui: {formattedDate}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{:else if searchQuery}
		<!-- empty state pencarian -->
		<EmptyData
			title="Mahasiswa Tidak Ditemukan"
			description={`Tidak ada publikasi mahasiswa yang cocok dengan kata kunci ${searchQuery} `}
		/>
	{:else}
		<!-- empty state data kosong -->
		<EmptyData
			title="Data Publikasi Mahasiswa Belum Tersedia"
			description="				Belum ada data publikasi mahasiswa yang diunggah."
		/>
	{/if}
</div>

<style>
	/* Styling typography untuk tag <ul> <li> <a> di dalam journal_list */
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		margin-top: 0.25rem;
		margin-bottom: 0.5rem;
		color: #cbd5e1;
	}
	:global(.prose ol) {
		list-style-type: decimal;
		padding-left: 1.25rem;
		margin-top: 0.25rem;
		margin-bottom: 0.5rem;
		color: #cbd5e1;
	}
	:global(.prose li) {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}
	:global(.prose a) {
		color: #38bdf8;
		text-decoration: underline;
		word-break: break-all;
	}
	:global(.prose a:hover) {
		color: #2dd4bf;
	}
</style>
