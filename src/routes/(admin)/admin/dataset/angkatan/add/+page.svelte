<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Message from '$lib/components/admin/message.svelte';
	import { removeLastPath } from '$lib/utils';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	// Tahun saat ini untuk rekomendasi placeholder/default
	const currentYear = new Date().getFullYear();
</script>

<div class="container">
	<header class="header">
		<!-- <a href="/admin/akademik/angkatan" class="btn-back">← Kembali ke Daftar Angkatan</a> -->
		<h1>Tambah Angkatan Baru</h1>
	</header>

	{#if form?.message}
	<div class="mb-6">
         <Message 
                status={form.success ? 'success' : 'error'} 
                title={form.success ? 'Berhasil' : 'Gagal Menyimpan'}
                message={form.message} 
                dismissible={true}
                timeout={5000} 
            />
        </div>
	{/if}

	<div class="card">
		<form method="POST" use:enhance class="form">
			<!-- Field: Tahun Angkatan -->
			<div class="form-group">
				<label for="year">Tahun Angkatan <span class="required">*</span></label>
				<input
					type="number"
					id="year"
					name="year"
					value={form?.values?.year || ''}
					placeholder={`Contoh: ${currentYear}`}
					min="2000"
					max={currentYear + 10}
					step="1"
					required
				/>
				<small class="help-text">
					Masukkan angka 4 digit tahun angkatan mahasiswa (contoh: {currentYear}).
				</small>
			</div>

			<!-- Actions -->
			<div class="form-actions">
				<button onclick={() => goto(removeLastPath())} class="btn-cancel">Batal</button>
				<button type="submit" class="btn-save">Simpan Data Angkatan</button>
			</div>
		</form>
	</div>
</div>

<style>
	.container {
		max-width: 600px;
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

	.help-text {
		font-size: 0.8rem;
		color: #64748b;
	}

	input[type='number'] {
		padding: 0.65rem 0.85rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font-size: 0.95rem;
		width: 100%;
		box-sizing: border-box;
		font-family: inherit;
	}

	input[type='number']:focus {
		outline: 2px solid #0284c7;
		border-color: transparent;
	}

	/* Chrome, Safari, Edge, Opera: Hapus panah spinner angka jika diinginkan (opsional) */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		opacity: 1;
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
