<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, X, Save } from 'lucide-svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import type { TableContentType } from '$lib/types/tableContent';
	import type { HighGpaStudentDTO } from '$lib/types/admin/article/kemahasiswaan';
  

	let { data } = $props();

	// State Management Modal & Form
	let isModalOpen = $state(false);
	let isEditMode = $state(false);
	let selectedId = $state('');
	let studentNameInput = $state('');
	let gpaInput = $state('');
	let batchYearInput = $state('');
	let semesterInput = $state('');

	// Sync local state dengan data server
	let studentList = $derived<TableContentType[]>(data.studentList || []);
	let rawStudentList = $derived<HighGpaStudentDTO[]>(data.rawStudentList || []);

	// Modal Handlers
	function openAddModal() {
		isEditMode = false;
		selectedId = '';
		studentNameInput = '';
		gpaInput = '';
		batchYearInput = '';
		semesterInput = '';
		isModalOpen = true;
	}

	function openEditModal(item: TableContentType) {
		isEditMode = true;
		selectedId = item.id;

		const rawData = rawStudentList.find((s) => s.id === item.id);
		if (rawData) {
			studentNameInput = rawData.student_name;
			gpaInput = String(rawData.gpa);
			batchYearInput = rawData.batch_year;
			semesterInput = rawData.semester;
		} else {
			const nameCol = item.items.find((col) => col.colomn === 'Nama Mahasiswa');
			const gpaCol = item.items.find((col) => col.colomn === 'IPK');
			const batchCol = item.items.find((col) => col.colomn === 'Angkatan');
			const semCol = item.items.find((col) => col.colomn === 'Semester');

			studentNameInput = nameCol ? String(nameCol.row) : '';
			gpaInput = gpaCol ? String(gpaCol.row) : '';
			batchYearInput = batchCol ? String(batchCol.row) : '';
			semesterInput = semCol ? String(semCol.row) : '';
		}

		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedId = '';
		studentNameInput = '';
		gpaInput = '';
		batchYearInput = '';
		semesterInput = '';
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
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
			Mahasiswa IPK Tertinggi
		</h1>
	</div>

	<!-- Component TableContent -->
	<TableContent
		title="Data Mahasiswa IPK Tertinggi"
		addButtonLabel="+ Mahasiswa IPK Tertinggi"
		data={studentList}
		onAdd={openAddModal}
		onEdit={openEditModal}
	/>
</div>

<!-- Modal Form CRUD Mahasiswa IPK Tertinggi -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="text-base font-bold text-white">
					{isEditMode ? 'Edit Mahasiswa IPK Tertinggi' : 'Tambah Mahasiswa IPK Tertinggi'}
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

				<!-- Nama Mahasiswa -->
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
						placeholder="Contoh: Aesha Durratul Nasihah"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<!-- Nilai IPK -->
				<div>
					<label for="gpa" class="text-text-muted mb-1 block text-xs font-medium">
						Nilai IPK (0.00 - 4.00)<span class="text-rose-400">*</span>
					</label>
					<input
						id="gpa"
						name="gpa"
						type="number"
						step="0.01"
						min="0"
						max="4"
						required
						bind:value={gpaInput}
						placeholder="Contoh: 3.95"
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
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
							class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
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
							placeholder="Contoh: Genap 2022/2023 atau 2020"
							class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
						/>
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
