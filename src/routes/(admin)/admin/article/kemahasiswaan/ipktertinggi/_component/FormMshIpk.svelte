<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		getUploadConfig,
		folder_cloudinary_admin_article_kemahasiswaan,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { HighGpaStudentDTO } from '$lib/dto/admin/article/kemahasiswaan';
	import type { AngkatanDTO, SemesterDTO } from '$lib/dto/admin/dataset';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		TrendingUp,
		User,
		GraduationCap,
		Calendar,
		Save,
		Loader2,
		Award,
		Image as ImageIcon,
		UploadCloudIcon,
		X,
		Trash2Icon,
		LoaderCircle
	} from 'lucide-svelte';
	import { CldUploadWidget } from 'svelte-cloudinary';

	interface OptionItem {
		id: string | number;
		year?: string | number;
		name?: string;
		nama?: string;
	}

	// Props Svelte 5 Runes
	let {
		form = null,
		initialData = null,
		angkatanList = [],
		semesterList = [],
		isEdit = false,
		action = '?/save'
	}: {
		form?: HighGpaStudentDTO | null;
		initialData?: HighGpaStudentDTO | null;
		angkatanList: AngkatanDTO[];
		semesterList: SemesterDTO[];
		isEdit?: boolean;
		action?: string;
	} = $props();

	// State Form
	let isSubmitting = $state(false);
	let showMessage = $state(false);
	let photoPublicId = $state(''); // Simpan public_id dari Cloudinary
	let isDeletingPhoto = $state(false);

	// Default/prefilled value priority: form validation rerun > initialData > empty
	let imgPreview = $state(form?.image_url ?? initialData?.image_url ?? '');

	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imgPreview = result.info.secure_url;
			photoPublicId = result.info.public_id; // Dapatkan public_id
		}
	}

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imgPreview = result.info.secure_url;
			photoPublicId = result.info.public_id; // Dapatkan public_id
		}
	}

	// Function untuk mengosongkan foto
	// Fungsi untuk menghapus foto dari Cloudinary & mereset state
	async function removeImage() {
		if (!photoPublicId) {
			imgPreview = '';
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', photoPublicId);

			// Panggil named action '?/deletePhoto'
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				imgPreview = '';
				photoPublicId = '';
			} else {
				alert('Gagal menghapus gambar dari Cloudinary');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
		} finally {
			isDeletingPhoto = false;
		}
	}

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<div class="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
	<!-- Header Section -->
	<header
		class="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="flex items-center gap-2 text-2xl font-bold text-slate-800">
				<TrendingUp class="h-7 w-7 text-emerald-600" />
				{isEdit ? 'Edit Data Mahasiswa IPK Tertinggi' : 'Tambah Mahasiswa IPK Tertinggi'}
			</h1>
			<p class="text-sm text-slate-500">
				{isEdit
					? 'Perbarui informasi perolehan Indeks Prestasi Kumulatif (IPK) mahasiswa.'
					: 'Formulir pendataan mahasiswa dengan perolehan Indeks Prestasi Kumulatif (IPK) tertinggi.'}
			</p>
		</div>
	</header>

	<!-- Message Component Notification -->
	{#if showMessage}
		<div class="transition-all duration-300">
			<Message
				status={messageConfig.status}
				title={messageConfig.title}
				message={messageConfig.message}
				dismissible={true}
				timeout={5000}
				onclose={() => (showMessage = false)}
			/>
		</div>
	{/if}

	<!-- Form Card -->
	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
		<form
			method="POST"
			{action}
			class="space-y-6"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success' && result.data?.success) {
						triggerMessage(
							'success',
							(result.data.title as string) || 'Berhasil',
							(result.data.message as string) || 'Data berhasil disimpan!'
						);
						if (!isEdit) {
							imgPreview = '';
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							(result.data.message as string) || 'Terjadi kesalahan saat memproses data.'
						);
						await update({ reset: false });
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi/sistem.');
						await update({ reset: false });
					}
				};
			}}
		>
			<!-- Hidden ID Input saat Mode Edit -->
			{#if isEdit && initialData?.id}
				<input type="hidden" name="id" value={initialData.id} />
			{/if}

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2 md:col-span-2">
					<label for="student_name" class="block text-sm font-semibold text-slate-700">
						Nama Mahasiswa <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<User class="h-5 w-5" />
						</div>
						<input
							type="text"
							id="student_name"
							name="student_name"
							value={form?.student_name ?? initialData?.student_name ?? ''}
							placeholder="Masukkan nama lengkap mahasiswa..."
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						/>
					</div>
				</div>

				<!-- IPK -->
				<div class="space-y-2">
					<label for="gpa" class="block text-sm font-semibold text-slate-700">
						Indeks Prestasi Kumulatif (IPK) <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<Award class="h-5 w-5" />
						</div>
						<input
							type="number"
							id="gpa"
							name="gpa"
							step="0.01"
							min="0.00"
							max="4.00"
							value={form?.gpa ?? initialData?.gpa ?? ''}
							placeholder="Contoh: 3.95"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						/>
					</div>
					<p class="text-xs text-slate-500">Maksimal nilai 4.00</p>
				</div>

				<!-- Angkatan -->
				<div class="space-y-2">
					<label for="angkatan_id" class="block text-sm font-semibold text-slate-700">
						Tahun Angkatan <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<GraduationCap class="h-5 w-5" />
						</div>
						<select
							id="angkatan_id"
							name="angkatan_id"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						>
							<option value="">-- Pilih Angkatan --</option>
							{#each angkatanList as angkatan}
								{@const selectedId = form?.angkatan_id ?? initialData?.angkatan_id}
								<option value={angkatan.id} selected={String(selectedId) === String(angkatan.id)}>
									{angkatan.year || angkatan.nama || angkatan.id}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Semester -->
				<div class="space-y-2 md:col-span-2">
					<label for="semester_id" class="block text-sm font-semibold text-slate-700">
						Semester <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<Calendar class="h-5 w-5" />
						</div>
						<select
							id="semester_id"
							name="semester_id"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						>
							<option value="">-- Pilih Semester --</option>
							{#each semesterList as semester}
								{@const selectedId = form?.semester_id ?? initialData?.semester_id}
								<option value={semester.id} selected={String(selectedId) === String(semester.id)}>
									{semester.name || semester.nama || semester.id}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- URL / Upload Foto Mahasiswa (img_url) -->
				<div class="space-y-2 md:col-span-2">
					<label
						for="img_url"
						class="block text-sm font-semibold text-slate-700 dark:text-slate-200"
					>
						Foto Mahasiswa
					</label>

					<input type="hidden" id="img_url" name="img_url" value={imgPreview} />

					{#if imgPreview}
						<!-- Preview Foto jika sudah terunggah -->
						<div
							class="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/50"
						>
							<img
								src={imgPreview}
								alt="Preview Foto Mahasiswa"
								class="h-20 w-20 rounded-lg object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
								onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
							/>
							<div class="flex flex-1 flex-col gap-1">
								<span class="text-xs font-medium text-slate-500 dark:text-slate-400"
									>Foto Mahasiswa Terunggah</span
								>
								<p class="max-w-xs truncate text-xs text-slate-700 dark:text-slate-300">
									{imgPreview}
								</p>
								<button
									type="button"
									onclick={removeImage}
									disabled={isDeletingPhoto}
									class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
								>
									<Trash2Icon class="h-3.5 w-3.5" />
									{#if isDeletingPhoto}
										<LoaderCircle class="h-4 w-4 animate-spin" />
									{:else}
										<span>Hapus Foto</span>
									{/if}
								</button>
							</div>
						</div>
					{:else}
						<!-- Widget Cloudinary Upload jika belum ada foto -->
						<CldUploadWidget
							config={getUploadConfig()}
							uploadPreset={upload_cloudinary_preset}
							options={getUploadOptions(folder_cloudinary_admin_article_kemahasiswaan)}
							onSuccess={handleUploadSuccess}
							onUpload={handleUpload}
							let:open
						>
							<button
								type="button"
								onclick={() => open()}
								disabled={isSubmitting}
								class="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50/30 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-emerald-400 dark:hover:bg-slate-800"
							>
								<div
									class="mb-2 rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition-transform group-hover:scale-110 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
								>
									<UploadCloudIcon class="h-6 w-6 text-emerald-600" />
								</div>
								<span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
									Unggah Foto Mahasiswa
								</span>
								<span class="mt-1 text-xs text-slate-500 dark:text-slate-400">
									Klik untuk memilih foto
								</span>
							</button>
						</CldUploadWidget>
					{/if}
				</div>

				<!-- Form Actions -->
				<div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
					<button
						type="button"
						onclick={() => history.back()}
						disabled={isSubmitting}
						class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:opacity-50"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-text-main shadow-sm transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none disabled:opacity-50"
					>
						{#if isSubmitting}
							<Loader2 class="h-4 w-4 animate-spin" />
							<span>Menyimpan...</span>
						{:else}
							<Save class="h-4 w-4" />
							<span>{isEdit ? 'Perbarui Data' : 'Simpan Data IPK'}</span>
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
