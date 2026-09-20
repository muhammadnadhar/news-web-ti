<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message.js';
	import { FileCheck2, Loader2, Save, Trash2, UploadIcon } from 'lucide-svelte';
	import { CldUploadButton } from 'svelte-cloudinary';

	// Props dari SvelteKit PageData
	let { data } = $props();

	// Local States (Svelte 5 Runes)
	let title = $state(data?.accreditation?.title ?? 'Akreditasi');
	let description = $state(data?.accreditation?.description ?? '');
	let imageUrl = $state<string | null>(data?.accreditation?.image_url ?? null);
	let previewUrl = $state<string | null>(data?.accreditation?.image_url ?? null);
	let isSubmitting = $state(false);

	// State tambahan untuk menyimpan Public ID Cloudinary & status hapus
	let publicId = $state<string | null>(null);
	let isDeleting = $state(false);

	// State untuk Pesan/Notifikasi
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Handler ketika gambar berhasil diunggah ke Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
			previewUrl = result.info.secure_url;
			publicId = result.info.public_id; // Menyimpan public_id
			triggerMessage('success', 'Foto Terunggah', 'Sertifikat berhasil diunggah ke Cloudinary.');
		}
	}

	// Handler untuk menghapus gambar sertifikat terpilih
	function handleRemoveImage() {
		imageUrl = null;
		previewUrl = null;
	}
</script>

{#if showMessage}
	<div class="mb-6">
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

<div class="space-y-8 p-6 lg:p-10">
	<!-- PAGE HEADER -->
	<div class="border-scitech-slate/20 flex items-center justify-between border-b pb-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Akreditasi</h1>
			<p class="text-xs text-slate-400 sm:text-sm">
				Kelola sertifikat dan informasi akreditasi Program Studi.
			</p>
		</div>
		<button
			type="submit"
			form="accreditation-form"
			disabled={isSubmitting}
			class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
		>
			<Save class="h-4 w-4" />
			<span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
		</button>
	</div>

	<!-- FORM UTAMA -->
	<form
		id="accreditation-form"
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					triggerMessage('success', 'Berhasil', 'Data akreditasi berhasil diperbarui!');
				} else if (result.type === 'failure') {
					triggerMessage('error', 'Gagal', 'Terjadi kesalahan saat menyimpan data.');
				}
				await update();
			};
		}}
		class="space-y-8"
	>
		<!-- Hidden input untuk menyimpan URL gambar dari Cloudinary -->
		<input type="hidden" name="image_url" value={imageUrl ?? ''} />

		<div class="border-scitech-slate/20 bg-scitech-navy-glare rounded-2xl border p-6 shadow-xl">
			<h2 class="text-scitech-mint mb-6 text-sm font-semibold">Form Ubah Data Akreditasi</h2>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
				<div class="space-y-6 lg:col-span-5">
					<div class="space-y-2">
						<label for="title" class="text-xs font-medium text-text-main">
							Judul Akreditasi <span class="text-scitech-error">*</span>
						</label>
						<input
							id="title"
							name="title"
							type="text"
							bind:value={title}
							required
							placeholder="Contoh: Akreditasi Program Studi"
							class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border px-4 py-2.5 text-xs text-text-main placeholder-slate-500 transition-all focus:outline-none"
						/>
					</div>

					<!-- tombol cloudinary upload -->
					<div class="space-y-2">
						<span class="block text-xs font-medium text-text-main">Unggah Sertifikat</span>
						<div class="flex flex-wrap items-center gap-3">
							<CldUploadButton
								uploadPreset={upload_cloudinary_preset}
								options={getUploadOptions(folder_cloudinary_admin_article_profil)}
								config={getUploadConfig()}
								onSuccess={handleUploadSuccess}
								class="border-scitech-slate/30 bg-scitech-navy hover:border-scitech-mint hover:bg-scitech-navy/80 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold text-text-main transition-all"
							>
								<UploadIcon class="text-scitech-mint h-4 w-4" />
								<span>{imageUrl ? 'Ganti Sertifikat' : 'Unggah Sertifikat'}</span>
							</CldUploadButton>
							{#if imageUrl}
								<button
									type="button"
									onclick={handleRemoveImage}
									disabled={isDeleting}
									class="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
									title="Hapus / Batal menggunakan gambar ini"
								>
									{#if isDeleting}
										<Loader2 class="h-4 w-4 animate-spin" />
										<span>Menghapus...</span>
									{:else}
										<Trash2 class="h-4 w-4" />
										<span>Batal / Hapus</span>
									{/if}
								</button>
							{/if}
						</div>
					</div>
				</div>

				<!-- KANAN: PREVIEW SERTIFIKAT -->
				<div class="space-y-2 lg:col-span-7">
					<span class="block text-xs font-medium text-text-main">Preview Sertifikat</span>

					<div
						class="border-scitech-slate/30 bg-scitech-navy relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border p-4"
					>
						{#if previewUrl}
							<img
								src={previewUrl}
								alt="Sertifikat Akreditasi"
								class="max-h-[420px] w-auto rounded-lg object-contain shadow-md"
							/>
						{:else}
							<div class="flex flex-col items-center gap-2 text-center text-xs text-slate-400">
								<FileCheck2 class="h-10 w-10 text-slate-500 opacity-40" />
								<span>Sertifikat belum diunggah</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- bagian bawah: isi akreditasi (form editor) -->
		<div
			class="border-scitech-slate/20 bg-scitech-navy-glare space-y-3 rounded-2xl border p-6 shadow-xl"
		>
			<label for="description" class="block text-xs font-medium text-text-main">
				Isi Akreditasi <span class="text-scitech-error">*</span>
			</label>

			<FormEditor label={'Akreditasi'} showSaveButton={false} bind:value={description} />
			<textarea name="description" class="hidden" bind:value={description}></textarea>
		</div>
	</form>
</div>
