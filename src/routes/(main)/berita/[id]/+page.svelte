<script lang="ts">
	import { Calendar, Folder, ArrowLeft, Share2, Check, Newspaper, Clock } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Spin from '$lib/components/loading/spin.svelte';
	import { classTopSpace } from '$lib/constants';

	let { data }: { data: PageData } = $props();

	let copied = $state(false);

	// Helper format tanggal
	function formatDate(dateString: Date | string) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	// Helper estimasi waktu baca (kata / 200)
	function calculateReadTime(content: string) {
		const plainText = content.replace(/<[^>]*>?/gm, '');
		const words = plainText.trim().split(/\s+/).length;
		const minutes = Math.ceil(words / 200);
		return `${minutes} min baca`;
	}

	// Copy Link Handler
	function copyToClipboard() {
		if (typeof window !== 'undefined') {
			navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<div class={` ${classTopSpace} mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6`}>
	<!-- Container Berita dengan Streaming Data -->
	{#await data.news}
		<Spin />
	{:then news}
		<article class="space-y-8 border border-border-color bg-bg-secondary p-6 sm:p-10">
			<header class="space-y-4 border-b border-border-color/10 pb-6">
				<div class="flex flex-wrap items-center justify-between gap-3">
					{#if news.category_name}
						<span
							class="text-scitech-mint border-scitech-mint/30 inline-flex items-center gap-1.5 border bg-bg-secondary/10 px-3 py-1 text-xs font-bold tracking-wider uppercase"
						>
							<Folder class="h-3.5 w-3.5" />
							{news.category_name}
						</span>
					{/if}

					<span class="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted">
						<Clock class="h-3.5 w-3.5" />
						{calculateReadTime(news.content)}
					</span>
				</div>

				<!-- Judul Berita -->
				<h1 class="text-2xl leading-tight font-extrabold tracking-tight text-text-main sm:text-4xl">
					{news.title}
				</h1>

				<!-- Meta Bottom: Tanggal & Aksi Share -->
				<div class="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-text-muted">
					<div class="inline-flex items-center gap-2 font-mono">
						<Calendar class="text-scitech-cyan h-4 w-4" />
						<span>Diterbitkan pada {formatDate(news.published_at)}</span>
					</div>

					<button
						onclick={copyToClipboard}
						class="bg-scitech-navy inline-flex items-center gap-2 border border-border-color/15 px-3 py-1.5 text-xs font-semibold text-text-main transition-colors hover:bg-white/10"
						title="Bagikan Tautan"
					>
						{#if copied}
							<Check class="text-scitech-mint h-3.5 w-3.5" />
							<span class="text-scitech-mint font-mono">Tautan Disalin!</span>
						{:else}
							<Share2 class="h-3.5 w-3.5 text-text-muted" />
							<span>Bagikan</span>
						{/if}
					</button>
				</div>
			</header>

			{#if news.image_url}
				<div class="overflow-hidden border border-border-color/10 bg-black/40">
					<img src={news.image_url} alt={news.title} class="max-h-[480px] w-full object-cover" />
				</div>
			{/if}

			<!-- Isi Konten Berita -->
			<div
				class="prose max-w-none space-y-4 text-sm leading-relaxed text-text-main prose-invert sm:text-base"
			>
				{#if news.content.includes('<')}
					{@html news.content}
				{:else}
					{#each news.content.split('\n\n') as paragraph}
						<p>{paragraph}</p>
					{/each}
				{/if}
			</div>

			<footer class="border-t border-border-color/10 pt-6">
				<div class="flex items-center justify-between">
					<span class="font-mono text-xs text-text-muted">
						ID Artikel: <span class="font-bold text-text-main">{news.id}</span>
					</span>

					<a
						href="/berita"
						class="text-scitech-cyan hover:text-scitech-mint inline-flex items-center gap-2 text-xs font-bold transition-colors"
					>
						<ArrowLeft class="h-3.5 w-3.5" />
						<span>Kembali ke Indeks Berita</span>
					</a>
				</div>
			</footer>
		</article>
	{:catch error}
		<!-- Error State / 404 Not Found -->
		<div class="space-y-4 border border-red-500/40 bg-red-500/10 p-8 text-center">
			<Newspaper class="mx-auto h-12 w-12 text-red-400 opacity-60" />
			<div class="space-y-1">
				<h2 class="text-lg font-bold text-red-400">Terjadi Kesalahan</h2>
				<p class="text-xs text-text-muted sm:text-sm">{error.message || 'Gagal memuat berita.'}</p>
			</div>
			<div>
				<button
					onclick={() => history.back()}
					class="bg-scitech-navy inline-flex items-center gap-2 border border-border-color/15 px-4 py-2 text-xs font-bold text-text-main transition-colors hover:bg-white/10"
				>
					<ArrowLeft class="h-4 w-4" />
					<span>Kembali ke Berita</span>
				</button>
			</div>
		</div>
	{/await}
</div>
