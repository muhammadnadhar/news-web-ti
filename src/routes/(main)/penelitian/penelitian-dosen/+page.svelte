<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import {
		FlaskConical,
		Calendar,
		AlertCircle,
		FileText,
		Sparkles,
		BookOpenCheck,
		ScrollText,
		AwardIcon
	} from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	// Format tanggal update/created secara reaktif
	let formattedDate = $derived.by(() => {
		const targetDate = data.researchData?.updated_at ?? data.researchData?.created_at;
		if (!targetDate) return '-';

		return new Date(targetDate).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	});

	let { data }: Props = $props();
</script>

<div class={`${classTopSpace} mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8`}>
	<div class="mb-10 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Penelitian Dosen
		</h1>
	</div>

	<!-- DAFTAR PENELITIAN DOSEN -->
	{#if data.researchData}
		<article
			class="border border-t-2 border-border-light border-t-accent-primary bg-bg-secondary shadow-sm transition-all duration-200"
		>
			<!-- Header Card -->
			<div
				class="flex flex-wrap items-center justify-between border-b border-border-light bg-bg-primary-glare px-6 py-4 sm:px-8"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center border border-border-light bg-bg-primary text-accent-primary"
					>
						<BookOpenCheck class="h-5 w-5" />
					</div>
					<div>
						<h2 class="text-base font-bold tracking-tight text-text-main sm:text-lg">
							Data & Rekapitulasi Penelitian
						</h2>
						<p class="text-[11px] text-text-muted">
							Dokumen Rekam Jejak Riset & Publikasi Ilmiah Dosen
						</p>
					</div>
				</div>

				<div
					class="mt-2 flex items-center gap-2 border border-border-light bg-bg-primary px-3 py-1.5 text-xs text-text-muted sm:mt-0"
				>
					<Calendar class="h-3.5 w-3.5 text-accent-primary" />
					<span
						>Diperbarui: <strong class="font-semibold text-text-main">{formattedDate}</strong></span
					>
				</div>
			</div>

			<!-- Content Area HTML -->
			<div class="p-6 sm:p-8">
				<div
					class="prose max-w-none overflow-x-auto text-text-main prose-invert
				prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-main
				prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
				prose-p:text-sm prose-p:leading-relaxed prose-p:text-text-main/90
				prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline
				prose-blockquote:border-l-2
				prose-blockquote:border-accent-primary prose-blockquote:bg-bg-primary/40 prose-blockquote:px-4 prose-blockquote:py-2.5
				prose-blockquote:text-text-muted prose-blockquote:not-italic prose-strong:text-text-main prose-ol:list-decimal prose-ul:list-disc
				prose-li:my-1 prose-li:text-sm prose-table:w-full prose-table:border-collapse prose-table:rounded-none prose-table:border prose-table:border-border-light prose-th:border prose-th:border-border-light prose-th:bg-bg-primary
				prose-th:p-3 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:tracking-wider
				prose-th:text-accent-primary prose-th:uppercase prose-td:border prose-td:border-border-light prose-td:p-3 prose-td:text-xs prose-td:text-text-main"
				>
					{@html data.researchData.description}
				</div>
			</div>

			<!-- Footer Card -->
			<div
				class="flex flex-wrap items-center justify-between gap-2 border-t border-border-light bg-bg-primary-glare/60 px-6 py-3 text-xs text-text-muted sm:px-8"
			>
				<span class="inline-flex items-center gap-2 font-medium text-accent-primary">
					<ScrollText class="h-4 w-4" />
					<span>Dokumen Resmi Rekapitulasi Riset</span>
				</span>
				<div class="flex items-center gap-1.5 text-[11px] text-text-muted">
					<AwardIcon class="h-3.5 w-3.5 text-accent-primary" />
					<span>Program Studi Teknik Informatika</span>
				</div>
			</div>
		</article>
	{:else}
		<!-- EMPTY STATE -->
		<EmptyData
			title={'Data Penelitian belum tersedia'}
			description={'Belum ada informasi atau rekapitulasi penelitian dosen yang dipublikasikan. Silakan cek kembali secara berkala.'}
		/>
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
