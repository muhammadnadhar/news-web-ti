<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import type { ActionData } from './$types';
	import { page } from '$app/state';
	import {
		folder_cloudinary_admin_article_kurikulum,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import { UploadCloudIcon } from 'lucide-svelte';

	let { form }: { form: ActionData } = $props();

	// State lokal untuk URL gambar peta mata kuliah
	let imageUrl = $state(form?.values?.imageUrl || '');

	// Handler saat gambar berhasil diunggah ke Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
		}
	}

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imageUrl = result.info.secure_url;
		}
	}

	// Hapus foto jika ingin mengganti
	function removeImage() {
		imageUrl = '';
	}
</script>

<div class="container">
	<!-- <header class="header"> -->
	<!-- 	<a href="/admin/akademik/peta-matakuliah" class="btn-back">← Kembali ke Daftar Peta Mata Kuliah</a> -->
	<!-- 	<h1>Tambah Peta Mata Kuliah Baru</h1> -->
	<!-- </header> -->

	{#if form?.message}
		<div class="alert error">
			{form.message}
		</div>
	{/if}

	<div class="card">
		<form method="POST" use:enhance class="form">
			<!-- Field: Judul Peta Mata Kuliah -->
			<div class="form-group">
				<label for="title">Judul Peta Mata Kuliah </label>
				<input
					type="text"
					id="title"
					name="title"
					value={form?.values?.title || ''}
					placeholder="Contoh: Peta Mata Kuliah Kurikulum Angkatan 2026 Keatas"
					required
				/>
			</div>

			<!-- Field: Upload Foto Peta Mata Kuliah dengan Cloudinary (Mandatory) -->
			<div class="form-group">
				<label for="image_upload">Gambar Peta Mata Kuliah <span class="required">*</span></label>
				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<div class="image-preview">
						<img src={imageUrl} alt="Preview Peta Mata Kuliah" />
						<button type="button" class="btn-remove-img" onclick={removeImage}>
							✕ Hapus & Ganti Gambar
						</button>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_article_kurikulum)}
						onUpload={handleUpload}
						let:open
						let:isLoading
					>
						<button
							type="button"
							onclick={() => open()}
							class="text-text-accent-primary inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:bg-[var(--color-border-light)]"
						>
							<UploadCloudIcon class="h-4 w-4" />
							<span>Unggah Foto</span>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<div class="form-actions">
				<button onclick={() => history.back()} class="btn-cancel">Batal</button>
				<button type="submit" class="btn-save">Simpan Peta MK</button>
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
		max-width: 320px;
	}

	.image-preview img {
		width: 100%;
		height: auto;
		max-height: 240px;
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
