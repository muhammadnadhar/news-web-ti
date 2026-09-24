<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import { Building2, UploadCloud, X, Handshake, ArrowLeft, Send } from 'lucide-svelte';
	import type { ActionData } from './$types';
	import {
		folder_cloudinary_admin_article_kerjasama,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();
	let photoPublicId = $state(''); // Simpan public_id dari Cloudinary
	let isDeletingPhoto = $state(false);

	let institutionName = $state(form?.values?.institutionName ?? '');
	let logoUrl = $state(form?.values?.logoUrl ?? '');
	let isSubmitting = $state(false);

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			logoUrl = result.info.secure_url;
			photoPublicId = result.info.public_id; // Dapatkan public_id

			// Pulihkan scroll body yang terkunci oleh Cloudinary
			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}
		}
	}

	// Fungsi untuk menghapus foto dari Cloudinary & mereset state
	async function removeLogo() {
		if (!photoPublicId) {
			logoUrl = '';
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', photoPublicId);

			// Panggil named action '?/deletePhoto'
			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				logoUrl = '';
				photoPublicId = '';
			} else {
				alert('Gagal menghapus gambar dari Cloudinary');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
		} finally {
			isDeletingPhoto = false;
		}
	}

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
</script>

<svelte:head>
	<title>Tambah Kerjasama - Admin Portal</title>
</svelte:head>

{#if showMessage || form?.message}
	<Message
		status={showMessage ? messageConfig.status : 'error'}
		title={showMessage ? messageConfig.title : 'Gagal'}
		message={showMessage ? messageConfig.message : form?.message || ''}
		dismissible={true}
		timeout={4000}
		onclose={() => (showMessage = false)}
	/>
{/if}

<div class="min-h-screen bg-bg-primary p-4 text-text-main md:p-8">
	<div class="mx-auto max-w-3xl space-y-6">
		<div class="overflow-hidden rounded-2xl border border-border-light bg-bg-secondary shadow-xl">
			<div class="border-b border-border-light bg-bg-primary-glare px-6 py-4">
				<h2 class="flex items-center gap-2 text-base font-semibold text-accent-primary">
					<Handshake class="h-5 w-5" />
					<span>Form Tambah Data Kerjasama Instansi</span>
				</h2>
			</div>

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
								message: 'Data kerjasama berhasil disimpan.'
							};
							triggerMessage(resData.status, resData.title, resData.message);

							if (resData.status === 'success') {
								institutionName = '';
								logoUrl = '';
								photoPublicId = '';
							}
							await update();
						} else if (result.type === 'failure') {
							const resData = (result.data as ResponseMessage) ?? {
								status: 'error',
								title: 'Gagal',
								message: (result.data?.message as string) || 'Gagal menyimpan data kerjasama.'
							};
							triggerMessage(resData.status, resData.title, resData.message);
							await update();
						} else {
							triggerMessage('error', 'Error', 'Terjadi kesalahan sistem yang tidak diketahui.');
							await update();
						}
					};
				}}
				class="space-y-6 p-6"
			>
				{#if form?.error}
					<div
						class="rounded-lg border border-status-error/40 bg-status-error/20 p-3.5 text-xs font-medium text-status-error"
					>
						{form.error}
					</div>
				{/if}

				<!-- Hidden input URL Logo untuk backend -->
				<input type="hidden" name="logo_url" value={logoUrl} />

				<!-- Nama Instansi / Mitra -->
				<div class="space-y-1.5">
					<label for="institution_name" class="block text-xs font-medium text-text-muted">
						Nama Instansi / Mitra Kerjasama <span class="text-status-error">*</span>
					</label>
					<div class="relative">
						<input
							type="text"
							id="institution_name"
							name="institution_name"
							bind:value={institutionName}
							required
							placeholder="Contoh: Bank Indonesia / Forum Konservasi Leuser"
							class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pr-3 pl-10 text-xs text-text-main transition-colors focus:border-accent-primary focus:outline-none"
						/>
						<Building2 class="absolute top-3 left-3 h-4 w-4 text-text-muted" />
					</div>
				</div>

				<!-- Upload Logo Mitra (Cloudinary Widget) -->
				<div class="space-y-2">
					<label class="block text-xs font-medium text-text-muted"> Logo Instansi / Mitra </label>

					<div
						class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light bg-bg-primary p-6 text-center"
					>
						{#if logoUrl}
							<div
								class="relative flex h-32 w-48 items-center justify-center overflow-hidden rounded-xl border border-border-light bg-white/5 p-2 shadow-md"
							>
								<img
									src={logoUrl}
									alt="Preview Logo Instansi"
									class="max-h-full max-w-full object-contain"
								/>
								<button
									type="button"
									onclick={removeLogo}
									disabled={isDeletingPhoto}
									class="absolute top-1 right-1 rounded-full bg-status-error p-1.5 text-text-main shadow transition-transform hover:scale-110"
									title="Hapus Logo"
								>
									<X class="h-3.5 w-3.5" />
								</button>
							</div>
							<p class="mt-3 max-w-[250px] truncate text-[11px] text-text-muted">
								{logoUrl}
							</p>
						{:else}
							<!-- Placeholder Lucide Icon & Widget CldUploadWidget -->
							<div
								class="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-border-light bg-bg-secondary text-text-muted"
							>
								<Building2 class="h-10 w-10 opacity-40" />
							</div>

							<CldUploadWidget
								config={getUploadConfig()}
								options={getUploadOptions(folder_cloudinary_admin_article_kerjasama)}
								uploadPreset={upload_cloudinary_preset}
								onUpload={handleUpload}
								let:open
							>
								<button
									type="button"
									onclick={() => open()}
									class="inline-flex items-center gap-2 rounded-xl border border-border-light bg-bg-secondary px-4 py-2.5 text-xs font-semibold text-accent-primary shadow-sm transition-all hover:bg-border-light"
								>
									<UploadCloud class="h-4 w-4" />
									<span>Pilih & Unggah Logo</span>
								</button>
							</CldUploadWidget>
						{/if}
					</div>
				</div>

				<!-- Tombol Submit -->
				<div class="flex justify-end border-t border-border-light pt-4">
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-5 py-2.5 text-xs font-bold text-text-dark shadow-md transition-all hover:opacity-90 disabled:opacity-50"
					>
						{#if isSubmitting}
							<span>Memproses...</span>
						{:else}
							<Send class="h-4 w-4" />
							<span>Simpan Data</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
