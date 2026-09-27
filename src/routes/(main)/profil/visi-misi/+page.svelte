<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { Target, Calendar, Loader2 } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Helper format tanggal pembaharuan terakhir
	function formatDate(dateString?: string | Date | null) {
		if (!dateString) return null;
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<div class={`${classTopSpace} mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8`}>
	{#await data.visiMisiData}
		<div class="mb-8 border-border-color pb-6 text-center sm:text-left">
			<div
				class="mb-3 inline-flex items-center gap-2 border border-border-color bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-muted"
			>
				<Target class="h-4 w-4 text-accent-primary" />
				<span>Profil & Tujuan</span>
			</div>
			<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
				Visi & Misi Program Studi
			</h1>
			<p
				class="mt-2 flex items-center justify-center gap-2 text-xs text-text-muted sm:justify-start"
			>
				<Loader2 class="h-3.5 w-3.5 animate-spin text-accent-primary" />
				<span>Memuat Visi & Misi...</span>
			</p>
		</div>

		<div
			class="space-y-4 border border-border-color bg-bg-secondary/40 p-6 backdrop-blur-md sm:p-8 md:p-10"
		>
			<div class="h-6 w-1/3 animate-pulse bg-bg-secondary"></div>
			<div class="h-4 w-full animate-pulse bg-bg-secondary/60"></div>
			<div class="h-4 w-5/6 animate-pulse bg-bg-secondary/60"></div>
			<div class="h-4 w-4/6 animate-pulse bg-bg-secondary/60"></div>
		</div>
	{:then visiMisiData}
		<div class="mb-8 border-border-color pb-6 text-center sm:text-left">
			<div
				class="mb-3 inline-flex items-center gap-2 border border-border-color bg-accent-primary-dim/30 px-3 py-1 text-xs font-semibold text-accent-primary"
			>
				<Target class="h-4 w-4" />
				<span>Profil & Tujuan</span>
			</div>
			<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
				Visi & Misi Program Studi
			</h1>
			{#if visiMisiData?.updated_at}
				<p
					class="mt-2 flex items-center justify-center gap-1.5 text-xs text-text-muted sm:justify-start"
				>
					<Calendar class="h-3.5 w-3.5 text-accent-cyan" />
					<span>Terakhir diperbarui: {formatDate(visiMisiData.updated_at)}</span>
				</p>
			{/if}
		</div>

		{#if visiMisiData && visiMisiData.content}
			<article
				class="prose-scitech prose max-w-none border border-border-color bg-bg-secondary/40 p-6 backdrop-blur-md prose-invert sm:p-8 md:p-10"
			>
				{@html visiMisiData.content}
			</article>
		{:else}
			<EmptyData
				title="Visi & Misi Belum Ditetapkan"
				description="Informasi Visi dan Misi belum diunggah atau dalam tahap penyesuaian. Silakan cek kembali di lain waktu."
			/>
		{/if}
	{:catch error}
		<!-- Error State -->
		<div class="border border-status-error/40 bg-status-error/10 p-6 text-center text-status-error">
			<p class="text-sm font-semibold">Gagal memuat Visi & Misi: {error.message}</p>
		</div>
	{/await}
</div>
