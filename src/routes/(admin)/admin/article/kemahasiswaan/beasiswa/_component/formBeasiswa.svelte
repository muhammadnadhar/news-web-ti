<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ScholarshipDTO } from '$lib/dto/admin/article/kemahasiswaan';
	import { CldUploadWidget } from 'svelte-cloudinary';

	import {
		GraduationCap,
		User,
		Award,
		Image as ImageIcon,
		X,
		CheckCircle2,
		AlertCircle,
		Loader2,
		ArrowLeft,
		Save
	} from 'lucide-svelte';
	import { folder_cloudinary_admin_article_kemahasiswaan, getUploadConfig, getUploadOptions, upload_cloudinary_preset } from '$lib/cloudinary/client';
	import { type MessageStatus, type ResponseMessage } from '$lib/types/message';
	import Message from '$lib/components/admin/message.svelte';

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
	// State Image URL Cloudinary
	let imageUrl = $state(form?.values?.image_url ?? initialData?.image_url ?? '');
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}	function removeImage() {
		imageUrl = '';
	}

	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imageUrl = result.info.secure_url;
		}
	}

	function handleCancel() {
		if (onCancel) {
			onCancel();
		} else {
			history.back();
		}
	}
</script>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-3.5">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-light bg-bg-secondary text-accent-primary shadow-sm"
			>
				<GraduationCap class="h-6 w-6" />
			</div>
			<div>
				<h1 class="text-xl font-bold text-text-main sm:text-2xl">
					{isEdit ? 'Edit Data Penerima Beasiswa' : 'Tambah Penerima Beasiswa'}
				</h1>
				<p class="text-xs text-text-muted sm:text-sm">
					Isi formulir di bawah ini untuk mengelola data dan dokumentasi mahasiswa penerima beasiswa.
				</p>
			</div>
		</div>
	</div>

	<!-- alert / toast notification -->
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

	<!-- FORM UTAMA -->
	<form
		method="POST"
		{action}
use:enhance={() => {
		isSubmitting = true;
		showMessage = false;

		return async ({ result, update }) => {
			isSubmitting = false;

			// Akses data response dari server action
			const resData = result.type === 'success' || result.type === 'failure' 
				? (result.data as ResponseMessage | undefined) 
				: undefined;

			if (result.type === 'success' && resData?.status === 'success') {
				triggerMessage(
					'success',
					resData.title || 'Berhasil',
					resData.message || 'Data beasiswa berhasil disimpan.'
				);

				if (!isEdit) {
					imageUrl = '';
				}
				await update({ reset: !isEdit });

			} else if (resData?.status === "error" || result.type === 'failure') {
				triggerMessage(
					'error',
					resData?.title || 'Gagal Menyimpan',
					resData?.message || 'Terjadi kesalahan saat memproses data.'
				);
				await update();

			} else {
				triggerMessage(
					'error',
					'Error',
					'Terjadi kesalahan sistem saat memproses data.'
				);
				await update();
			}
		};
	}}		class="space-y-6 rounded-2xl border border-border-light bg-bg-secondary p-6 shadow-sm sm:p-8"
	>
		<!-- Input Hidden ID (Saat Edit) -->
		{#if isEdit}
			<input type="hidden" name="id" value={initialData?.id} />
		{/if}

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- 1. Nama Mahasiswa -->
			<div class="space-y-2">
				<label for="student_name" class="block text-xs font-bold uppercase tracking-wider text-text-main">
					Nama Mahasiswa <span class="text-status-error">*</span>
				</label>
				<div class="relative">
					<User class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						id="student_name"
						name="student_name"
						value={form?.values?.student_name ?? initialData?.student_name ?? ''}
						placeholder="Masukkan nama lengkap mahasiswa..."
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pl-10 pr-4 text-xs text-text-main shadow-xs transition placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary disabled:opacity-50"
					/>
				</div>
			</div>

			<!-- Nama Beasiswa / Kategori -->
			<div class="space-y-2">
				<label for="scholarship_name" class="block text-xs font-bold uppercase tracking-wider text-text-main">
					Nama Beasiswa / Kategori <span class="text-status-error">*</span>
				</label>
				<div class="relative">
					<Award class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
					<input
						type="text"
						id="scholarship_name"
						name="scholarship_name"
						value={form?.values?.scholarship_name ?? initialData?.scholarship_name ?? ''}
						placeholder="Contoh: Beasiswa Unggulan 2026"
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pl-10 pr-4 text-xs text-text-main shadow-xs transition placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary disabled:opacity-50"
					/>
				</div>
			</div>
		</div>

		<!-- 3. Field Upload Foto Media Dokumentasi Cloudinary -->
		<div class="space-y-2 pt-2">
			<label for="image_upload" class="block text-xs font-bold uppercase tracking-wider text-text-main">
				Foto / Media Utama Dokumentasi <span class="text-status-error">*</span>
			</label>
			<input type="hidden" name="image_url" value={imageUrl} required />

			{#if imageUrl}
				<div
					class="relative w-full max-w-md overflow-hidden rounded-xl border border-border-light bg-bg-primary p-2 shadow-xs"
				>
					<img
						src={imageUrl}
						alt="Preview Dokumentasi"
						class="h-52 w-full rounded-lg object-cover"
					/>
					<button
						type="button"
						onclick={removeImage}
						disabled={isSubmitting}
						class="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs font-semibold text-status-error transition hover:bg-status-error/20 active:scale-95 disabled:opacity-50"
					>
						✕ Hapus & Ganti Gambar
					</button>
				</div>
			{:else}
				<CldUploadWidget
					config={getUploadConfig()}
					uploadPreset={upload_cloudinary_preset}
					options={getUploadOptions(folder_cloudinary_admin_article_kemahasiswaan)}
					onSuccess={handleUploadSuccess}
					let:open
				>
					<button
						type="button"
						onclick={() => open()}
						disabled={isSubmitting}
						class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-light bg-bg-primary px-6 py-8 text-center shadow-xs transition hover:bg-bg-primary-glare active:scale-[0.99] disabled:opacity-50"
					>
						<div
							class="mb-2 rounded-full border border-border-light bg-bg-secondary p-3 text-accent-purple shadow-xs"
						>
							<ImageIcon class="h-6 w-6" />
						</div>
						<span class="text-sm font-semibold text-accent-purple">
							Unggah Foto Dokumentasi
						</span>
						<span class="mt-1 text-xs text-text-muted">Format gambar (PNG, JPG, WebP)</span>
					</button>
				</CldUploadWidget>
			{/if}
		</div>

		<div class="flex items-center justify-end gap-3 border-t border-border-light pt-6">
			<button
				type="button"
				onclick={handleCancel}
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 rounded-xl border border-border-light bg-bg-primary px-4 py-2.5 text-xs font-bold text-text-muted shadow-xs transition hover:bg-bg-secondary hover:text-text-main active:scale-95 disabled:opacity-50"
			>
				<span>Batal</span>
			</button>

			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 rounded-xl border border-accent-primary/50 bg-accent-primary px-5 py-2.5 text-xs font-bold text-text-dark shadow-xs transition hover:bg-accent-primary-hover active:scale-95 disabled:opacity-50"
			>
				{#if isSubmitting}
					<Loader2 class="h-4 w-4 animate-spin" />
					<span>Memproses...</span>
				{:else}
					<Save class="h-4 w-4" />
					<span>{isEdit ? 'Perbarui Data Beasiswa' : 'Simpan Data Beasiswa'}</span>
				{/if}
			</button>
		</div>
	</form>
</div>
