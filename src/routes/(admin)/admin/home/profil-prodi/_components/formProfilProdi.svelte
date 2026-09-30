<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import Message from '$lib/components/admin/message.svelte';
	import type { ActionData } from '.././$types';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		Building2,
		ImagePlus,
		Trash2,
		Save,
		Loader2Icon,
		FileText,
		UploadCloud,
		BookDashedIcon,
		LoaderCircle,
		SlidersHorizontal,
		Check,
		Tag
	} from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import {
		upload_cloudinary_preset,
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions
	} from '$lib/cloudinary/client';
	import type { ProfilProdiItemDTO, ImageItem } from '$lib/dto/admin/home';
	import type { DisplayInstructionType } from '$lib/types/home';
	import { getInstructionOptions } from '$lib/data/home';

	let {
		isEdit = false,
		actionUrl = isEdit ? '?/update' : '?/create',
		initialData = null,
		form = null
	}: {
		isEdit?: boolean;
		actionUrl?: string;
		initialData?: ProfilProdiItemDTO | null;
		form?: ActionData | null;
	} = $props();

	// Inisialisasi state judul & deskripsi
	let title = $state(form?.values?.title ?? initialData?.title ?? '');
	let description = $state(form?.values?.description ?? initialData?.description ?? '');

	// Helper untuk mengekstrak nama asli file dari Cloudinary public_id atau URL
	function extractOriginalName(publicId?: string | null, url?: string | null): string {
		if (publicId) {
			const parts = publicId.split('/');
			return parts[parts.length - 1] || 'gambar';
		}
		if (url) {
			const urlParts = url.split('/');
			const fileName = urlParts[urlParts.length - 1];
			return fileName ? fileName.split('.')[0] : 'gambar';
		}
		return 'gambar';
	}

	// Mengambil data awal array gambar
	let rawImages = form?.values?.images
		? typeof form.values.images === 'string'
			? JSON.parse(form.values.images)
			: form.values.images
		: (initialData?.images ?? []);

	// State Array Gambar (ImageItem[]) dengan pengisian caption default jika belum diisi
	let images = $state<ImageItem[]>(
		rawImages.map((img: ImageItem) => ({
			...img,
			caption: img.caption || extractOriginalName(img.public_id, img.url)
		}))
	);

	let editorRef = $state<any>(null);
	let isSubmitting = $state(false);
	let deletingIndex = $state<number | null>(null);

	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	// State untuk menyimpan tipe instruksi yang dipilih
	let displayInstruction = $state<DisplayInstructionType | string>(
		initialData?.display_instruction || 'FLEX_CENTER'
	);

	// Ambil 7 daftar opsi dari helper
	const instructionOptions = getInstructionOptions();

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Callback saat berhasil upload gambar dari Cloudinary
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			// Ambil nama asli dari original_filename Cloudinary atau fallback dari public_id / URL
			const defaultCaption =
				result.info.original_filename ||
				extractOriginalName(result.info.public_id, result.info.secure_url);

			const newImage: ImageItem = {
				url: result.info.secure_url,
				public_id: result.info.public_id || null,
				caption: defaultCaption
			};
			images = [...images, newImage];
		}
	}

	// Hapus gambar spesifik berdasarkan index
	async function removePhoto(index: number) {
		const targetImage = images[index];

		if (targetImage?.public_id) {
			deletingIndex = index;
			try {
				const formData = new FormData();
				formData.append('public_id', targetImage.public_id);

				const response = await fetch('?/deletePhoto', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					images = images.filter((_, i) => i !== index);
					triggerMessage('success', 'Berhasil', 'Gambar berhasil dihapus.');
				} else {
					triggerMessage('error', 'Gagal', 'Gagal menghapus gambar dari server.');
				}
			} catch (err) {
				console.error('Error deleting photo:', err);
				triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi saat menghapus gambar.');
			} finally {
				deletingIndex = null;
			}
		} else {
			images = images.filter((_, i) => i !== index);
		}
	}
</script>

<!-- Message Toast -->
{#if showMessage || form?.message}
	<Message
		status={showMessage ? messageConfig.status : 'error'}
		title={showMessage ? messageConfig.title : 'Gagal'}
		message={showMessage ? messageConfig.message : form?.message || ''}
		dismissible={true}
		timeout={5000}
		onclose={() => (showMessage = false)}
	/>
{/if}

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between border-b border-border-color/10 pb-4">
		<div class="flex items-center gap-3">
			<div>
				<div class="flex items-center gap-2">
					<Building2 class="text-scitech-mint h-5 w-5" />
					<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
						{isEdit ? 'Edit Profil Prodi' : 'Tambah Profil Prodi'}
					</h1>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui informasi judul, daftar gambar pendukung, tipe instruksi layout, dan deskripsi profil prodi.'
						: 'Lengkapi informasi judul, daftar gambar pendukung, tipe instruksi layout, dan deskripsi profil prodi.'}
				</p>
			</div>
		</div>
	</div>

	<!-- Form Container -->
	<div
		class="bg-scitech-slate/50 rounded-2xl border border-border-color/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			action={actionUrl}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				if (editorRef?.triggerSave) {
					description = editorRef.triggerSave();
				}

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit
								? 'Profil prodi berhasil diperbarui.'
								: 'Profil prodi berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);

						if (!isEdit) {
							await update({ reset: true });
							images = [];
							description = '';
							title = '';
							displayInstruction = 'FLEX_CENTER';
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal menyimpan data.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem yang tidak diketahui.');
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<!-- Hidden Fields -->
			<input type="hidden" name="images" value={JSON.stringify(images)} />
			<input type="hidden" name="display_instruction" value={displayInstruction} />

			<!-- Field: Judul -->
			<div class="space-y-2">
				<label for="title" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<FileText class="text-scitech-cyan h-4 w-4" />
					<span>Judul Profil Prodi</span>
					<span class="text-red-400">*</span>
				</label>

				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					placeholder="Contoh: Visi dan Misi Program Studi Teknologi Informasi"
					required
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field: Upload Daftar Gambar (Galeri / Dynamic Images) -->
			<div class="space-y-3">
				<label class="flex items-center justify-between text-xs font-semibold text-text-main">
					<div class="flex items-center gap-2">
						<ImagePlus class="text-scitech-cyan h-4 w-4" />
						<span>Daftar Gambar / Poster Pendukung</span>
					</div>
					<span class="text-[11px] font-normal text-text-muted">
						Total: {images.length} Gambar
					</span>
				</label>

				<!-- Grid Preview Gambar Yang Sudah Diunggah -->
				{#if images.length > 0}
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
						{#each images as img, idx}
							{@const fallbackName = extractOriginalName(img.public_id, img.url)}
							<div
								class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-color/10 bg-black/40 p-2"
							>
								<div
									class="relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-black/50"
								>
									<img
										src={img.url}
										alt={img.caption || fallbackName}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<button
										type="button"
										onclick={() => removePhoto(idx)}
										disabled={deletingIndex === idx || isSubmitting}
										class="absolute top-1.5 right-1.5 rounded-lg bg-red-600/80 p-1.5 text-white backdrop-blur-md transition-all hover:bg-red-600 active:scale-95 disabled:opacity-50"
										title="Hapus gambar ini"
									>
										{#if deletingIndex === idx}
											<LoaderCircle class="h-3.5 w-3.5 animate-spin" />
										{:else}
											<Trash2 class="h-3.5 w-3.5" />
										{/if}
									</button>
								</div>

								<!-- Field Input Caption Gambar -->
								<div class="mt-2.5 space-y-1">
									<div class="flex items-center justify-between text-[10px] text-text-muted">
										<span class="text-scitech-mint flex items-center gap-1 font-medium">
											<Tag class="h-3 w-3" /> Caption
										</span>
										<span>#{idx + 1}</span>
									</div>
									<input
										type="text"
										bind:value={images[idx].caption}
										placeholder={fallbackName}
										disabled={isSubmitting}
										class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/30 w-full rounded-lg border border-border-color/10 px-2.5 py-1.5 text-[11px] text-text-main placeholder-text-muted/50 transition-colors focus:ring-1 focus:outline-none disabled:opacity-50"
									/>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Widget Tambah Gambar Cloudinary -->
				<CldUploadWidget
					config={getUploadConfig()}
					options={getUploadOptions(folder_cloudinary_admin_article_profil)}
					uploadPreset={upload_cloudinary_preset}
					onSuccess={handleUploadSuccess}
					let:open
				>
					<button
						type="button"
						onclick={() => open()}
						disabled={isSubmitting}
						class="group hover:border-scitech-mint/50 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-color/10 bg-black/20 p-6 transition-all hover:bg-bg-secondary/5 active:scale-[0.99] disabled:opacity-50"
					>
						<div
							class="text-scitech-mint group-hover:bg-scitech-mint/20 rounded-full bg-bg-secondary/5 p-2.5 transition-all group-hover:scale-110"
						>
							<UploadCloud class="h-5 w-5" />
						</div>
						<div class="text-center">
							<p
								class="group-hover:text-scitech-mint text-xs font-semibold text-text-main transition-colors"
							>
								{images.length > 0 ? '+ Tambah Gambar Lagi' : 'Unggah Gambar Profil'}
							</p>
							<p class="mt-0.5 text-[10px] text-text-muted">
								Format: PNG, JPG, WEBP (Max 5MB via Cloudinary)
							</p>
						</div>
					</button>
				</CldUploadWidget>
			</div>

			<!-- FIELD: Opsi Tipe Instruksi Tampilan (7 Pilihan) -->
			<div class="space-y-3">
				<label class="flex items-center justify-between text-xs font-semibold text-text-main">
					<div class="flex items-center gap-2">
						<SlidersHorizontal class="text-scitech-cyan h-4 w-4" />
						<span>Instruksi Tata Letak / Layout Tampilan</span>
					</div>
					<span class="text-[11px] font-normal text-text-muted">
						Pilih format tata letak yang diinginkan
					</span>
				</label>

				<!-- Grid 7 Kartu Pilihan Layout -->
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each instructionOptions as opt}
						{@const isSelected = displayInstruction === opt.value}
						<button
							type="button"
							disabled={isSubmitting}
							onclick={() => (displayInstruction = opt.value)}
							class="group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] disabled:opacity-50
                            {isSelected
								? 'border-scitech-mint bg-scitech-mint/10 ring-scitech-mint/30 shadow-scitech-mint/5 shadow-lg ring-2'
								: 'bg-scitech-navy/60 hover:border-scitech-mint/40 hover:bg-scitech-navy border-border-color/10'}"
						>
							<!-- Top Bar Kartu: Icon & Badge -->
							<div class="flex items-start justify-between gap-2">
								<div
									class="rounded-lg p-2 transition-colors {isSelected
										? 'bg-scitech-mint text-scitech-navy'
										: 'group-hover:text-scitech-mint bg-bg-secondary/10 text-text-muted'}"
								>
									<opt.icon class="h-4 w-4" />
								</div>

								{#if isSelected}
									<span
										class="border-scitech-mint/30 bg-scitech-mint/20 text-scitech-mint inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
									>
										<Check class="h-3 w-3" /> Dipilih
									</span>
								{:else}
									<span
										class="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-text-muted"
									>
										{opt.badge}
									</span>
								{/if}
							</div>

							<!-- Bottom Bar Kartu: Label & Deskripsi -->
							<div class="mt-4 space-y-1">
								<h4
									class="text-xs font-bold transition-colors {isSelected
										? 'text-scitech-mint'
										: 'group-hover:text-scitech-mint text-text-main'}"
								>
									{opt.label}
								</h4>
								<p class="line-clamp-2 text-[11px] leading-relaxed text-text-muted">
									{opt.description}
								</p>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Field: Deskripsi -->
			<div class="space-y-2">
				<label for="editor" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<BookDashedIcon class="h-4 w-4" />
					<span>Deskripsi / Konten Lengkap Profil Prodi</span>
				</label>

				<input type="hidden" name="description" value={description} />

				<FormEditor
					title="Editor Konten Profil Prodi"
					label="Isi Konten / Penjelasan Profil Prodi"
					bind:this={editorRef}
					showSaveButton={false}
					bind:value={description}
				/>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center justify-end gap-3 border-t border-border-color/10 pt-6">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl border border-border-color/10 bg-bg-secondary/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Perbarui Profil Prodi' : 'Simpan Profil Prodi'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
