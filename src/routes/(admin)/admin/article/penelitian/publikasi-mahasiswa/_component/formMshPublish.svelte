<script lang="ts">
	import { enhance } from '$app/forms';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		ArrowLeft,
		GraduationCap,
		User,
		BookOpen,
		Save,
		Loader2Icon,
		Trash2,
		LoaderCircleIcon,
		UploadCloudIcon,
		UploadCloud
	} from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { StudentPublicationDTO } from '$lib/dto/admin/article/penelitian';
	import type { StudentPublicationFormValues } from '$lib/types/values/admin/article';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		folder_cloudinary_admin_article_penelitian,
		upload_cloudinary_preset,
		getUploadConfig,
		getUploadOptions
	} from '$lib/cloudinary/client';

	let {
		valuesData,
		initialData = null,
		isEdit = false,
		action
	}: {
		initialData?: StudentPublicationDTO | null;
		isEdit?: boolean;
		action: string;
		valuesData?: StudentPublicationFormValues;
	} = $props();

	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let isDeletingPhoto = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	// State listener for FormEditor (HTML/LONGTEXT string)
	let journalListContent = $state(valuesData?.journal_list ?? initialData?.journal_list ?? '');
	let imageUrl = $state(valuesData?.image_url ?? '');
	let photoPublicId = $state(valuesData?.image_public_id ?? ''); // Simpan public_id dari Cloudinary

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Handler Upload Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url && result?.info?.public_id) {
			imageUrl = result.info.secure_url;
			photoPublicId = result.info.public_id;
		}
		// Kembalikan kemampuan scroll pada document body
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
		}
	}

	// Fungsi untuk menghapus foto dari Cloudinary & mereset state
	async function removeImage() {
		if (!photoPublicId) {
			imageUrl = '';
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', photoPublicId);

			// Panggil named action '?/deletePhoto'
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData,
				headers: {
					'x-sveltekit-action': 'true' // Penting agar SvelteKit tahu ini request form action manual
				}
			});
			const result = await response.json();
			if (response.ok && result.type === 'success') {
				imageUrl = '';
				photoPublicId = '';
				triggerMessage('success', 'Berhasil', 'Foto sampul berhasil dihapus.');
			} else {
				triggerMessage(
					'error',
					'Gagal',
					result.data?.message || 'Gagal menghapus gambar dari Cloudinary'
				);
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
		} finally {
			isDeletingPhoto = false;
		}
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Header Navigation -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
			<div>
				<div class="flex items-center gap-2">
					<GraduationCap class="text-scitech-mint h-5 w-5" />
					<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
						{isEdit ? 'Edit Publikasi Mahasiswa' : 'Tambah Publikasi Mahasiswa'}
					</h1>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui profil mahasiswa dan daftar jurnal publikasinya.'
						: 'Isi nama mahasiswa beserta daftar publikasi jurnal terkait.'}
				</p>
			</div>
		</div>
	</div>

	<!-- Alert / Toast Notification -->
	{#if showMessage}
		<Message
			status={showMessage ? messageConfig.status : 'error'}
			title={showMessage ? messageConfig.title : 'Gagal'}
			message={messageConfig.message}
			dismissible={true}
			timeout={4000}
			onclose={() => (showMessage = false)}
		/>
	{/if}

	<div
		class="rounded-2xl border border-border-color/10 bg-bg-secondary/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			{action}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit
								? 'Data publikasi mahasiswa berhasil diperbarui.'
								: 'Data publikasi mahasiswa berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						if (!isEdit) journalListContent = '';
						await update({ reset: !isEdit });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal memproses data.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem yang tidak diketahui.');
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<textarea name="journal_list" class="hidden" bind:value={journalListContent}></textarea>

			<!-- Field 1: Nama Mahasiswa -->
			<div class="space-y-2">
				<label
					for="student_name"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<User class="text-scitech-cyan h-4 w-4" />
					<span>Nama Lengkap Mahasiswa</span>
					<span class="text-status-error/10">*</span>
				</label>

				<input
					type="text"
					id="student_name"
					name="student_name"
					value={valuesData?.student_name ?? initialData?.student_name ?? ''}
					placeholder="Contoh: Nama Mahasiswa"
					required
					disabled={isSubmitting}
					class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/20 bg-bg-primary-glare px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field: Upload Foto Sampul dengan Cloudinary -->
			<div class="space-y-2">
				<label for="image_upload" class="block text-sm font-bold text-text-main">
					Foto Sampul / Gambar Pendukung Modul
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />
				<input type="hidden" name="image_public_id" value={photoPublicId} />

				{#if imageUrl}
					<div
						class="relative w-full max-w-md overflow-hidden border border-border-light bg-bg-primary p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
					>
						<img
							src={imageUrl}
							alt="Preview Sampul Modul"
							class="h-52 w-full border border-border-light object-cover"
						/>
						<button
							type="button"
							onclick={removeImage}
							class="mt-2 inline-flex w-full items-center justify-center gap-1.5 border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs font-bold text-status-error transition hover:bg-status-error/20"
						>
							<Trash2 class="h-4 w-4" />
							{#if isDeletingPhoto}
								<LoaderCircleIcon class="h-4 w-4 animate-spin" />
							{:else}
								<span>Hapus Foto</span>
							{/if}
						</button>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						options={getUploadOptions(folder_cloudinary_admin_article_penelitian)}
						uploadPreset={upload_cloudinary_preset}
						onSuccess={handleUploadSuccess}
						let:open
					>
						<button
							type="button"
							onclick={() => open()}
							class="flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border-light bg-bg-primary px-6 py-8 text-center transition hover:bg-bg-primary-glare"
						>
							<div
								class="mb-2 border border-border-light bg-bg-secondary p-3 text-accent-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
							>
								<UploadCloud class="h-6 w-6" />
							</div>
							<span class="text-sm font-bold text-accent-purple"> Unggah Foto Sampul Modul </span>
							<span class="mt-1 text-xs text-text-muted">Format gambar (PNG, JPG, WEBP)</span>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field 2: Daftar Jurnal (Rich Text Editor) -->
			<div class="space-y-2">
				<label
					for="journal_list"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<BookOpen class="text-scitech-cyan h-4 w-4" />
					<span>Daftar Jurnal & Publikasi</span>
					<span class="text-red-400">*</span>
				</label>

				<div class="bg-scitech-navy overflow-hidden rounded-xl border border-border-color/10">
					<FormEditor showSaveButton={false} bind:value={journalListContent} />
				</div>
			</div>

			<div
				class="/10 flex items-center justify-end gap-3 border-t
      border-border-color pt-6"
			>
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl border border-border-color/10 bg-bg-secondary/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-bg-primary/10 hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Update Data Mahasiswa' : 'Simpan Data Mahasiswa'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
