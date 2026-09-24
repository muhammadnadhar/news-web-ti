<script lang="ts">
	import EmptyData from '../../_components/emptyData.svelte';
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
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
			<Target class="h-4 w-4" />
			<span>Profil & Tujuan</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			Visi & Misi Program Studi
		</h1>
		{#if formattedDate}
			<p
				class="mt-2 flex items-center justify-center gap-1.5 text-xs text-text-muted sm:justify-start"
			>
				<Calendar class="text-scitech-cyan h-3.5 w-3.5" />
				<span>Terakhir diperbarui: {formattedDate}</span>
			</p>
		{/if}
	</div>

	<!-- Content Section -->
	{#if data.visiMisiData && data.visiMisiData.content}
		<article
			class="prose-scitech bg-scitech-slate/40 prose max-w-none rounded-2xl border border-border-color p-6 backdrop-blur-md prose-invert sm:p-8 md:p-10"
		>
			<!-- Merender teks/tag HTML dari database -->
			{@html data.visiMisiData.content}
		</article>
	{:else}
		<!-- Empty State jika data belum tersedia -->

		<EmptyData
			title="Visi & Misi Belum Ditetapkan"
			description="Informasi Visi dan Misi belum diunggah atau dalam tahap penyesuaian. Silakan cek kembali di lain waktu."
		/>
	{/if}
</div>
