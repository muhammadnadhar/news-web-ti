<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { ActionData } from './$types';
	import type { MessageStatus } from '$lib/components/admin/message.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import { UploadCloud } from 'lucide-svelte';

	let { form }: { form: ActionData } = $props();

	// State lokal untuk gambar dan deskripsi editor
	let imageUrl = $state(form?.values?.imageUrl || '');
	let description = $state(form?.values?.description || '');

	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<{
		status: MessageStatus;
		title: string;
		message: string;
	}>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Handler saat gambar berhasil diunggah ke Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
		}
	}

	// Hapus foto jika ingin mengganti
	function removeImage() {
		imageUrl = '';
	}
</script>

<div class="container">
	<header class="header">
		<button onclick={() => history.back()} class="btn-back">← Kembali ke Daftar</button>
		<h1>Tambah Pedoman KKP Baru</h1>
	</header>

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

	<div class="card">
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false; // Sembunyikan pesan lama saat submitting

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success' && result.data?.success) {
						triggerMessage(
							'success',
							(result.data.title as string) || 'Berhasil',
							result.data.message as string
						);

						// Reset state checkbox dan isi input form
						await update({ reset: true });
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							result.data.message as string
						);

						// Pertahankan isi input yang dimasukkan user sebelumnya
						await update();
					} else {
						// Handling Error Tak Terduga
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
						await update();
					}
				};
			}}
			class="form"
		>
			<!-- Field: Judul Pedoman KKP -->
			<div class="form-group">
				<label for="title">Judul Pedoman KKP <span class="required">*</span></label>
				<input
					type="text"
					id="title"
					name="title"
					value={form?.values?.title || ''}
					placeholder="Contoh: Pedoman Kuliah Kerja Praktik (KKP) 2026"
					required
				/>
			</div>

			<!-- Field: Upload Foto/Sampul dengan Cloudinary -->
			<div class="form-group">
				<label for="image_upload">Foto Sampul Pedoman</label>
				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<div class="image-preview">
						<img src={imageUrl} alt="Preview Sampul" />
						<button type="button" class="btn-remove-img" onclick={removeImage}> Hapus Foto </button>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						options={getUploadOptions(folder_cloudinary_admin_article_akademik)}
						uploadPreset={upload_cloudinary_preset}
						onSuccess={handleUploadSuccess}
						let:open
					>
						<button type="button" class="btn-upload" onclick={() => open()}>
							<UploadCloud class="h-4 w-4" />
							Unggah Foto Sampul (Cloudinary)
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field: Deskripsi Menggunakan FormEditor -->
			<div class="form-group">
				<input type="hidden" name="description" value={description} />

				<FormEditor
					title="Editor Deskripsi Pedoman KKP"
					label="Deskripsi / Ringkasan Pedoman KKP"
					bind:value={description}
				/>
			</div>

			<div class="form-actions">
				<button
					type="button"
					onclick={() => history.back()}
					class="btn-cancel"
					disabled={isSubmitting}
				>
					Batal
				</button>
				<button type="submit" class="btn-save" disabled={isSubmitting}>
					{isSubmitting ? 'Menyimpan...' : 'Simpan Data Pedoman KKP'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.header {
		margin-bottom: 1.5rem;
	}

	.btn-back {
		color: #0284c7;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.header h1 {
		margin: 0.5rem 0 0 0;
		font-size: 1.75rem;
		color: #0f172a;
	}

	.card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.75rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #1e293b;
	}

	.required {
		color: #dc2626;
	}

	input[type='text'] {
		padding: 0.65rem 0.85rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font-size: 0.95rem;
		width: 100%;
		box-sizing: border-box;
	}

	input[type='text']:focus {
		outline: 2px solid #0284c7;
		border-color: transparent;
	}

	/* Upload Preview & Button Styles */
	.btn-upload {
		padding: 0.75rem 1.25rem;
		border: 2px dashed #cbd5e1;
		background: #f8fafc;
		border-radius: 8px;
		color: #334155;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}

	.btn-upload:hover {
		background: #f1f5f9;
		border-color: #0284c7;
		color: #0284c7;
	}

	.image-preview {
		position: relative;
		display: inline-block;
		max-width: 240px;
	}

	.image-preview img {
		width: 100%;
		height: auto;
		max-height: 180px;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
	}

	.btn-remove-img {
		margin-top: 0.5rem;
		background: #fee2e2;
		color: #dc2626;
		border: 1px solid #fecaca;
		padding: 0.35rem 0.75rem;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-remove-img:hover {
		background: #fca5a5;
	}

	/* Action Buttons */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #f1f5f9;
	}

	.btn-cancel {
		padding: 0.65rem 1.25rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
		background: #ffffff;
		color: #475569;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.btn-cancel:hover {
		background: #f8fafc;
	}

	.btn-save {
		padding: 0.65rem 1.5rem;
		border-radius: 8px;
		border: none;
		background: #0284c7;
		color: #ffffff;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-save:hover {
		background: #0369a1;
	}

	.alert {
		padding: 0.85rem 1rem;
		border-radius: 8px;
		margin-bottom: 1.25rem;
		font-size: 0.9rem;
	}

	.alert.error {
		background-color: #fee2e2;
		color: #b91c1c;
		border: 1px solid #fecaca;
	}
</style>
