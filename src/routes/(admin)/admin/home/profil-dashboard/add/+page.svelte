<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadButton, CldUploadWidget } from 'svelte-cloudinary';

	import { Upload, Image as ImageIcon, LayoutDashboard, Trash2 } from 'lucide-svelte';
	import Message from '$lib/components/admin/message.svelte';
	import {
		folder_cloudinary_admin_home_profilDashboard,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client.js';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';

	let { form } = $props();

	// State untuk URL/Path gambar hasil unggahan Cloudinary
	let imagePath = $state(form?.image_path || '');
	let isSubmitting = $state(false);

	// Callback ketika unggahan ke Cloudinary berhasil
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imagePath = result.info.secure_url;
		}
	}

	function handleRemoveImage() {
		imagePath = '';
	}

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
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex items-center gap-4">
		<div>
			<h1 class="text-xl font-bold text-text-main md:text-2xl">Tambah Profile Dashboard</h1>
			<p class="text-sm text-text-muted">Tambahkan banner/gambar profile dashboard baru.</p>
		</div>
	</div>

	<!-- Notifikasi Pesan -->
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

	<form
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			showMessage = false;

			return async ({ result, update }) => {
				isSubmitting = false;

				if (result.type === 'success') {
					const resData = (result.data as ResponseMessage) ?? {
						status: 'success',
						title: 'Berhasil',
						message: 'Data angkatan berhasil disimpan.'
					};
					triggerMessage(resData.status, resData.title, resData.message);
					await update({ reset: true });
				} else if (result.type === 'failure') {
					const resData = (result.data as ResponseMessage) ?? {
						status: 'error',
						title: 'Gagal',
						message: 'Gagal menyimpan data angkatan.'
					};
					triggerMessage(resData.status, resData.title, resData.message);
					await update();
				} else {
					const resData: ResponseMessage = {
						status: 'error',
						title: 'Kesalahan Sistem',
						message: 'Terjadi kesalahan sistem yang tidak diketahui.'
					};
					triggerMessage(resData.status, resData.title, resData.message);
					await update();
				}
			};
		}}
		class="space-y-6 border border-border-color bg-bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] md:p-8"
	>
		<input type="hidden" name="image_path" value={imagePath} />

		<div class="space-y-2">
			<label for="title" class="block text-sm font-bold text-text-main">
				Profile Text <span class="text-status-error">*</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				required
				value={form?.title || ''}
				placeholder="Contoh: Banner Dashboard Utama"
				class="w-full border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
			/>
		</div>

		<!-- Field 2: Upload Gambar via svelte-cloudinary -->
		<div class="space-y-2">
			<label class="block text-sm font-bold text-text-main">
				Upload Gambar <span class="text-status-error">*</span>
			</label>

			{#if imagePath}
				<!-- Frame Pratinjau Gambar 3D -->
				<div
					class="relative flex flex-col items-center justify-center border border-border-color bg-bg-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
				>
					<img
						src={imagePath}
						alt="Preview Profile Dashboard"
						class="max-h-56 border border-border-color object-contain"
					/>
					<button
						type="button"
						onclick={handleRemoveImage}
						class="mt-3 inline-flex items-center gap-1.5 border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs font-bold text-status-error transition-all hover:bg-status-error/20 active:scale-95"
					>
						<Trash2 class="h-3.5 w-3.5" />
						<span>Hapus Gambar</span>
					</button>
				</div>
			{:else}
				<!-- Dropzone Box Upload Gambar 3D -->
				<div
					class="flex w-full flex-col items-center justify-center border-2 border-dashed border-border-color bg-bg-primary p-6 text-center transition-all hover:bg-bg-primary-glare"
				>
					<div
						class="mb-3 flex h-12 w-12 items-center justify-center border border-border-color bg-bg-secondary text-accent-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
					>
						<ImageIcon class="h-6 w-6" />
					</div>
					<p class="mb-3 text-xs text-text-muted">Format yang didukung: PNG, JPG, WEBP atau SVG</p>

					<CldUploadButton
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_home_profilDashboard)}
						config={getUploadConfig()}
						onSuccess={handleUploadSuccess}
						class="inline-flex items-center gap-2 border border-border-color bg-accent-primary px-4 py-2 text-xs font-bold text-text-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95"
					>
						<Upload class="h-4 w-4" />
						<span>Unggah Gambar</span>
					</CldUploadButton>
				</div>
			{/if}
		</div>

		<div class="flex items-center justify-end gap-3 border-t border-border-color pt-6">
			<button
				type="button"
				onclick={() => history.back()}
				class="border border-border-color bg-bg-primary px-5 py-2.5 text-sm font-semibold text-text-main transition-all hover:bg-bg-secondary-hover active:scale-95"
			>
				Batal
			</button>

			<button
				type="submit"
				disabled={isSubmitting || !imagePath}
				class="inline-flex items-center gap-2 border border-border-color bg-accent-primary px-6 py-2.5 text-sm font-bold text-text-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95 disabled:opacity-50"
			>
				<LayoutDashboard class="h-4 w-4" />
				<span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</span>
			</button>
		</div>
	</form>
</div>
