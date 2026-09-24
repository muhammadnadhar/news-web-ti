<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		folder_cloudinary_admin_article_berita,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import type { NewsCategoryDTO } from '$lib/dto/admin/dataset';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import { LoaderCircle, Trash2 } from 'lucide-svelte';

	export interface ArticleData {
		id?: string;
		title?: string;
		category?: string; // ID kategori yang dipilih (misal: berita.category_id)
		categories?: NewsCategoryDTO[];
		content?: string;
		imageUrl?: string;
	}

	interface Props {
		form?: any;
		initialData?: ArticleData;
		isEdit?: boolean;
		actionUrl?: string;
	}

	let { form, initialData, isEdit = false, actionUrl }: Props = $props();

	// Menggunakan $state agar variabel bisa di-bind (two-way binding)
	let title = $state(form?.values?.title ?? initialData?.title ?? '');
	let selectedCategory = $state(form?.values?.category ?? initialData?.category ?? '');
	let content = $state(form?.values?.content ?? initialData?.content ?? '');
	let imageUrl = $state(form?.values?.imageUrl ?? initialData?.imageUrl ?? '');
	let isSubmitting = $state(false);

	// Ambil daftar opsi kategori dari initialData
	let categoriesList = $derived(initialData?.categories ?? []);

	let formElement = $state<HTMLFormElement | null>(null);

	function handleParentSubmit(editorData: string) {
		content = editorData; // Sinkronisasi ulang (opsional karena sudah bind:value)

		// Trigger pengiriman form parent ke SvelteKit Form Action
		if (formElement) {
			formElement.requestSubmit();
		}
	}

	// Sync data jika initialData berubah (saat mode edit)
	$effect(() => {
		if (initialData && !form?.values) {
			title = initialData.title ?? '';
			selectedCategory = initialData.category ?? '';
			content = initialData.content ?? '';
			imageUrl = initialData.imageUrl ?? '';
		}
	});

	// Handler saat unggah ke Cloudinary berhasil
	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imageUrl = result.info.secure_url;
		}
	}

	let photoPublicId = $state(''); // Simpan public_id dari Cloudinary
	let isDeletingPhoto = $state(false);

	// State untuk Pesan/Notifikasi
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

	// Fungsi untuk mengosongkan gambar jika ingin mengganti

	// Fungsi untuk menghapus foto dari Cloudinary & mereset state
	async function removeImage() {
		if (!photoPublicId) {
			imageUrl = '';
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
				imageUrl = '';
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
</script>

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

<div class="min-h-screen bg-bg-primary p-6 text-text-main">
	<!-- Header Halaman -->
	<h1 class="mb-6 text-2xl font-semibold text-text-main">
		{isEdit ? 'Ubah Berita' : 'Tambah Berita'}
	</h1>

	<div class="overflow-hidden rounded-lg border border-border-light bg-bg-secondary shadow-sm">
		<div class="border-b border-border-light bg-bg-primary-glare px-6 py-4">
			<h2 class="text-base font-semibold text-accent-primary">
				{isEdit ? 'Form Ubah Data Berita' : 'Form Tambah Data Berita'}
			</h2>
		</div>

		<form
			method="POST"
			bind:this={formElement}
			action={actionUrl}
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit
								? 'Data berita berhasil diperbarui.'
								: 'Data berita berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update({ reset: !isEdit });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal memproses data.'
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
				<div class="rounded-md bg-status-error p-3 text-sm text-text-main">
					{form.error}
				</div>
			{/if}

			<!-- Judul Berita -->
			<div class="space-y-2">
				<label for="title" class="block text-sm font-medium text-text-muted">
					Judul Berita <span class="text-status-error">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					required
					placeholder="Masukkan judul berita"
					class="w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-main transition-colors focus:border-accent-primary focus:outline-none"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<label for="imageUrl" class="block text-sm font-medium text-text-muted">
						Foto Berita
					</label>

					<input type="hidden" id="imageUrl" name="imageUrl" value={imageUrl} />

					{#if imageUrl}
						<div
							class="relative overflow-hidden rounded-md border border-border-light bg-bg-primary p-2"
						>
							<img src={imageUrl} alt="Pratinjau Foto" class="h-36 w-full rounded object-cover" />
							<div class="mt-2 flex items-center justify-between">
								<span class="max-w-xs truncate text-xs text-text-muted">
									{imageUrl}
								</span>
								<button
									type="button"
									onclick={removeImage}
									class="rounded bg-status-error/20 px-2 py-1 text-xs text-status-error hover:bg-status-error/30"
								>
									<Trash2 class="h-3.5 w-3.5" />
									{#if isDeletingPhoto}
										<LoaderCircle class="h-4 w-4 animate-spin" />
									{:else}
										<span>Hapus Foto</span>
									{/if}
								</button>
							</div>
						</div>
					{:else}
						<!-- Widget Tombol Upload Cloudinary -->
						<CldUploadWidget
							config={getUploadConfig()}
							options={getUploadOptions(folder_cloudinary_admin_article_berita)}
							uploadPreset={upload_cloudinary_preset}
							onUpload={handleUpload}
							let:open
						>
							<button
								type="button"
								onclick={() => open()}
								class="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border-light bg-bg-primary px-4 py-8 text-sm text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<span>Pilih dan Unggah Gambar</span>
							</button>
						</CldUploadWidget>
					{/if}
				</div>

				<!-- Select Kategori -->
				<div class="space-y-2">
					<label for="category" class="block text-sm font-medium text-text-muted">
						Kategori Berita <span class="text-status-error">*</span>
					</label>
					<select
						id="category"
						name="category"
						bind:value={selectedCategory}
						required
						class="w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-main transition-colors focus:border-accent-primary focus:outline-none"
					>
						<option value="" disabled selected>Pilih Kategori . . .</option>
						{#each categoriesList as cat}
							<option value={cat.id.toString()}>{cat.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Isi Berita -->
			<div class="space-y-2">
				<label for="content" class="block text-sm font-medium text-text-muted">
					Isi Berita <span class="text-status-error">*</span>
				</label>
				<input type="hidden" name="content" value={content} />

				<FormEditor
					onSave={handleParentSubmit}
					bind:value={content}
					label={'Isi Berita'}
					showSaveButton={false}
				/>
				<!-- <div class="overflow-hidden rounded-md border border-border-light bg-bg-primary"> -->
				<!-- 	<div -->
				<!-- 		class="flex flex-wrap gap-2 border-b border-border-light bg-bg-primary-glare p-2 text-sm text-text-muted" -->
				<!-- 	> -->
				<!-- 		<span -->
				<!-- 			class="cursor-pointer rounded border border-border-light bg-bg-secondary px-2 py-1" -->
				<!-- 		> -->
				<!-- 			Paragraph ▾ -->
				<!-- 		</span> -->
				<!-- 		<button type="button" class="px-2 py-1 font-bold hover:text-text-main">B</button> -->
				<!-- 		<button type="button" class="px-2 py-1 italic hover:text-text-main">I</button> -->
				<!-- 		<button type="button" class="px-2 py-1 hover:text-text-main">🔗</button> -->
				<!-- 		<button type="button" class="px-2 py-1 hover:text-text-main">≡</button> -->
				<!-- 		<button type="button" class="px-2 py-1 hover:text-text-main">🖼</button> -->
				<!-- 		<button type="button" class="px-2 py-1 hover:text-text-main">“ ”</button> -->
				<!-- 		<button type="button" class="px-2 py-1 hover:text-text-main">📊 ▾</button> -->
				<!-- 	</div> -->
				<!---->
				<!-- 	<textarea -->
				<!-- 		id="content" -->
				<!-- 		name="content" -->
				<!-- 		rows="8" -->
				<!-- 		bind:value={content} -->
				<!-- 		placeholder="Masukkan Deskripsi/Isi Berita" -->
				<!-- 		required -->
				<!-- 		class="w-full resize-y border-none bg-bg-primary p-3 text-sm text-text-main focus:outline-none" -->
				<!-- 	></textarea> -->
				<!-- </div> -->
			</div>

			<!-- Tombol Submit Kirim -->
			<div>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center justify-center rounded-md bg-accent-primary p-3 text-text-dark shadow-sm transition-colors hover:bg-accent-primary-hover disabled:opacity-50"
				>
					{#if isSubmitting}
						<span class="text-sm font-medium">Memproses...</span>
					{:else}
						<svg
							class="-mt-1 h-5 w-5 rotate-45 transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
