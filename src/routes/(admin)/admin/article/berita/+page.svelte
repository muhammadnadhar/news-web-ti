<script lang="ts">
	import type { PageData } from './$types';
	import TableContent from '$lib/components/admin/tableContent.svelte';

	let data: PageData = $props();

	// Konfigurasi Kolom untuk TableContent
	const columns = [
		{ key: 'title', label: 'Judul Berita' },
		{ key: 'category', label: 'Kategori Berita' },
		{ key: 'published_at', label: 'Tanggal Berita' }
	];

	// Fungsi handler hapus berita
	async function handleDelete(id: string) {
		if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
			// Panggil API / Form Action untuk delete berita
			console.log('Menghapus berita dengan ID:', id);
		}
	}
</script>

<div class="min-h-screen bg-bg-primary p-6 text-[var(--color-text-main)] transition-colors">
	<!-- Header Page & Tombol Tambah -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">Berita</h1>
			<p class="mt-1 text-sm text-text-muted">
				Kelola daftar berita, seminar, dan pengumuman prodi.
			</p>
		</div>

		<a
			href="/admin/article/berita/add"
			class="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>+ Berita</span>
		</a>
	</div>

	<!-- Wrapper Card Utama -->
	<div
		class="overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-sm"
	>
		<!-- Sub-Header Card -->
		<div
			class="flex items-center justify-between border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] px-6 py-4"
		>
			<h2 class="text-base font-semibold text-[var(--color-text-main)]">Data Berita</h2>
			<span
				class="rounded-full bg-[var(--color-accent-primary-dim)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-dark)]"
			>
				Total: {data.news?.length || 0}
			</span>
		</div>

		<!-- Render Komponen TableContent -->
		<div class="p-4">
			<TableContent {columns} data={data.news}>
				<svelte:fragment slot="cell" let:row let:column>
					{#if column.key === 'category'}
						<!-- Badge Styling Kategori -->
						<span
							class="inline-flex items-center rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-main)]"
						>
							{row.category}
						</span>
					{:else if column.key === 'published_at'}
						<!-- Formatting Tanggal & Jam -->
						<span class="font-mono text-xs text-[var(--color-text-muted)]">
							{new Date(row.published_at).toLocaleString('id-ID', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</span>
					{:else if column.key === 'title'}
						<span class="line-clamp-2 font-medium text-[var(--color-text-main)]">
							{row.title}
						</span>
					{:else}
						{row[column.key]}
					{/if}
				</svelte:fragment>

				<!-- Action Slot (Edit & Delete Buttons) -->
				<svelte:fragment slot="actions" let:row>
					<div class="flex items-center justify-end gap-1.5">
						<!-- Tombol Edit -->
						<a
							href={`/admin/berita/edit/${row.id}`}
							title="Edit Berita"
							class="rounded-lg bg-[var(--color-accent-cyan)]/10 p-2 text-[var(--color-accent-cyan)] transition-colors hover:bg-[var(--color-accent-cyan)] hover:text-white"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						</a>

						<!-- Tombol Delete -->
						<button
							type="button"
							title="Hapus Berita"
							on:click={() => handleDelete(row.id)}
							class="rounded-lg bg-[var(--color-status-error)]/10 p-2 text-[var(--color-status-error)] transition-colors hover:bg-[var(--color-status-error)] hover:text-white"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</svelte:fragment>
			</TableContent>
		</div>
	</div>
</div>
