<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message, { type MessageStatus } from '$lib/components/notif/message.svelte';
	import {
		folder_cloudinary_admin_article_akademik,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import { UploadCloud, Save, Plus, ImageIcon, X, Trash2, LoaderCircleIcon } from 'lucide-svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import type { ModulPraktikumFormValues } from '$lib/types/values/admin/article';
	import { beforeNavigate } from '$app/navigation';
	import AlertModal from '$lib/components/notif/alertModal.svelte';

	interface Props {
		valuesData?: Partial<ModulPraktikumFormValues> | null;
		formError?: string | null;
		isEditMode?: boolean;
		submitLabel?: string;
		onCancel?: () => void;
		action?: string;
		isModalAlert?: boolean;
	}

	let {
		valuesData = null,
		formError = null,
		isEditMode = false,
		submitLabel,
		isModalAlert = false,
		onCancel,
		action
	}: Props = $props();

	// State Lokal Svelte 5 Runes
	let title = $derived(valuesData?.title ?? '');
	let imageUrl = $derived(valuesData?.image_url ?? '');
	let description = $derived(valuesData?.description ?? '');
	let photoPublicId = $derived(valuesData?.image_public_id ?? '');
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let isAlern = $state(false);
	let isSuccesAlert = $state(false);

	let isDeletingPhoto = $state(false);

	function triggerMessage(status: MessageStatus, titleStr: string, messageStr: string) {
		messageConfig = { status, title: titleStr, message: messageStr };
		showMessage = true;
	}

	// Sinkronisasi data saat prop valuesData berubah
	$effect(() => {
		if (valuesData) {
			title = valuesData.title ?? '';
			imageUrl = valuesData.image_url ?? '';
			description = valuesData.description ?? '';
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

	// Handler Upload Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url && result?.info?.public_id) {
			imageUrl = result.info.secure_url;
			photoPublicId = result.info.public_id;
		}
		// Kembalikan kemampuan scroll pada document body
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'auto';
		}
	}

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
				body: formData,
				headers: {
					'x-sveltekit-action': 'true' // Penting agar SvelteKit tahu ini request form action manual
				}
			});
			const result = await response.json();
			if (response.ok && result.type === 'success') {
				imageUrl = '';
				photoPublicId = '';
				triggerMessage('success', 'Berhasil', 'Foto sampul berhasil dihapus.');
			} else {
				triggerMessage(
					'error',
					'Gagal',
					result.data?.message || 'Gagal menghapus gambar dari Cloudinary'
				);
			}
		} catch (err) {
			console.error('Error deleting photo:', err);
		} finally {
			isDeletingPhoto = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
	<header class="mb-6 space-y-1">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">
			{isEditMode ? 'Edit Modul Praktikum' : 'Tambah Modul Praktikum Baru'}
		</h1>
		<p class="text-sm text-text-muted">
			Kelola judul, foto sampul, dan rincian modul praktikum akademik.
		</p>
	</header>

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

	{#if formError}
		<div class="mb-6">
			<Message status="error" title="Gagal" message={formError} dismissible={true} />
		</div>
	{/if}

	<div class="border border-border-light bg-bg-secondary">
		<form
			method="POST"
			{action}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						triggerMessage(
							'success',
							(result.data?.title as string) || 'Berhasil',
							(result.data?.message as string) || 'Data modul praktikum berhasil disimpan.'
						);

						if (!isEditMode) {
							title = '';
							imageUrl = '';
							description = '';
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'redirect') {
						await update();
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							(result.data.message as string) || 'Terjadi kesalahan saat memproses data.'
						);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
						await update();
					}
				};
			}}
			class="space-y-6 p-6 sm:p-8"
		>
			<div class="space-y-2">
				<label for="title" class="block text-sm font-bold text-text-main">
					Judul Modul Praktikum <span class="text-status-error">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					placeholder="Contoh: Modul Praktikum Pemrograman Web Semester Ganjil 2026/2027"
					required
					class="w-full border border-border-light bg-bg-primary px-4 py-2.5 text-sm text-text-main transition duration-150 placeholder:text-text-muted focus:border-accent-purple focus:outline-none"
				/>
			</div>

			<!-- Field: Upload Foto Sampul dengan Cloudinary -->
			<div class="space-y-2">
				<label for="image_upload" class="block text-sm font-bold text-text-main">
					Foto Sampul / Gambar Pendukung Modul
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />
				<input type="hidden" name="image_public_id" value={photoPublicId} />

				{#if imageUrl}
					<div
						class="relative w-full max-w-md overflow-hidden border border-border-light bg-bg-primary p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
					>
						<img
							src={imageUrl}
							alt="Preview Sampul Modul"
							class="h-52 w-full border border-border-light object-cover"
						/>
						<button
							type="button"
							onclick={removeImage}
							class="mt-2 inline-flex w-full items-center justify-center gap-1.5 border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs font-bold text-status-error transition hover:bg-status-error/20"
						>
							<Trash2 class="h-4 w-4" />
							{#if isDeletingPhoto}
								<LoaderCircleIcon class="h-4 w-4 animate-spin" />
							{:else}
								<span>Hapus Foto</span>
							{/if}
						</button>
					</div>
				{:else}
					<CldUploadWidget
						config={getUploadConfig()}
						options={getUploadOptions(folder_cloudinary_admin_article_akademik)}
						uploadPreset={upload_cloudinary_preset}
						onSuccess={handleUploadSuccess}
						let:open
					>
						<button
							type="button"
							onclick={() => open()}
							class="flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border-light bg-bg-primary px-6 py-8 text-center transition hover:bg-bg-primary-glare"
						>
							<div
								class="mb-2 border border-border-light bg-bg-secondary p-3 text-accent-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
							>
								<UploadCloud class="h-6 w-6" />
							</div>
							<span class="text-sm font-bold text-accent-purple"> Unggah Foto Sampul Modul </span>
							<span class="mt-1 text-xs text-text-muted">Format gambar (PNG, JPG, WEBP)</span>
						</button>
					</CldUploadWidget>
				{/if}
			</div>

			<!-- Field: Deskripsi Modul Menggunakan FormEditor -->
			<div class="space-y-2">
				<!-- Hidden Input untuk dikirim ke Form Action SvelteKit -->
				<input type="hidden" name="description" value={description} />

				<FormEditor
					title="Editor Modul Praktikum"
					label="Deskripsi / Rincian Tabel Modul Praktikum"
					bind:value={description}
					showSaveButton={false}
				/>
			</div>

			<div class="flex items-center justify-end gap-3 border-t border-border-light pt-6">
				<button
					type="button"
					onclick={onCancel ?? (() => history.back())}
					disabled={isSubmitting}
					class="border border-border-light bg-bg-primary px-5 py-2.5 text-sm font-semibold text-text-main transition hover:bg-bg-secondary-hover disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center justify-center gap-1.5 border border-border-light bg-accent-primary px-5 py-2.5 text-sm font-bold text-text-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition hover:bg-accent-primary-hover active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<span class="inline-block animate-pulse">Menyimpan...</span>
					{:else if isEditMode}
						<Save class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Perubahan'}</span>
					{:else}
						<Plus class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Modul Praktikum'}</span>
					{/if}
				</button>
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
