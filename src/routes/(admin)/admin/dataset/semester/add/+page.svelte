<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	// State untuk checkbox status aktif
	let isActive = $state(form?.values?.isActive ?? false);
</script>

<div class="container">
	<header class="header">
		<!-- <a href="/admin/akademik/semester" class="btn-back">← Kembali ke Daftar Semester</a> -->
		<h1>Tambah Semester Baru</h1>
	</header>

	{#if form?.message}
		<div class="alert error">
			{form.message}
		</div>
	{/if}

	<div class="card">
		<form method="POST" use:enhance class="form">
			<!-- Field: Nama Semester -->
			<div class="form-group">
				<label for="name">Nama Semester <span class="required">*</span></label>
				<input
					type="text"
					id="name"
					name="name"
					value={form?.values?.name || ''}
					placeholder="Contoh: Semester Ganjil 2026/2027"
					required
				/>
			</div>

			<!-- Field: Tahun Ajaran -->
			<div class="form-group">
				<label for="academic_year">Tahun Ajaran <span class="required">*</span></label>
				<input
					type="text"
					id="academic_year"
					name="academic_year"
					value={form?.values?.academicYear || ''}
					placeholder="Contoh: 2026/2027 atau ganjil26-27"
					required
				/>
				<small class="help-text">Format standar penulisan tahun ajaran akademik.</small>
			</div>

			<!-- Field: Penanda Semester Aktif (Is Active) -->
			<div class="form-group checkbox-group">
				<label class="checkbox-label" for="is_active">
					<input type="checkbox" id="is_active" name="is_active" bind:checked={isActive} />
					<span class="checkbox-custom"></span>
					<div>
						<strong>Set sebagai Semester Aktif</strong>
						<p class="checkbox-help">
							Jika diaktifkan, semester ini akan dijadikan patokan perkuliahan saat ini.
						</p>
					</div>
				</label>
			</div>

			<!-- Actions -->
			<div class="form-actions">
				<a href="/admin/akademik/semester" class="btn-cancel">Batal</a>
				<button type="submit" class="btn-save">Simpan Data Semester</button>
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

	.help-text {
		font-size: 0.8rem;
		color: #64748b;
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

	/* Toggle / Custom Checkbox Style */
	.checkbox-group {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1rem;
	}

	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.15rem;
		accent-color: #0284c7;
		cursor: pointer;
	}

	.checkbox-label strong {
		color: #0f172a;
		font-size: 0.95rem;
	}

	.checkbox-help {
		margin: 0.2rem 0 0 0;
		font-size: 0.825rem;
		color: #64748b;
		font-weight: normal;
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
