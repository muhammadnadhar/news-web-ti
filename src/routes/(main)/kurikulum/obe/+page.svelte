<script lang="ts">
	import type { PageData } from './$types';
	import { BookOpen, Calendar, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Format tanggal pembaharuan
	let formattedDate = $derived(
		data.obeData?.updated_at
			? new Date(data.obeData.updated_at).toLocaleDateString('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})
			: null
	);
</script>

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- Header Section -->
	<div class="mb-8 border-b border-border-color/40 pb-6">
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
			<BookOpen class="h-4 w-4" />
			<span>Akademik & Kurikulum</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			Kurikulum Outcome-Based Education (OBE)
		</h1>
		{#if formattedDate}
			<p class="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
				<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
				<span>Terakhir diperbarui: {formattedDate}</span>
			</p>
		{/if}
	</div>

	<!-- Content Section -->
	{#if data.obeData && data.obeData.description}
		<div
			class="prose-scitech bg-scitech-slate/40 prose max-w-none rounded-2xl border border-border-color p-6 backdrop-blur-md prose-invert sm:p-8"
		>
			<!-- Merender teks/tag HTML dari database -->
			{@html data.obeData.description}
		</div>
	{:else}
		<!-- Empty State jika data kosong -->
		<div
			class="bg-scitech-slate/20 flex flex-col items-center justify-center rounded-2xl border border-border-color p-12 text-center backdrop-blur-md"
		>
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"
			>
				<AlertCircle class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-bold text-white">Informasi Belum Tersedia</h3>
			<p class="mt-1 max-w-md text-xs text-text-muted">
				Data Kurikulum OBE belum dipublikasikan atau masih dalam tahap penyusunan. Silakan cek
				kembali di lain waktu.
			</p>
		</div>
	{/if}
</section>

<style>
	/* Styling tambahan jika tag HTML bawaan memerlukan perbaikan typography */
	:global(.prose a) {
		color: #2dd4bf;
		text-decoration: underline;
		transition: color 0.2s;
	}
	:global(.prose a:hover) {
		color: #5eead4;
	}
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose ol) {
		list-style-type: decimal;
		padding-left: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
