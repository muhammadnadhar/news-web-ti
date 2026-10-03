<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		User,
		CreditCard,
		BookOpen,
		Link as LinkIcon,
		X,
		UserCheck,
		Send,
		BriefcaseIcon,
		ChevronDownIcon,
		LoaderCircleIcon,
		Edit2Icon,
		UploadCloudIcon
	} from 'lucide-svelte';
	import {
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import type { LecturerStaffItemDTO } from '$lib/dto/admin/article/profile';
	import type { LecturerStaffFormValues } from '$lib/types/values/admin/article';

	interface Props {
		isEdit?: boolean;
		actionUrl?: string;
		initialData?: LecturerStaffItemDTO;
		valuesData: LecturerStaffFormValues;
	}

	let { isEdit = false, actionUrl, initialData, valuesData }: Props = $props();

	// Tentukan Action URL otomatis jika tidak dikirim lewat props
	const targetAction = $derived(actionUrl ?? (isEdit ? '?/update' : '?/create'));

	// Initial State menggunakan Runes Svelte 5
	let name = $state(initialData?.name ?? valuesData?.name ?? '');
	let nidn = $state(initialData?.nidn ?? valuesData?.nidn ?? '');
	let expertise = $state(initialData?.expertise ?? valuesData?.expertise ?? '');
	let pddiktiUrl = $state(initialData?.pddikti_url ?? valuesData?.pddikti_url ?? '');
	let photoUrl = $state(initialData?.photo_url ?? valuesData?.photo_url ?? '');
	let publicId = $state(initialData?.photo_public_id ?? valuesData?.photo_public_id ?? '');
	let category = $state(initialData?.role ?? valuesData?.category ?? 'dosen');

	let isSubmitting = $state(false);
	let isDeletingPhoto = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	// Sinkronisasi jika initialData diperbarui secara asinkron
	$effect(() => {
		if (initialData) {
			name = initialData.name ?? name;
			nidn = initialData.nidn ?? nidn;
			expertise = initialData.expertise ?? expertise;
			pddiktiUrl = initialData.pddikti_url ?? pddiktiUrl;
			photoUrl = initialData.photo_url ?? photoUrl;
			publicId = initialData.photo_public_id ?? publicId;
			category = initialData.role ?? 'dosen';
		}
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			photoUrl = result.info.secure_url;
			publicId = result.info.public_id;
		}
	}

	async function removePhoto() {
		if (!publicId) {
			photoUrl = '';
			return;
		}

		isDeletingPhoto = true;
		try {
			const formData = new FormData();
			formData.append('public_id', publicId);

			const res = await fetch('?/deletePhoto', {
				method: 'POST',
				body: formData,
				headers: {
					'x-sveltekit-action': 'true'
				}
			});

			if (res.ok) {
				photoUrl = '';
				publicId = '';
				triggerMessage('success', 'Berhasil', 'Foto berhasil dihapus.');
			} else {
				triggerMessage('error', 'Gagal', 'Gagal menghapus foto dari Cloudinary.');
			}
		} catch (error) {
			triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat menghapus foto.');
		} finally {
			isDeletingPhoto = false;
		}
	}
</script>

<!-- Notification Message -->
{#if showMessage}
	<div class="mb-4 transition-all duration-300">
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

<!-- Card Form Container -->
<div class="overflow-hidden rounded-2xl border border-border-light bg-bg-secondary shadow-lg">
	<!-- Header Card -->
	<div class="border-b border-border-light bg-bg-primary-glare px-6 py-4">
		<h2 class="flex items-center gap-2 text-base font-semibold text-accent-primary">
			{#if isEdit}
				<Edit2Icon class="h-5 w-5" />
				<span>Edit Data Dosen & Staff</span>
			{:else}
				<UserCheck class="h-5 w-5" />
				<span>Form Tambah Data Dosen & Staff</span>
			{/if}
		</h2>
	</div>

	<!-- Form -->
	<form
		method="POST"
		action={targetAction}
		use:enhance={() => {
			isSubmitting = true;
			showMessage = false;

			return async ({ result, update }) => {
				isSubmitting = false;

				if (result.type === 'success') {
					const data = result.data;

					if (!data || data.status === 'success' || data.success) {
						triggerMessage(
							'success',
							(data?.title as string) || 'Berhasil',
							(data?.message as string) ||
								(isEdit ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!')
						);

						if (!isEdit) {
							name = '';
							nidn = '';
							expertise = '';
							pddiktiUrl = '';
							photoUrl = '';
							publicId = '';
							category = 'dosen';
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else {
						triggerMessage(
							'error',
							(data?.title as string) || 'Gagal Menyimpan',
							(data?.message as string) || 'Terjadi kesalahan.'
						);
						await update({ reset: false });
					}
				} else if (result.type === 'failure' && result.data) {
					const data = result.data;
					triggerMessage(
						'error',
						(data.title as string) || 'Gagal Menyimpan',
						(data.message as string) || 'Terjadi kesalahan saat memproses data.'
					);
					await update({ reset: false });
				} else {
					triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi/sistem.');
					await update({ reset: false });
				}
			};
		}}
		class="space-y-6 p-6"
	>
		<!-- Hidden Inputs -->
		{#if isEdit && initialData?.id}
			<input type="hidden" name="id" value={initialData.id} />
		{/if}
		<input type="hidden" name="photo_url" value={photoUrl} />
		<input type="hidden" name="public_id" value={publicId} />

		<!-- Grid Utama -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Upload Foto -->
			<div class="space-y-2 md:col-span-1">
				<label class="block text-xs font-bold tracking-wider text-text-muted uppercase">
					Foto Profil
				</label>

				<div
					class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light bg-bg-primary p-5 text-center"
				>
					{#if photoUrl}
						<!-- Pembungkus Posisi Utama -->
						<div class="relative inline-block">
							<!-- Container Gambar (overflow-hidden hanya untuk foto saja) -->
							<div
								class="h-36 w-36 overflow-hidden rounded-full border-2 border-accent-primary shadow-md"
							>
								<img src={photoUrl} alt="Preview Foto Profil" class="h-full w-full object-cover" />
							</div>

							<!-- Tombol Batal/Hapus Foto di Luar Lingkaran Gambar -->
							<button
								type="button"
								onclick={removePhoto}
								disabled={isDeletingPhoto}
								class="absolute -top-1 -right-1 z-20 rounded-full bg-red-600 p-1.5 text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
								title="Hapus Foto"
							>
								{#if isDeletingPhoto}
									<LoaderCircleIcon class="h-3.5 w-3.5 animate-spin" />
								{:else}
									<X class="h-3.5 w-3.5" />
								{/if}
							</button>
						</div>
						<p class="mt-3 max-w-[180px] truncate text-[11px] text-text-muted">
							{photoUrl}
						</p>
					{:else}
						<div
							class="mb-3 flex h-28 w-28 items-center justify-center rounded-full border border-border-light bg-bg-secondary text-text-muted"
						>
							<User class="h-14 w-14 opacity-40" />
						</div>

						<CldUploadWidget
							config={getUploadConfig()}
							uploadPreset={upload_cloudinary_preset}
							options={getUploadOptions(folder_cloudinary_admin_article_profil)}
							onUpload={handleUpload}
							let:open
						>
							<button
								type="button"
								onclick={() => open()}
								class="inline-flex items-center gap-2 rounded-xl border border-border-light bg-bg-secondary px-3.5 py-2 text-xs font-semibold text-accent-primary shadow-sm transition-all hover:bg-border-light active:scale-95"
							>
								<UploadCloudIcon class="h-4 w-4" />
								<span>Unggah Foto</span>
							</button>
						</CldUploadWidget>
					{/if}
				</div>
			</div>

			<!-- Input Form Details -->
			<div class="space-y-4 md:col-span-2">
				<div class="space-y-1.5">
					<label for="name" class="block text-xs font-medium text-text-muted">
						Nama Lengkap & Gelar <span class="text-red-500">*</span>
					</label>
					<div class="relative">
						<input
							type="text"
							id="name"
							name="name"
							bind:value={name}
							required
							placeholder="Contoh: Dr. Nama Dosen S.Kom., M.Sc"
							class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pr-3 pl-10 text-xs text-text-main placeholder-text-muted transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
						/>
						<User class="absolute top-3 left-3 h-4 w-4 text-text-muted" />
					</div>
				</div>

				<div class="space-y-1.5">
					<label for="nidn" class="block text-xs font-medium text-text-muted">
						NIDN / NIP
						<span class="text-[10px] text-text-muted"> (Isi "-" jika Staff Administrasi) </span>
					</label>
					<div class="relative">
						<input
							type="text"
							id="nidn"
							name="nidn"
							bind:value={nidn}
							placeholder="Contoh: 0415088901"
							class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pr-3 pl-10 text-xs text-text-main placeholder-text-muted transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
						/>
						<CreditCard class="absolute top-3 left-3 h-4 w-4 text-text-muted" />
					</div>
				</div>

				<!-- Bidang Keahlian / Tugas -->
				<div class="space-y-1.5">
					<label for="expertise" class="block text-xs font-medium text-text-muted">
						Bidang Keahlian / Tugas <span class="text-red-500">*</span>
					</label>
					<div class="relative">
						<input
							type="text"
							id="expertise"
							name="expertise"
							bind:value={expertise}
							required
							placeholder="Contoh: Keamanan Siber / Staff Administrasi"
							class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pr-3 pl-10 text-xs text-text-main placeholder-text-muted transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
						/>
						<BookOpen class="absolute top-3 left-3 h-4 w-4 text-text-muted" />
					</div>
				</div>

				<!-- Link PDDikti -->
				<div class="space-y-1.5">
					<label for="pddikti_url" class="block text-xs font-medium text-text-muted">
						Link PDDikti / DDT
						<span class="text-[10px] text-text-muted">(Opsional)</span>
					</label>
					<div class="relative">
						<input
							type="url"
							id="pddikti_url"
							name="pddikti_url"
							bind:value={pddiktiUrl}
							placeholder="https://pddikti.kemdiktisaintek.go.id/..."
							class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pr-3 pl-10 text-xs text-text-main placeholder-text-muted transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
						/>
						<LinkIcon class="absolute top-3 left-3 h-4 w-4 text-text-muted" />
					</div>
				</div>
			</div>
		</div>

		<!-- Pilihan Kategori -->
		<div class="space-y-1.5">
			<label for="category" class="block text-xs font-medium text-text-muted">
				Kategori Kepegawaian <span class="text-red-500">*</span>
			</label>
			<div class="relative">
				<select
					id="category"
					name="category"
					bind:value={category}
					required
					class="w-full appearance-none rounded-xl border border-border-light bg-bg-primary py-2.5 pr-10 pl-10 text-xs text-text-main transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
				>
					<option value="dosen">Dosen</option>
					<option value="staff">Staff Administrasi / Umum</option>
				</select>
				<BriefcaseIcon class="absolute top-3 left-3 h-4 w-4 text-text-muted" />
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted"
				>
					<ChevronDownIcon class="h-4 w-4" />
				</div>
			</div>
		</div>

		<!-- Tombol Aksi -->
		<div class="flex justify-end gap-2 border-t border-border-light pt-4">
			<button
				type="button"
				onclick={() => history.back()}
				class="inline-flex items-center gap-2 rounded-xl border border-border-light bg-bg-primary px-5 py-2.5 text-xs font-semibold text-text-main transition-all hover:bg-border-light active:scale-95 disabled:opacity-50"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={isSubmitting || isDeletingPhoto}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-5 py-2.5 text-xs font-bold text-text-main shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
			>
				{#if isSubmitting}
					<LoaderCircleIcon class="h-4 w-4 animate-spin" />
					<span>Memproses...</span>
				{:else}
					<Send class="h-4 w-4" />
					<span>{isEdit ? 'Perbarui Data' : 'Simpan Data'}</span>
				{/if}
			</button>
		</div>
	</form>
</div>
