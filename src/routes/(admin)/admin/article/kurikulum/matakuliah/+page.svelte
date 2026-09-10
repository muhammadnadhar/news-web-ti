<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Upload, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
  import type { CourseMapDTO } from '$lib/types/admin/article/kurikulum';

	let { data } = $props();

	// State Management
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let titleInput = $state('');
	let currentImageUrl = $state<string | null>(null);

	// Sync local state
	let courseMapList = $derived<TableContentType[]>(data.courseMapList || []);
	let rawCourseMapList = $derived<CourseMapDTO[]>(data.rawCourseMapList || []);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		titleInput = '';
		currentImageUrl = null;
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawCourseMapList.find((p) => p.id === item.id);
		if (rawData) {
			titleInput = rawData.title;
			currentImageUrl = rawData.image_url;
		} else {
			const titleCol = item.items.find((col) => col.colomn === 'Judul Peta Mata Kuliah');
			titleInput = titleCol ? String(titleCol.row) : '';
			currentImageUrl = null;
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		titleInput = '';
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
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Peta Mata Kuliah</h1>
	</div>

	<!-- Component TableContent -->
	<TableContent
		title="Peta Mahasiswa"
		addButtonLabel="+ Peta Mata Kuliah"
		data={courseMapList}
		onAdd={openAddModal}
		onEdit={openEditModal}
	/>
</div>

<!-- Modal Form CRUD Peta Mata Kuliah -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy max-h-[90vh] w-full max-w-2xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-white">
					{isEditMode ? 'Edit Peta Mata Kuliah' : 'Tambah Peta Mata Kuliah'}
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

				<!-- Judul Peta Mata Kuliah -->
				<div>
					<label for="title" class="text-text-muted mb-1 block text-xs font-medium">Judul Peta Mata Kuliah*</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						bind:value={titleInput}
						placeholder="Contoh: Peta Mata Kuliah Kurikulum Angkatan 2025 Keatas Prodi Teknologi Informasi"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<!-- Foto Peta Mata Kuliah -->
				<div class="space-y-2">
					<label for="image" class="text-text-muted block text-xs font-medium">
						Foto Peta Mata Kuliah{!isEditMode ? '*' : ''}
					</label>

					{#if currentImageUrl}
						<div class="mb-3 flex items-center gap-4">
							<img
								src={currentImageUrl}
								alt="Foto Saat Ini"
								class="h-24 w-36 rounded-lg border border-white/15 object-cover"
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
						<input id="image" name="image" type="file" accept="image/*" required={!isEditMode} class="hidden" />
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
