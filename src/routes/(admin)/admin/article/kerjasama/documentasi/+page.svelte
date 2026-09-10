<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
import type { ActivityDocumentationDTO } from '$lib/types/admin/article/kerjasama';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let titleInput = $state('');
	let imageUrlInput = $state('');
	let descriptionInput = $state('');
	let eventDateInput = $state('');

	// Sync local state dengan data server
	let documentationList = $derived<TableContentType[]>(data.documentationList || []);
	let rawDocumentationList = $derived<ActivityDocumentationDTO[]>(data.rawDocumentationList || []);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		titleInput = '';
		imageUrlInput = '';
		descriptionInput = '';
		eventDateInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawDocumentationList.find((d) => d.id === item.id);
		if (rawData) {
			titleInput = rawData.title;
			imageUrlInput = rawData.image_url;
			descriptionInput = rawData.description || '';
			eventDateInput = rawData.event_date ? new Date(rawData.event_date).toISOString().split('T')[0] : '';
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama');
			titleInput = nameCol ? String(nameCol.row) : '';
			imageUrlInput = '';
			descriptionInput = '';
			eventDateInput = '';
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		titleInput = '';
		imageUrlInput = '';
		descriptionInput = '';
		eventDateInput = '';
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Kerjasama
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
			Dokumentasi Kegiatan
		</h1>
	</div>

	<!-- Component TableContent -->
	<TableContent
		title="Dokumentasi Kegiatan"
		addButtonLabel="+ Dokumentasi"
		data={documentationList}
		onAdd={openAddModal}
		onEdit={openEditModal}
	/>
</div>

<!-- Modal Form CRUD Dokumentasi Kegiatan -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-white">
					{isEditMode ? 'Edit Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan'}
				</h3>
				<button type="button" onclick={closeModal} class="text-text-muted hover:text-white">
					<X class="h-5 w-5" />
				</button>
			</div>

			<form
				method="POST"
				action="?/save"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							closeModal();
						}
					};
				}}
				class="space-y-5"
			>
				<input type="hidden" name="id" value={selectedId} />
				<input type="hidden" name="is_edit" value={isEditMode ? 'true' : 'false'} />

				<!-- Nama / Judul Kegiatan -->
				<div>
					<label for="title" class="text-text-muted mb-1 block text-xs font-medium">
						Nama / Judul Kegiatan<span class="text-rose-400">*</span>
					</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						bind:value={titleInput}
						placeholder="Contoh: Inspirasi Dunia Untuk TI Indonesia"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<div>
					<label for="image_url" class="text-text-muted mb-1 block text-xs font-medium">
						URL / Path Foto<span class="text-rose-400">*</span>
					</label>
					<input
						id="image_url"
						name="image_url"
						type="text"
						required
						bind:value={imageUrlInput}
						placeholder="Contoh: /images/documentation/seminar-nasional.jpg"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-border-color/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<!-- Preview Foto jika URL ada -->
				{#if imageUrlInput}
					<div class="space-y-1">
						<span class="text-text-muted block text-xs font-medium">Preview Foto:</span>
						<div class="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-black/30 border border-white/10 p-2">
							<img
								src={imageUrlInput}
								alt="Preview Dokumentasi"
								class="h-full w-full object-cover rounded-lg"
							/>
						</div>
					</div>
				{/if}

				<!-- Link GDrive / Deskripsi Singkat -->
				<div>
					<label for="description" class="text-text-muted mb-1 block text-xs font-medium">
						Link GDrive / Youtube / Deskripsi
					</label>
					<input
						id="description"
						name="description"
						type="text"
						bind:value={descriptionInput}
						placeholder="Contoh: https://drive.google.com/drive/folders/..."
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<!-- Tanggal Kegiatan (Opsional) -->
				<div>
					<label for="event_date" class="text-text-muted mb-1 block text-xs font-medium">
						Tanggal Pelaksanaan (Opsional)
					</label>
					<input
						id="event_date"
						name="event_date"
						type="date"
						bind:value={eventDateInput}
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
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
