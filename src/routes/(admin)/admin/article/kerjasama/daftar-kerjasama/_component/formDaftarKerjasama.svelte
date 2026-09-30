<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import { Building2, UploadCloud, X, Handshake, Send, Loader2 } from 'lucide-svelte';
	import {
		folder_cloudinary_admin_article_kerjasama,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import type { PartnershipDTO } from '$lib/dto/admin/article/kerjasama';
	import { goto } from '$app/navigation';

	interface Props {
		initialData?: PartnershipDTO | null;
		form?: any;
		actionUrl?: string;
		backUrl?: string;
	}

	let { initialData = null, form = null, actionUrl = '', backUrl }: Props = $props();

	// Deteksi mode Edit
	const isEdit = $derived(!!initialData?.id);

	// State lokal input form
	let institutionName = $state(
		form?.values?.institutionName ?? initialData?.institution_name ?? ''
	);
	let logoUrl = $state(form?.values?.logoUrl ?? initialData?.logo_url ?? '');
	let photoPublicId = $state(''); // Simpan public_id dari Cloudinary jika diunggah baru

	let isSubmitting = $state(false);
	let isDeletingPhoto = $state(false);

	// Message State
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, titleMsg: string, message: string) {
		messageConfig = { status, title: titleMsg, message };
		showMessage = true;
	}

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			logoUrl = result.info.secure_url;
			photoPublicId = result.info.public_id;

			if (typeof document !== 'undefined') {
				document.body.style.overflow = 'auto';
			}
		}
	}

	// Fungsi hapus logo (melalui server action jika ada photoPublicId)
	async function removeLogo() {
		if (!photoPublicId) {
			logoUrl = '';
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', photoPublicId);

			const response = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData
			});

		if (response.ok) {
				logoUrl = '';
				photoPublicId = '';
				triggerMessage('success', 'Berhasil', 'Gambar berhasil dihapus dari .');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus gambar dari Cloudinary.');
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
			triggerMessage('error', 'Error', 'Terjadi kesalahan saat menghapus foto.');
		} finally {
			isDeletingPhoto = false;
		}
	}
</script>

<!-- notifikasi pesan -->
{#if showMessage || form?.message}
	<div class="mb-6">
		<Message
			status={showMessage ? messageConfig.status : 'error'}
			title={showMessage ? messageConfig.title : 'Gagal'}
			message={showMessage ? messageConfig.message : form?.message || ''}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	</div>
{/if}

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-3">
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-xl font-bold tracking-tight text-text-main sm:text-2xl">
						{isEdit ? 'Edit Data Kerjasama' : 'Tambah Kerjasama'}
					</h1>
					<span
						class="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase
						{isEdit
							? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
							: 'border border-accent-primary/20 bg-accent-primary/10 text-accent-primary'}"
					>
						{isEdit ? 'Mode Edit' : 'Baru'}
					</span>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui data kemitraan/instansi yang terdaftar.'
						: 'Tambahkan data mitra kerjasama atau instansi baru.'}
				</p>
			</div>
		</div>
	</div>

	<!-- FORM CONTAINER -->
	<div class="overflow-hidden rounded-2xl border border-border-light bg-bg-secondary shadow-xl">
		<div class="border-b border-border-light bg-bg-primary-glare px-6 py-4">
			<h2 class="flex items-center gap-2 text-sm font-semibold text-accent-primary">
				<Handshake class="h-4 w-4" />
				<span>Formulir Data Kerjasama</span>
			</h2>
		</div>

		<form
			action={actionUrl || (isEdit ? '?/update' : '?/create')}
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

						if (resData.status === 'success' && !isEdit) {
							institutionName = '';
							logoUrl = '';
							photoPublp-00icId = '';
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
			{#if isEdit && initialData?.id}
				<input type="hidden" name="id" value={initialData.id} />
			{/if}

			{#if form?.error}
				<div
					class="rounded-lg border border-status-error/40 bg-status-error/20 p-3.5 text-xs font-medium text-status-error"
				>
					{form.error}
				</div>
			{/if}

			<!-- Hidden input URL Logo untuk backend -->
			<input type="hidden" name="logo_url" value={logoUrl} />
			<input type="hidden" name="public_id" value={photoPublicId} />

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
							class="relative flex h-32 w-48 items-center justify-center overflow-hidden rounded-xl border border-border-light bg-bg-secondary/5 p-2 shadow-md"
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
								class="absolute top-1 right-1 rounded-full bg-status-error p-1.5 text-text-main shadow transition-transform hover:scale-110 disabled:opacity-50"
								title="Hapus Logo"
							>
								{#if isDeletingPhoto}
									<Loader2 class="h-3.5 w-3.5 animate-spin" />
								{:else}
									<X class="h-3.5 w-3.5" />
								{/if}
							</button>
						</div>
						<p class="mt-3 max-w-62.5 truncate text-[11px] text-text-muted">
							{logoUrl}
						</p>
					{:else}
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

			<!-- Tombol Action -->
			<div class="flex justify-end gap-2 border-t border-border-light pt-4">
				<button
					onclick={() => (backUrl ? goto(backUrl) : history.back())}
					class="rounded-xl border border-white/10 bg-bg-secondary/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-text-main active:scale-95"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-5 py-2.5 text-xs font-bold text-text-dark shadow-md transition-all hover:opacity-90 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Memproses...</span>
					{:else}
						<Send class="h-4 w-4" />
						<span>{isEdit ? 'Simpan Perubahan' : 'Simpan Data'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
