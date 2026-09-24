<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CldUploadButton } from 'svelte-cloudinary';
	import { LayoutDashboard, Trash2, ImageIcon, Upload, ArrowLeft } from 'lucide-svelte';
	import Message from '$lib/components/admin/message.svelte';

	let { data, form } = $props();

	// State Svelte 5
	let title = $state(data.profile?.title || '');
	let imagePath = $state(data.profile?.image_path || '');
	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let showDeleteConfirm = $state(false);

	// Cloudinary Handlers
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			imagePath = result.info.secure_url;
		}
	}

	function handleRemoveImage() {
		imagePath = '';
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Top Bar / Navigation Header -->
	<div class="flex items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={() => history.back()}
				class="border border-border-color bg-bg-secondary p-2.5 text-text-main shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:bg-bg-secondary-hover active:scale-95"
				title="Kembali"
			>
				<ArrowLeft class="h-5 w-5" />
			</button>
			<div>
				<h1 class="text-xl font-bold text-text-main md:text-2xl">Edit Profile Dashboard</h1>
				<p class="text-sm text-text-muted">Perbarui atau hapus banner/gambar profile dashboard.</p>
			</div>
		</div>

		<!-- Tombol Trigger Modal Hapus -->
		<button
			type="button"
			onclick={() => (showDeleteConfirm = true)}
			class="inline-flex items-center gap-2 border border-status-error/40 bg-status-error/10 px-4 py-2.5 text-sm font-bold text-status-error shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:bg-status-error/20 active:scale-95"
		>
			<Trash2 class="h-4 w-4" />
			<span class="hidden sm:inline">Hapus Data</span>
		</button>
	</div>

	{#if form?.message}
		<Message type={form.message.type} text={form.message.text} />
	{/if}

	<!-- Form Update Container 3D Neobrutalist -->
	<form
		method="POST"
		action="?/update"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				isSubmitting = false;
				await update();
			};
		}}
		class="space-y-6 border border-border-color bg-bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] md:p-8"
	>
		<!-- Input Hidden untuk Path Gambar -->
		<input type="hidden" name="image_path" value={imagePath} />

		<!-- Field 1: Profile Text -->
		<div class="space-y-2">
			<label for="title" class="block text-sm font-bold text-text-main">
				Profile Text <span class="text-status-error">*</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				required
				bind:value={title}
				placeholder="Contoh: Banner Dashboard Utama"
				class="w-full border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-main transition-all placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
			/>
		</div>

		<!-- Field 2: Upload Gambar via Cloudinary -->
		<div class="space-y-2">
			<label class="block text-sm font-bold text-text-main">
				Upload Gambar <span class="text-status-error">*</span>
			</label>

			{#if imagePath}
				<!-- Pratinjau Gambar 3D -->
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
						<span>Ganti Gambar</span>
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
						uploadPreset="preset_anda"
						options={{ maxFiles: 1 }}
						onSuccess={handleUploadSuccess}
						class="inline-flex items-center gap-2 border border-border-color bg-accent-primary px-4 py-2 text-xs font-bold text-text-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95"
					>
						<Upload class="h-4 w-4" />
						<span>Unggah Gambar Baru</span>
					</CldUploadButton>
				</div>
			{/if}
		</div>

		<!-- Action Buttons -->
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
				<span>{isSubmitting ? 'Menyimpan...' : 'Perbarui Data'}</span>
			</button>
		</div>
	</form>
</div>

<!-- Modal Konfirmasi Hapus Data (3D Neobrutalist) -->
{#if showDeleteConfirm}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 p-4 backdrop-blur-sm"
	>
		<div
			class="w-full max-w-md space-y-4 border border-border-color bg-bg-secondary p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
		>
			<div class="flex items-center gap-3 text-status-error">
				<div class="border border-status-error/30 bg-status-error/10 p-2">
					<Trash2 class="h-6 w-6" />
				</div>
				<h3 class="text-lg font-bold text-text-main">Konfirmasi Hapus</h3>
			</div>

			<p class="text-sm leading-relaxed text-text-muted">
				Apakah Anda yakin ingin menghapus profile dashboard <strong class="text-text-main"
					>"{data.profile?.title}"</strong
				>? Tindakan ini tidak dapat dibatalkan.
			</p>

			<div class="flex items-center justify-end gap-3 pt-2">
				<button
					type="button"
					onclick={() => (showDeleteConfirm = false)}
					disabled={isDeleting}
					class="border border-border-color bg-bg-primary px-4 py-2 text-xs font-bold text-text-main transition-all hover:bg-bg-secondary-hover active:scale-95"
				>
					Batal
				</button>

				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						isDeleting = true;
						return async ({ update }) => {
							isDeleting = false;
							await update();
						};
					}}
				>
					<button
						type="submit"
						disabled={isDeleting}
						class="inline-flex items-center gap-1.5 border border-border-color bg-status-error px-4 py-2 text-xs font-bold text-text-main shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
					>
						<Trash2 class="h-3.5 w-3.5" />
						<span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
