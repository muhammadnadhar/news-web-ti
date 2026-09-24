<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		folder_cloudinary_admin_article_kemahasiswaan,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { StudentAchievementDTO } from '$lib/dto/admin/article/kemahasiswaan';
	import type { AngkatanDTO, SemesterDTO } from '$lib/dto/admin/dataset';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		Award,
		User,
		GraduationCap,
		Calendar,
		BookOpen,
		Save,
		X,
		Loader2,
		Sparkles,
		LoaderCircle,
		UploadCloud,
		ImageIcon
	} from 'lucide-svelte';
	import { CldUploadWidget } from 'svelte-cloudinary';

	interface Props {
		form?: any;
		initData?: StudentAchievementDTO;
		action?: string;
		title?: string;
		subtitle?: string;
		submitLabel?: string;
		onCancel?: () => void;
		angkatanList: AngkatanDTO[];
		semesterList: SemesterDTO[];
	}

	let {
		form,
		initData,
		action = '',
		title = 'Tambah Prestasi Mahasiswa',
		subtitle = 'Isi formulir berikut untuk menambahkan riwayat prestasi akademik atau non-akademik mahasiswa.',
		submitLabel = 'Simpan Prestasi',
		onCancel = () => history.back(),
		angkatanList = [],
		semesterList = []
	}: Props = $props();

	// Ambil data prestasi awal dari server
	let prestasi = $derived(initData);
	let photoPublicId = $state(''); // Simpan public_id dari Cloudinary

	// State untuk menyimpan URL gambar dan status hapus
	let photoUrl = $state<string | null>(form?.values?.image_url || prestasi?.image_url);
	let isDeletingPhoto = $state(false);

	// State Form
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
	// Handler saat unggah berhasil
	function handleUpload(result: any) {
		if (result?.event === 'success' && result?.info?.secure_url) {
			photoUrl = result.info.secure_url;
			photoPublicId = result.info.public_id; // Dapatkan public_id
			// Pulihkan scroll body yang terkunci oleh Cloudinary
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}
		}
	}

	// Fungsi untuk menghapus foto dari Cloudinary & mereset state
	async function removePhoto() {
		if (!photoPublicId) {
			photoUrl = '';
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
				photoUrl = '';
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
</script>

<div class="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
	<!-- Header Section -->
	<header
		class="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="flex items-center gap-2 text-2xl font-bold text-slate-800">
				<Award class="h-7 w-7 text-indigo-600" />
				{title}
			</h1>
			{#if subtitle}
				<p class="text-sm text-slate-500">{subtitle}</p>
			{/if}
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
	<div class="rounded-xl border border-border-color bg-bg-secondary p-6 shadow-sm md:p-8">
		<form
			method="POST"
			{action}
			class="space-y-6"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					//Pengecekan jika response sukses dari server
					if (result.type === 'success') {
						const data = result.data;

						// Cek apakah status 'success' atau ada fallback flag success
						if (!data || data.status === 'success' || data.success) {
							triggerMessage(
								'success',
								(data?.title as string) || 'Berhasil',
								(data?.message as string) || 'Data berhasil disimpan!'
							);
							await update({ reset: true });
						} else {
							// Antisipasi jika HTTP 200 tapi status di response payload berupa 'error'
							triggerMessage(
								'error',
								(data?.title as string) || 'Gagal Menyimpan',
								(data?.message as string) || 'Terjadi kesalahan.'
							);
							await update({ reset: false });
						}
					}
					//Pengecekan jika return fail(...) dari server (HTTP status 4xx/5xx)
					else if (result.type === 'failure' && result.data) {
						const data = result.data;
						triggerMessage(
							'error',
							(data.title as string) || 'Gagal Menyimpan',
							(data.message as string) || 'Terjadi kesalahan saat memproses data.'
						);
						await update({ reset: false });
					}
					//Kesalahan koneksi / unhandled exception
					else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi/sistem.');
						await update({ reset: false });
					}
				};
			}}
		>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Nama Mahasiswa -->
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
							value={form?.values?.student_name || prestasi?.student_name}
							placeholder="Masukkan nama lengkap mahasiswa..."
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
						/>
					</div>
				</div>

				<!-- Nama Prestasi -->
				<div class="space-y-2 md:col-span-2">
					<label for="achievement_name" class="block text-sm font-semibold text-slate-700">
						Nama / Judul Prestasi <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div class="pointer-events-none absolute top-3 left-3 flex items-center text-slate-400">
							<Sparkles class="h-5 w-5" />
						</div>
						<textarea
							id="achievement_name"
							name="achievement_name"
							rows="3"
							placeholder="Contoh: Juara 1 Lomba Karya Tulis Ilmiah Nasional (LKTIN) 2026"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
							>{form?.values?.achievement_name ?? prestasi?.achievement_name}</textarea
						>
					</div>
				</div>

				<!-- Jenis Prestasi -->
				<div class="space-y-2 md:col-span-2">
					<label class="block text-sm font-semibold text-slate-700">
						Kategori Prestasi <span class="text-rose-500">*</span>
					</label>
					<div class="grid grid-cols-2 gap-4">
						<label
							class="flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/60 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500"
						>
							<div class="flex items-center gap-3">
								<BookOpen class="h-5 w-5 text-indigo-600" />
								<div>
									<div class="text-sm font-medium text-slate-800">Akademik</div>
									<div class="text-xs text-slate-500">Lomba Ilmiah, Olimpiade, dll.</div>
								</div>
							</div>
							<input
								type="radio"
								name="is_academic"
								value="y"
								checked={(form?.values?.is_academic ?? prestasi?.is_academic ?? 'y') === 'y'}
								disabled={isSubmitting}
								class="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
							/>
						</label>

						<label
							class="flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/60 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500"
						>
							<div class="flex items-center gap-3">
								<Award class="h-5 w-5 text-amber-600" />
								<div>
									<div class="text-sm font-medium text-slate-800">Non-Akademik</div>
									<div class="text-xs text-slate-500">Seni, Olahraga, Organisasi, dll.</div>
								</div>
							</div>
							<input
								type="radio"
								name="is_academic"
								value="n"
								checked={(form?.values?.is_academic ?? prestasi?.is_academic) === 'n'}
								disabled={isSubmitting}
								class="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
							/>
						</label>
					</div>
				</div>

				<!-- Upload Foto / Bukti Sertifikat (Cloudinary Input) -->
				<div class="space-y-2 md:col-span-2">
					<label for="image_url" class="block text-sm font-semibold text-slate-700"> Foto </label>

					<input type="hidden" id="image_url" name="image_url" bind:value={photoUrl} />

					<div
						class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 transition-all hover:border-indigo-400"
					>
						{#if photoUrl}
							<!-- Preview Gambar yang Sudah Diunggah -->
							<div
								class="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
							>
								<img
									src={photoUrl}
									alt="Preview Bukti Sertifikat"
									class="max-h-56 w-full rounded-md object-contain"
								/>
								<button
									type="button"
									onclick={removePhoto}
									disabled={isDeletingPhoto}
									class="absolute top-4 right-4 rounded-full bg-rose-600 p-1.5 text-white shadow transition-transform hover:scale-110 focus:outline-none disabled:opacity-50"
									title="Hapus Foto"
								>
									{#if isDeletingPhoto}
										<LoaderCircle class="h-4 w-4 animate-spin" />
									{:else}
										<X class="h-4 w-4" />
									{/if}
								</button>
							</div>
							<p class="mt-2 max-w-md truncate text-center text-xs text-slate-500">
								{photoUrl}
							</p>
						{:else}
							<div
								class="mb-3 flex h-24 w-24 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400"
							>
								<ImageIcon class="h-10 w-10 opacity-40" />
							</div>

							<CldUploadWidget
								config={getUploadConfig()}
								uploadPreset={upload_cloudinary_preset}
								options={getUploadOptions(folder_cloudinary_admin_article_kemahasiswaan)}
								onUpload={handleUpload}
								let:open
								let:isLoading
							>
								<button
									type="button"
									onclick={() => open()}
									disabled={isLoading}
									class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-indigo-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
								>
									{#if isLoading}
										<LoaderCircle class="h-4 w-4 animate-spin" />
										<span>Memuat Widget...</span>
									{:else}
										<UploadCloud class="h-4 w-4" />
										<span>Unggah Bukti Sertifikat</span>
									{/if}
								</button>
							</CldUploadWidget>
						{/if}
					</div>
				</div>

				<!-- Angkatan -->
				<div class="space-y-2">
					<label for="angkatan_id" class="block text-sm font-semibold text-slate-700">
						Tahun Angkatan <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-slate-400"
						>
							<GraduationCap class="h-5 w-5" />
						</div>
						<select
							id="angkatan_id"
							name="angkatan_id"
							value={form?.values?.angkatan_id ?? prestasi?.angkatan_id ?? ''}
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
						>
							<option value="" disabled selected>-- Pilih Tahun Angkatan --</option>
							{#each angkatanList as item (item.id)}
								<option value={item.id}>{item.year}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Semester -->
				<div class="space-y-2">
					<label for="semester_id" class="block text-sm font-semibold text-slate-700">
						Semester <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-slate-400"
						>
							<Calendar class="h-5 w-5" />
						</div>
						<select
							id="semester_id"
							name="semester_id"
							value={form?.values?.semester_id ?? prestasi?.semester_id ?? ''}
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
						>
							<option value="" disabled selected>-- Pilih Semester --</option>
							{#each semesterList as item (item.id)}
								<option value={item.id}>
									{item.name}
									{item.academic_year}
									{item.is_active ? '(Aktif)' : ''}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Form Actions -->
				<div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
					<button
						type="button"
						onclick={onCancel}
						disabled={isSubmitting}
						class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:opacity-50"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none disabled:opacity-50"
					>
						{#if isSubmitting}
							<Loader2 class="h-4 w-4 animate-spin" />
							<span>Menyimpan...</span>
						{:else}
							<Save class="h-4 w-4" />
							<span>{submitLabel}</span>
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
