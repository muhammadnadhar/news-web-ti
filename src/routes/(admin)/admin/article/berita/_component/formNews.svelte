<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		folder_cloudinary_admin_article_berita,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import type { ResponseMessage } from '$lib/types/message';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import { LoaderCircle, Trash2 } from 'lucide-svelte';
	import type { NewsItemDTO } from '$lib/dto/admin/article/berita';
	import type { NewsFormValues } from '$lib/types/values/admin/article';
	import Message from '$lib/components/notif/message.svelte';
	import AlertModal from '$lib/components/notif/alertModal.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { formatDateTimeLocal } from '$lib/utils';

	interface Props {
		form?: any;
		initialData: NewsItemDTO;
		valuesData?: NewsFormValues;
		isEdit?: boolean;
		isModalAlert?: boolean;
		actionUrl?: string;
	}

	let {
		form,
		initialData,
		isModalAlert = false,
		valuesData,
		isEdit = false,
		actionUrl
	}: Props = $props();

	// Inisialisasi state dari valuesData -> initialData -> default ('')
	let title = $derived(valuesData?.title ?? initialData?.title ?? '');
	let selectedCategory = $derived(valuesData?.category ?? initialData?.category_id ?? '');
	let content = $derived(valuesData?.content ?? initialData?.content ?? '');
	let imageUrl = $derived(valuesData?.image_url ?? initialData?.image_url ?? '');
	let image_public_id = $derived(valuesData?.imageId ?? initialData?.image_public_id ?? '');
	let publishedAt = $derived(
		formatDateTimeLocal(
			(valuesData?.publishedAt ?? initialData?.published_at)
				? new Date(initialData.published_at)
				: new Date()
		)
	);

	let isSubmitting = $state(false);
	let isAlern = $state(false);
	let isSuccesAlert = $state(false);

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
			selectedCategory = initialData.category_id ?? '';
			content = initialData.content ?? '';
			imageUrl = initialData.image_url ?? '';
		}
	});

	const handleCloseModalAlernt = () => {
		isAlern = false;
	};
	const handleErrorClose = () => {
		isSuccesAlert = false;
		isAlern = false;
		triggerMessage('info', 'Ada Kesalahan', ' Silahkan Batalkan upload / hapus di cloudinary');
	};

	const handleSuccesAlernt = async () => {
		isSuccesAlert = true;

		console.info('Succes close trigger');
		try {
			await removeImage();
			imageUrl = '';

			triggerMessage('success', 'Berhasil', 'Gambar berhasil dibersihkan.');
		} catch (error) {
			console.error('Gagal membersihkan gambar:', error);
			triggerMessage('error', 'Gagal', 'Terjadi kesalahan saat membersihkan gambar.');
		} finally {
			isAlern = false; // Pastikan modal tertutup
		}
	};

	// Intersepsi navigasi sebelum terjadi
	beforeNavigate((navigation) => {
		if (!isModalAlert) return;

		// Cek apakah target URL berbeda dengan URL saat ini
		const isDifferentUrl = navigation.to?.url.pathname !== navigation.from?.url.pathname;

		if (!isSuccesAlert && isDifferentUrl && imageUrl !== '' && imageUrl.length > 0) {
			// Batalkan perpindahan halaman
			navigation.cancel();

			// Tampilkan alert pemberitahuan
			isAlern = true;
			isSuccesAlert = false;
		}
	});

	// Handler saat unggah ke Cloudinary berhasil
	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imageUrl = result.info.secure_url;
			image_public_id = result.info.public_id; //  Ambil & simpan Public ID dari response Cloudinary
		}

		// Kembalikan fungsi scroll pada document body
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
			// atau document.body.style.removeProperty('overflow');
		}
	}

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
		if (!image_public_id) {
			imageUrl = '';

			triggerMessage(
				'error',
				'Terjaidi Kesalahan Id image tidak ada , silahkan hapus manual di cloudinary',
				'Kesalahan'
			);
			return;
		}

		isDeletingPhoto = true;

		try {
			const formData = new FormData();
			formData.append('public_id', image_public_id);

			// Panggil named action '?/deletePhoto'
			const response = await fetch(`?/deletePhoto`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				imageUrl = '';
				image_public_id = '';
				triggerMessage('success', 'Berhasil', 'Berhasil mengahpus data dari Cloudinary');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus gambar dari cloudinary');
			}
		} catch (err) {
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

			<!-- Tanggal Publikasi -->
			<div class="space-y-2">
				<label for="published_at" class="block text-sm font-medium text-text-muted">
					Tanggal & Waktu Publikasi
				</label>
				<input
					type="datetime-local"
					id="published_at"
					name="published_at"
					bind:value={publishedAt}
					class="w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-main transition-colors focus:border-accent-primary focus:outline-none"
				/>
				<span class="text-xs text-text-muted">
					Biarkan atau ubah sesuai keinginan. Jika kosong/default akan menggunakan waktu saat ini.
				</span>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<label for="imageUrl" class="block text-sm font-medium text-text-muted">
						Foto Berita
					</label>

					<input type="hidden" id="imageUrl" name="imageUrl" value={imageUrl} />

					<input type="hidden" name="image_public_id" value={image_public_id} />

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
			</div>

			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>
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
			</div>
		</form>
	</div>
</div>

<!-- Modla peringatan jika image sudha di upload  -->
{#if isModalAlert}
	<AlertModal
		isOpen={isAlern}
		title="Peringatan Gambar Upload"
		subtitle="Hapus Gambar Sebelumnya atau manual di Cloudinary"
		variant="warning"
		confirmText="Hapus Gambar"
		onClose={handleCloseModalAlernt}
		onSuccess={() => {
			handleSuccesAlernt();
		}}
		onError={() => {
			handleErrorClose();
		}}
	/>
{/if}
