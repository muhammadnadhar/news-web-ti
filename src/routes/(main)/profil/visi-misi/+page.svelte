<script lang="ts">
	import type { PageData } from './$types';
	import { Target, Calendar, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Format tanggal pembaharuan terakhir
	let formattedDate = $derived(
		data.visiMisiData?.updated_at
			? new Date(data.visiMisiData.updated_at).toLocaleDateString('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})
			: null
	);
</script>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Header Section -->
	<div class="mb-8 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<Target class="h-4 w-4" />
			<span>Profil & Tujuan</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Visi & Misi Program Studi
		</h1>
		{#if formattedDate}
			<p class="mt-2 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-muted">
				<Calendar class="h-3.5 w-3.5 text-scitech-cyan" />
				<span>Terakhir diperbarui: {formattedDate}</span>
			</p>
		{/if}
	</div>

	<!-- Content Section -->
	{#if data.visiMisiData && data.visiMisiData.content}
		<article
			class="prose prose-invert prose-scitech max-w-none rounded-2xl border border-border-color bg-scitech-slate/40 p-6 backdrop-blur-md sm:p-8 md:p-10"
		>
			<!-- Merender teks/tag HTML dari database -->
			{@html data.visiMisiData.content}
		</article>
	{:else}
		<!-- Empty State jika data belum tersedia -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-text-main">Visi & Misi Belum Ditetapkan</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Informasi Visi dan Misi belum diunggah atau dalam tahap penyesuaian. Silakan cek kembali di lain waktu.
			</p>
		</div>
	{/if}
</div>


