<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	// State lokal untuk gambar dan deskripsi editor
	let imageUrl = $state(form?.values?.imageUrl || '');
	let description = $state(form?.values?.description || '');

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
	<!-- <header class="header"> -->
	<!-- 	<a href="/admin/akademik/rekrutmen-asisten" class="btn-back">← Kembali ke Daftar</a> -->
	<!-- 	<h1>Tambah Rekrutmen Asisten Baru</h1> -->
	<!-- </header> -->

	{#if form?.message}
		<div class="alert error">
			{form.message}
		</div>
	{/if}

	<div class="card">
		<form method="POST" use:enhance class="form">
			<!-- Field: Judul Rekrutmen -->
			<div class="form-group">
				<label for="title">Judul / Ketentuan Rekrutmen <span class="required">*</span></label>
				<input
					type="text"
					id="title"
					name="title"
					value={form?.values?.title || ''}
					placeholder="Contoh: Open Recruitment Asisten Laboratorium TI Semester Ganjil 2026/2027"
					required
				/>
			</div>

			<!-- Field: Upload Foto Sampul/Poster dengan Cloudinary -->
			<div class="form-group">
				<label for="image_upload">Poster / Foto Pendukung</label>
				<input type="hidden" name="image_url" value={imageUrl} />

				{#if imageUrl}
					<div class="image-preview">
						<img src={imageUrl} alt="Preview Poster" />
						<button type="button" class="btn-remove-img" onclick={removeImage}>
							✕ Hapus Foto
						</button>
					</div>
				{:else}
					<CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess} let:open>
						<button type="button" class="btn-upload" onclick={() => open()}>
							📷 Unggah Poster / Gambar (Cloudinary)
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field: Deskripsi Menggunakan FormEditor -->
			<div class="form-group">
				<input type="hidden" name="description" value={description} />

				<FormEditor
					title="Editor Ketentuan Rekrutmen"
					label="Deskripsi / Syarat & Ketentuan Rekrutmen"
					bind:value={description}
				/>
			</div>

			<!-- Actions -->
			<div class="form-actions">
				<a href="/admin/akademik/rekrutmen-asisten" class="btn-cancel">Batal</a>
				<button type="submit" class="btn-save">Simpan Rekrutmen</button>
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
