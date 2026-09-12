<script lang="ts">
	import type { PageData } from './$types';
	import { FlaskConical, Calendar, AlertCircle, FileText } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- HEADER HALAMAN -->
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<FlaskConical class="h-4 w-4" />
			<span>Riset & Pengabdian</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			Penelitian Dosen
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Rekapitulasi karya riset, hibah penelitian, serta rekam jejak publikasi ilmiah para dosen.
		</p>
	</div>

	<!-- DAFTAR PENELITIAN DOSEN -->
	{#if data.researchList && data.researchList.length > 0}
		<div class="space-y-10">
			{#each data.researchList as item, index (item.id)}
				{@const formattedDate = item.updated_at
					? new Date(item.updated_at).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})
					: '-'}

				<article class="overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md transition-all duration-300 hover:border-scitech-mint/40">
					<!-- Header Card -->
					<div class="flex items-center justify-between border-b border-border-color/40 bg-scitech-navy/60 px-6 py-4 sm:px-8">
						<div class="flex items-center gap-3">
							<span class="flex h-8 w-8 items-center justify-center rounded-xl bg-scitech-mint/10 text-xs font-bold text-scitech-mint border border-scitech-mint/20">
								#{index + 1}
							</span>
							<h2 class="text-base font-bold text-white sm:text-lg">Data & Rekapitulasi Penelitian</h2>
						</div>
						<div class="flex items-center gap-1.5 text-xs text-text-muted">
							<Calendar class="h-3.5 w-3.5 text-scitech-cyan" />
							<span>Diperbarui: {formattedDate}</span>
						</div>
					</div>

					<!-- Content Area HTML -->
					<div class="p-6 sm:p-8">
						<div class="prose prose-invert prose-scitech max-w-none overflow-x-auto">
							{@html item.description}
						</div>
					</div>

					<!-- Footer Card -->
					<div class="border-t border-border-color/30 bg-scitech-navy/40 px-6 py-3 sm:px-8 flex items-center justify-between text-xs text-text-muted">
						<span class="inline-flex items-center gap-1.5 text-scitech-cyan font-medium">
							<FileText class="h-4 w-4" />
							Dokumen Rekapitulasi Riset
						</span>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<!-- EMPTY STATE -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-white">Data Penelitian Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Belum ada informasi atau rekapitulasi penelitian dosen yang dipublikasikan. Silakan cek kembali secara berkala.
			</p>
		</div>
	{/if}
</div>

<style>
	/* Styling typography khusus untuk mendukung elemen HTML yang di-render lewat {@html} */
	:global(.prose h1),
	:global(.prose h2),
	:global(.prose h3),
	:global(.prose h4) {
		color: #ffffff;
		font-weight: 700;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose h3) {
		font-size: 1.125rem;
		color: #2dd4bf;
	}
	:global(.prose p) {
		color: #cbd5e1;
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		margin-top: 0.5rem;
		margin-bottom: 0.75rem;
		color: #cbd5e1;
	}
	:global(.prose ol) {
		list-style-type: decimal;
		padding-left: 1.25rem;
		margin-top: 0.5rem;
		margin-bottom: 0.75rem;
		color: #cbd5e1;
	}
	:global(.prose li) {
		margin-bottom: 0.375rem;
		line-height: 1.6;
	}
	:global(.prose a) {
		color: #38bdf8;
		text-decoration: underline;
		transition: color 0.2s;
	}
	:global(.prose a:hover) {
		color: #2dd4bf;
	}
	/* Styling Tabel Rekapitulasi jika ada di dalam deskripsi HTML */
	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	:global(.prose th) {
		background-color: rgba(15, 23, 42, 0.8);
		color: #2dd4bf;
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		text-align: left;
		font-size: 0.875rem;
	}
	:global(.prose td) {
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #cbd5e1;
		font-size: 0.875rem;
	}
	:global(.prose tr:nth-child(even)) {
		background-color: rgba(255, 255, 255, 0.02);
	}
</style>
