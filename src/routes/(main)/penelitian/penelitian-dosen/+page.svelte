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

	{#if data.researchData}
		<article
			class="border border-t-4 border-border-light border-t-accent-primary bg-bg-secondary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-200"
		>
			<div
				class="flex flex-wrap items-center justify-between border-b border-border-light bg-bg-primary-glare px-6 py-4 sm:px-8"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center border border-border-light bg-bg-primary text-accent-cyan shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
					>
						<BookOpenCheck class="h-5 w-5" />
					</div>
					<div>
						<h2 class="text-base font-bold tracking-tight text-text-main sm:text-lg">
							Data & Rekapitulasi Penelitian
						</h2>
						<p class="text-[11px] font-medium text-text-muted">
							Dokumen Rekam Jejak Riset & Publikasi Ilmiah Dosen
						</p>
					</div>
				</div>

				<div
					class="mt-2 flex items-center gap-2 border border-border-light bg-bg-primary px-3 py-1.5 text-xs text-text-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] sm:mt-0"
				>
					<Calendar class="h-3.5 w-3.5 text-accent-cyan" />
					<span
						>Diperbarui: <strong class="font-semibold text-text-main">{formattedDate}</strong></span
					>
				</div>
			</div>

			<!-- Content Body (Prose) -->
			<div class="p-6 sm:p-8">
				<div
					class="prose max-w-none overflow-x-auto text-text-main
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-main
            prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
            prose-p:text-sm prose-p:leading-relaxed prose-p:text-text-main
            prose-a:font-semibold prose-a:text-accent-cyan prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-2
            prose-blockquote:border-accent-cyan prose-blockquote:bg-bg-primary/60 prose-blockquote:px-4 prose-blockquote:py-2.5
            prose-blockquote:not-italic prose-strong:text-text-main prose-ol:list-decimal prose-ul:list-disc
            prose-li:my-1 prose-li:text-sm
            prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border-light
            prose-th:border prose-th:border-border-light prose-th:bg-bg-primary-glare
            prose-th:p-3 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:tracking-wider
            prose-th:text-text-main prose-th:uppercase
            prose-td:border prose-td:border-border-light prose-td:p-3 prose-td:text-xs prose-td:text-text-main"
				>
					{@html data.researchData.description}
				</div>
			</div>

			<!-- Footer Card -->
			<div
				class="flex flex-wrap items-center justify-between gap-2 border-t border-border-light bg-bg-primary-glare/60 px-6 py-3 text-xs text-text-main sm:px-8"
			>
				<span class="inline-flex items-center gap-2 font-semibold text-text-main">
					<ScrollText class="h-4 w-4 text-accent-cyan" />
					<span>Dokumen Resmi Rekapitulasi Riset</span>
				</span>
				<div class="flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
					<AwardIcon class="h-3.5 w-3.5 text-accent-cyan" />
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
