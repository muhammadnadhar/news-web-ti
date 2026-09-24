<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ScholarshipDTO } from '$lib/dto/admin/article/kemahasiswaan';

	interface Props {
		initialData?: ScholarshipDTO | null; // Null saat Add, terisi saat Edit
		form?: any; // Respon balik dari Form Action
		action?: string; // Target URL Form Action (misal: '?/create' atau '?/update')
		onCancel?: () => void; // Event Handler opsional tombol Batal
	}

	let { initialData = null, form = null, action = '', onCancel }: Props = $props();

	// Mode Edit terdeteksi jika initialData memiliki ID
	let isEdit = $derived(!!initialData?.id);
	let isSubmitting = $state(false);

	// State Alert / Message
	let showMessage = $state(false);
	let messageType = $state<'success' | 'error'>('success');
	let messageTitle = $state('');
	let messageText = $state('');

	// State Foto (Fallback: form action error > initialData > string kosong)
	let photoUrl = $state(form?.values?.image_url ?? initialData?.image_url ?? '');

	function triggerMessage(type: 'success' | 'error', title: string, message: string) {
		messageType = type;
		messageTitle = title;
		messageText = message;
		showMessage = true;
	}

	function handleRemovePhoto() {
		photoUrl = '';
	}

	function handleCancel() {
		if (onCancel) {
			onCancel();
		} else {
			history.back();
		}
	}
</script>

{#if showMessage}
	<div class="alert alert-{messageType}">
		<div>
			<strong>{messageTitle}</strong>
			<p>{messageText}</p>
		</div>
		<button type="button" onclick={() => (showMessage = false)}>✕</button>
	</div>
{/if}

<form
	method="POST"
	{action}
	use:enhance={() => {
		isSubmitting = true;
		showMessage = false;

		return async ({ result, update }) => {
			isSubmitting = false;

			if (result.type === 'success' && result.data?.success) {
				triggerMessage(
					'success',
					(result.data.title as string) || 'Berhasil',
					(result.data.message as string) || 'Data beasiswa berhasil disimpan.'
				);

				// Reset form jika dalam mode Tambah/Add
				if (!isEdit) {
					photoUrl = '';
				}
				await update({ reset: !isEdit });
			} else if (result.type === 'failure' && result.data) {
				triggerMessage(
					'error',
					(result.data.title as string) || 'Gagal Menyimpan',
					(result.data.message as string) || 'Terjadi kesalahan saat validasi data.'
				);
				await update();
			} else {
				triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
				await update();
			}
		};
	}}
	class="form"
>
	<!-- Input Hidden ID (Hanya terisi saat Edit) -->
	{#if isEdit}
		<input type="hidden" name="id" value={initialData?.id} />
	{/if}

	<!-- Hidden Input untuk URL Foto -->
	<input type="hidden" name="image_url" bind:value={photoUrl} />

	<!-- 1. Nama Mahasiswa -->
	<div class="form-group">
		<label for="student_name">Nama Mahasiswa *</label>
		<input
			type="text"
			id="student_name"
			name="student_name"
			value={form?.values?.student_name ?? initialData?.student_name ?? ''}
			placeholder="Masukkan nama lengkap mahasiswa..."
			required
			disabled={isSubmitting}
			class="input-control"
		/>
	</div>

	<!-- 2. Nama Beasiswa / Kategori -->
	<div class="form-group">
		<label for="scholarship_name">Nama Beasiswa / Kategori *</label>
		<input
			type="text"
			id="scholarship_name"
			name="scholarship_name"
			value={form?.values?.scholarship_name ?? initialData?.scholarship_name ?? ''}
			placeholder="Contoh: Beasiswa Unggulan 2026"
			required
			disabled={isSubmitting}
			class="input-control"
		/>
	</div>

	<!-- 3. Foto Mahasiswa -->
	<div class="form-group">
		<label for="image_url">Foto Mahasiswa Penerima Beasiswa</label>

		{#if photoUrl}
			<div class="image-preview">
				<img src={photoUrl} alt="Preview Foto Mahasiswa" />
				<button type="button" class="btn-delete-photo" onclick={handleRemovePhoto}>
					✕ Hapus Foto
				</button>
			</div>
		{:else}
			<div class="upload-area">
				<!-- Integrasikan modal/widget uploader kamu di sini -->
				<button type="button" class="btn-upload" disabled={isSubmitting}>
					Unggah Foto Mahasiswa
				</button>
			</div>
		{/if}
	</div>

	<!-- Action Buttons -->
	<div class="form-actions">
		<button type="button" onclick={handleCancel} disabled={isSubmitting} class="btn-cancel">
			Batal
		</button>
		<button type="submit" disabled={isSubmitting} class="btn-submit">
			{isSubmitting ? 'Memproses...' : isEdit ? 'Perbarui Data Beasiswa' : 'Simpan Data Beasiswa'}
		</button>
	</div>
</form>
