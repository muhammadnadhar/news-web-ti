<script lang="ts">
	import Spin from '$lib/components/loading/spin.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		Search,
		Filter,
		FileText,
		FlaskConical,
		PackageOpen,
		ExternalLink,
		Maximize2,
		XIcon
	} from 'lucide-svelte';
	import BtnFloatPagination from '$lib/components/admin/btnFloatPagination.svelte';
	import { classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';

	let { data } = $props();

	// Read initial query params from URL
	let searchQuery = $state($page.url.searchParams.get('search') || '');
	let selectedCategory = $state($page.url.searchParams.get('category') || '');

	let selectedFacility = $state<any>(null);

	// Debounce / Trigger pencarian & filter ke server via URL Search Params
	function applyFilters() {
		const url = new URL($page.url);

		if (searchQuery.trim()) {
			url.searchParams.set('search', searchQuery.trim());
		} else {
			url.searchParams.delete('search');
		}

		if (selectedCategory) {
			url.searchParams.set('category', selectedCategory);
		} else {
			url.searchParams.delete('category');
		}

		// Reset ke halaman 1 setiap kali filter berubah
		url.searchParams.set('page', '1');

		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function openModal(facility: any) {
		selectedFacility = facility;
	}

	function closeModal() {
		selectedFacility = null;
	}

	function resetFilters() {
		searchQuery = '';
		selectedCategory = '';
		const url = new URL($page.url);
		url.searchParams.delete('search');
		url.searchParams.delete('category');
		url.searchParams.set('page', '1');
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	// Helper navigasi paginasi
	function goToPage(targetPage: number) {
		const url = new URL($page.url);
		url.searchParams.set('page', targetPage.toString());
		goto(url.toString(), { keepFocus: true });
		window.scrollTo({ top: 300, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Fasilitas & Peralatan Laboratorium</title>
</svelte:head>

<section class={`${classTopSpace}  min-h-screen px-4 py-12 text-text-main md:px-8`}>
	<div class="mx-auto max-w-7xl space-y-10">
		<div class="space-y-4">
			<div
				class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint inline-flex gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
			>
				<FlaskConical class="h-4 w-4" />
				<span>Katalog Fasilitas & Peralatan</span>
			</div>
			<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
				Fasilitas Laboratorium
			</h1>
			<p class=" max-w-2xl text-sm text-text-muted sm:text-base">
				Jelajahi berbagai peralatan canggih dan fasilitas pendukung riset yang tersedia di
				laboratorium kami.
			</p>
		</div>

		<!-- Filter & Pencarian Bar -->
		{#await data.categoriesPromise}
			<div>
				<Spin />
			</div>
		{:then categories}
			<div
				class="flex flex-col gap-4 rounded-2xl border border-border-color/10 bg-white/5 p-4 backdrop-blur-md md:flex-row md:items-center md:justify-between"
			>
				<!-- Search Bar -->
				<div class="relative flex-1">
					<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						bind:value={searchQuery}
						oninput={applyFilters}
						placeholder="Cari alat, merk, atau spesifikasi..."
						class="focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-border-color/10 bg-black/20 py-2.5 pr-4 pl-10 text-sm text-text-main placeholder-text-muted focus:ring-1 focus:outline-none"
					/>
				</div>

				<!-- Category Filter -->
				<div class="flex items-center gap-3">
					<div class="relative min-w-[180px]">
						<Filter class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
						<select
							bind:value={selectedCategory}
							onchange={applyFilters}
							class="focus:ring-scitech-mint w-full appearance-none rounded-xl border border-border-color/10 bg-black/20 py-2.5 pr-8 pl-10 text-sm text-text-main focus:border-border-color focus:ring-1 focus:outline-none"
						>
							<option value="" class="bg-scitech-navy">Semua Kategori</option>
							{#each categories as cat}
								<option value={cat} class="bg-scitech-navy">{cat}</option>
							{/each}
						</select>
					</div>

					{#if searchQuery || selectedCategory}
						<button
							onclick={resetFilters}
							class="rounded-xl border border-border-color/10 bg-white/5 px-3 py-2.5 text-xs text-text-muted transition-all hover:bg-white/10 hover:text-text-main"
						>
							Reset
						</button>
					{/if}
				</div>
			</div>
		{/await}

		<!-- Tampilan Data Cards Grid -->
		{#await data.fasilitis}
			<div class="flex min-h-[300px] items-center justify-center">
				<Spin />
			</div>
		{:then facilities}
			{#if facilities && facilities.length > 0}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{#each facilities as facility (facility.id)}
						<div
							class="group hover:border-scitech-mint/30 flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color/10 bg-bg-secondary transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
						>
							<div>
								<div class="relative h-48 w-full overflow-hidden bg-black/40">
									{#if facility.image_url}
										<img
											src={facility.image_url}
											alt={facility.name}
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center text-text-muted">
											<FlaskConical class="h-12 w-12 opacity-30" />
										</div>
									{/if}

									<!-- Badge Kategori -->
									<div class="absolute top-3 left-3 z-10">
										<span
											class="rounded-full border border-border-color/20 bg-bg-secondary/80 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-text-main uppercase backdrop-blur-md"
										>
											{facility.category}
										</span>
									</div>

									<!-- Tombol Detail di Tengah Gambar saat Hover -->
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100"
									>
										<button
											type="button"
											onclick={() => openModal(facility)}
											class="inline-flex items-center gap-2 border border-border-color bg-bg-primary px-4 py-2 text-xs font-bold text-text-main shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] transition-all hover:bg-bg-primary/80 active:scale-95"
										>
											<Maximize2 class="h-4 w-4" />
											<span>Lihat Detail</span>
										</button>
									</div>
								</div>

								<!-- Konten Card -->
								<div class="space-y-2 p-5">
									{#if facility.brand_model}
										<span class="text-[11px] font-medium tracking-wide text-text-muted uppercase">
											{facility.brand_model}
										</span>
									{/if}

									<h3
										class="group-hover:text-scitech-mint line-clamp-1 text-lg font-bold text-text-main transition-colors"
									>
										{facility.name}
									</h3>

									<p class="line-clamp-3 text-xs leading-relaxed text-text-muted">
										{facility.description || 'Tidak ada deskripsi tambahan untuk fasilitas ini.'}
									</p>
								</div>
							</div>

							<!-- Footer Card (SOP Link) -->
							<div class="border-t border-border-color/10 p-4">
								{#if facility.sop_url}
									<a
										href={facility.sop_url}
										target="_blank"
										rel="noopener noreferrer"
										class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint hover:bg-scitech-mint flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold transition-all hover:text-bg-primary"
									>
										<FileText class="h-3.5 w-3.5" />
										<span>Unduh Dokumen SOP</span>
										<ExternalLink class="h-3 w-3" />
									</a>
								{:else}
									<div
										class="flex items-center justify-center gap-2 py-2 text-xs text-text-muted opacity-60"
									>
										<FileText class="h-3.5 w-3.5" />
										<span>SOP Belum Tersedia</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<EmptyData
					title="Fasilitas Tidak Tidak ada / Tidak di temukan"
					description={searchQuery || selectedCategory
						? 'Coba ubah kata kunci pencarian atau filter kategori Anda.'
						: 'Belum ada data fasilitas laboratorium yang ditambahkan.'}
					icon={PackageOpen}
				/>
			{/if}
		{:catch error}
			<div
				class="border-scitech-error/20 bg-scitech-error/10 text-scitech-error rounded-2xl border p-8 text-center text-sm"
			>
				Terjadi kesalahan saat memuat data fasilitas: {error.message}
			</div>
		{/await}

		{#await data.pagination}
			<!-- Loading state untuk paginasi jika diperlukan -->
		{:then pagination}
			{#if pagination}
				<BtnFloatPagination {pagination} onPageChange={goToPage} />
			{/if}
		{/await}
	</div>
</section>

<!-- ==================== modal detail fasilitas ==================== -->
{#if selectedFacility !== null}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 p-4 backdrop-blur-md transition-all"
		onclick={(e) => e.target === e.currentTarget && closeModal()}
		role="presentation"
	>
		<div
			class="relative max-h-[90vh] w-full max-w-2xl space-y-6 overflow-y-auto rounded-3xl border border-border-color/15 bg-bg-secondary p-6 shadow-2xl ring-1 ring-white/10 sm:p-8"
		>
			<button
				type="button"
				onclick={closeModal}
				class="absolute top-6 right-6 rounded-xl border border-border-color/10 bg-bg-primary p-2 text-text-main/60 transition-colors hover:bg-bg-primary/80 hover:text-text-main"
			>
				<XIcon class="h-4 w-4" />
			</button>

			<div class="space-y-2 pr-10">
				<span
					class="rounded-full border border-border-color/20 bg-bg-primary px-2.5 py-1 text-[10px] font-semibold tracking-wider text-text-main uppercase"
				>
					{selectedFacility.category}
				</span>
				<h3 class="text-xl font-bold text-text-main">
					{selectedFacility.name}
				</h3>
				{#if selectedFacility.brand_model}
					<p class="text-xs font-medium text-text-muted">
						Merek/Model: <span class="text-text-main">{selectedFacility.brand_model}</span>
					</p>
				{/if}
			</div>

			<!-- Gambar di Modal -->
			{#if selectedFacility.image_url}
				<div class="overflow-hidden rounded-2xl border border-border-color/10 bg-black/40">
					<img
						src={selectedFacility.image_url}
						alt={selectedFacility.name}
						class="h-auto max-h-80 w-full object-cover"
					/>
				</div>
			{/if}

			<!-- Deskripsi Lengkap -->
			<div class="space-y-2">
				<h4 class="text-xs font-semibold tracking-wider text-text-main uppercase">
					Deskripsi Fasilitas
				</h4>
				<p class="text-xs leading-relaxed whitespace-pre-line text-text-muted">
					{@html selectedFacility.description || 'Tidak ada deskripsi rinci untuk fasilitas ini.'}
				</p>
			</div>

			<div class="flex items-center justify-end gap-3 border-t border-border-color/10 pt-4">
				{#if selectedFacility.sop_url}
					<a
						href={selectedFacility.sop_url}
						target="_blank"
						rel="noopener noreferrer"
						class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint hover:bg-scitech-mint inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all hover:text-bg-primary"
					>
						<FileText class="h-4 w-4" />
						<span>Unduh Dokumen SOP</span>
						<ExternalLink class="h-3.5 w-3.5" />
					</a>
				{/if}
				<button
					type="button"
					onclick={closeModal}
					class="rounded-xl border border-border-color/15 bg-bg-primary px-5 py-2.5 text-xs font-semibold text-text-main transition-colors hover:bg-bg-primary/80"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
