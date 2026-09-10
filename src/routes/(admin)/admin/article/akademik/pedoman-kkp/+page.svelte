<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Upload, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import type { PedomanKkpDTO } from '$lib/types/admin/article/akademik';

	let { data } = $props();

	// State Management
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let titleInput = $state('');
	let descriptionContent = $state('');
	let currentImageUrl = $state<string | null>(null);

	// Sync local state
	let pedomanList = $derived<TableContentType[]>(data.pedomanList || []);
	let rawPedomanList = $derived<PedomanKkpDTO[]>(data.rawPedomanList || []);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		titleInput = '';
		descriptionContent = '';
		currentImageUrl = null;
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawPedomanList.find((p) => p.id === item.id);
		if (rawData) {
			titleInput = rawData.title;
			descriptionContent = rawData.description || '';
			currentImageUrl = rawData.image_url;
		} else {
			const titleCol = item.items.find((col) => col.colomn === 'Judul');
			const descCol = item.items.find((col) => col.colomn === 'Description');
			titleInput = titleCol ? String(titleCol.row) : '';
			descriptionContent = descCol ? String(descCol.row) : '';
			currentImageUrl = null;
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		titleInput = '';
		descriptionContent = '';
		currentImageUrl = null;
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Artikel Akademik
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Pedoman KKP</h1>
	</div>

	<!-- Component TableContent -->
	<TableContent
		title="Data Pedoman Kuliah Kerja Praktek"
		addButtonLabel="+ Pedoman KKP"
		data={pedomanList}
		onAdd={openAddModal}
		onEdit={openEditModal}
	/>
</div>

<!-- Modal Form CRUD Pedoman KKP -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy max-h-[90vh] w-full max-w-2xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-white">
					{isEditMode ? 'Edit Pedoman KKP' : 'Tambah Pedoman KKP'}
				</h3>
				<button type="button" onclick={closeModal} class="text-text-muted hover:text-white">
					<X class="h-5 w-5" />
				</button>
			</div>

			<form
				method="POST"
				action="?/save"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							closeModal();
						}
					};
				}}
				class="space-y-6"
			>
				<input type="hidden" name="id" value={selectedId} />
				<input type="hidden" name="is_edit" value={isEditMode ? 'true' : 'false'} />

				<!-- Judul Pedoman KKP -->
				<div>
					<label for="title" class="text-text-muted mb-1 block text-xs font-medium">Judul Pedoman KKP*</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						bind:value={titleInput}
						placeholder="Contoh: Form yang harus dilengkapi oleh mahasiswa KKP"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<!-- Description Input -->
				<div>
					<label for="description" class="text-text-muted mb-1 block text-xs font-medium">Description</label>
					<textarea
						id="description"
						name="description"
						rows="6"
						bind:value={descriptionContent}
						placeholder="Masukkan deskripsi, daftar form, atau informasi KKP..."
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 p-3 text-xs text-white focus:outline-none resize-none"
					></textarea>
				</div>

				<!-- Foto Sampul / Gambar -->
				<div class="space-y-2">
					<label for="image" class="text-text-muted block text-xs font-medium">Foto Sampul / Gambar Pedoman</label>

					{#if currentImageUrl}
						<div class="mb-3 flex items-center gap-4">
							<img
								src={currentImageUrl}
								alt="Sampul Saat Ini"
								class="h-20 w-28 rounded-lg border border-white/15 object-cover"
							/>
							<span class="text-text-muted/60 text-xs italic">Upload foto baru di bawah untuk mengganti.</span>
						</div>
					{/if}

					<div class="flex items-center gap-3">
						<label
							for="image"
							class="bg-scitech-slate text-text-muted hover:text-white border-white/15 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/10"
						>
							<Upload class="h-4 w-4" />
							<span>Pilih Foto</span>
						</label>
						<input id="image" name="image" type="file" accept="image/*" class="hidden" />
					</div>
				</div>

				<!-- Form Action Buttons -->
				<div class="flex justify-end gap-3 pt-4 border-t border-white/10">
					<button
						type="button"
						onclick={closeModal}
						class="text-text-muted rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10"
					>
						Batal
					</button>
					<button
						type="submit"
						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all"
					>
						<Save class="h-4 w-4" />
						<span>Simpan</span>
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
