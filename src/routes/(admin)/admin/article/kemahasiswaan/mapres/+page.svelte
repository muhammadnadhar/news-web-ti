<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
  import type { StudentAchievementDTO } from '$lib/types/admin/article/kemahasiswaan';
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { gotoEdit, mergeNewPath } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let studentNameInput = $state('');
	let isAcademicInput = $state<'y' | 'n'>('y');
	let batchYearInput = $state('');
	let semesterInput = $state('');
	let achievementNameInput = $state('');

	// Sync local state dengan data server
/**
 * Mapper untuk mengonversi data StudentAchievementDTO dari database
 * ke format TableContentType yang dibutuhkan oleh komponen TableContent
 */
export function mapStudentAchievementToTableContent(
	items: StudentAchievementDTO[]
): TableContentType[] {
	if (!Array.isArray(items)) return [];

	return items.map((item) => ({
		id: item.id,
		items: [
			{
				colomn: 'Nama Mahasiswa',
				row: item.student_name
			},
			{
				colomn: 'Nama Prestasi',
				row: item.achievement_name
			},
			{
				colomn: 'Kategori',
				row: item.is_academic === 'y' ? 'Akademik' : 'Non-Akademik'
			},
			{
				colomn: 'Angkatan',
				row: item.batch_year
			},
			{
				colomn: 'Semester',
				row: item.semester
			}
		]
	}));
}


	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		studentNameInput = '';
		isAcademicInput = 'y';
		batchYearInput = '';
		semesterInput = '';
		achievementNameInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawAchievementList.find((s) => s.id === item.id);
		if (rawData) {
			studentNameInput = rawData.student_name;
			isAcademicInput = rawData.is_academic;
			batchYearInput = rawData.batch_year;
			semesterInput = rawData.semester;
			achievementNameInput = rawData.achievement_name;
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama');
			const batchCol = item.items.find((col) => col.colomn === 'Angkatan');
			const semCol = item.items.find((col) => col.colomn === 'Semester');
			const achCol = item.items.find((col) => col.colomn === 'Prestasi');

			studentNameInput = nameCol ? String(nameCol.row) : '';
			batchYearInput = batchCol ? String(batchCol.row) : '';
			semesterInput = semCol ? String(semCol.row) : '';
			achievementNameInput = achCol ? String(achCol.row) : '';
			isAcademicInput = 'y';
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	selectedId = '';
		studentNameInput = '';
		isAcademicInput = 'y';
		batchYearInput = '';
		semesterInput = '';
		achievementNameInput = '';
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Header -->
	<div class="border-b border-white/10 pb-6">
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Kemahasiswaan
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Mahasiswa Prestasi</h1>
	</div>

	<!-- Component TableContent -->

	{#await data.rawAchievementList}
			<TableSkeleton showTitle={true} title="Memuat Data Mahasiswa Prestasi..." columnsCount={4} />
		{:then rawList}
			<TableContent
					title="Data Mahasiswa Prestasi"
		addButtonLabel=" Mahasiswa Prestasi"
				data={mapStudentAchievementToTableContent(rawList)}
				onAdd={() => goto(mergeNewPath('add'))}
				onEdit={(data) => gotoEdit(data.id, page.url.pathname)}
				onDelete={(data) => console.info('dlete dengan modal')}
			/>
		{:catch error}
			<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
				Gagal memuat data kerjasama: {error.message}
			</div>
		{/await}


</div>

<!-- Modal Form CRUD Mahasiswa Prestasi -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-text-main">
					{isEditMode ? 'Edit Data Mahasiswa Prestasi' : 'Tambah Data Mahasiswa Prestasi'}
				</h3>
				<button type="button" onclick={closeModal} class="text-text-muted hover:text-text-main">
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

				<div>
					<label for="student_name" class="text-text-muted mb-1 block text-xs font-medium">
						Nama Mahasiswa<span class="text-rose-400">*</span>
					</label>
					<input
						id="student_name"
						name="student_name"
						type="text"
						required
						bind:value={studentNameInput}
						placeholder="Contoh: Azri Ahmad Fahrozi"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none"
					/>
				</div>

				<!-- Jenis Prestasi (Akademik / Non-Akademik) -->
				<div>
					<label for="is_academic" class="text-text-muted mb-1 block text-xs font-medium">
						Kategori Prestasi<span class="text-rose-400">*</span>
					</label>
					<select
						id="is_academic"
						name="is_academic"
						bind:value={isAcademicInput}
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none"
					>
						<option value="y">Akademik</option>
						<option value="n">Non-Akademik</option>
					</select>
				</div>

				<!-- Angkatan & Semester -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="batch_year" class="text-text-muted mb-1 block text-xs font-medium">
							Angkatan<span class="text-rose-400">*</span>
						</label>
						<input
							id="batch_year"
							name="batch_year"
							type="text"
							required
							bind:value={batchYearInput}
							placeholder="Contoh: 2020"
							class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none"
						/>
					</div>

					<div>
						<label for="semester" class="text-text-muted mb-1 block text-xs font-medium">
							Semester<span class="text-rose-400">*</span>
						</label>
						<input
							id="semester"
							name="semester"
							type="text"
							required
							bind:value={semesterInput}
							placeholder="Contoh: Semester Genap 2022/2023"
							class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-text-main focus:outline-none"
						/>
					</div>
				</div>

				<!-- Deskripsi / Nama Prestasi -->
				<div>
					<label for="achievement_name" class="text-text-muted mb-1 block text-xs font-medium">
						Prestasi Yang Diraih<span class="text-rose-400">*</span>
					</label>
					<textarea
						id="achievement_name"
						name="achievement_name"
						rows="4"
						required
						bind:value={achievementNameInput}
						placeholder="Contoh: Juara 1 Lomba Software Development National Level 2023"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 p-3 text-xs text-text-main focus:outline-none resize-none"
					></textarea>
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
