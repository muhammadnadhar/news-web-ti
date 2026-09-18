<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { CldUploadButton, CldUploadWidget } from 'svelte-cloudinary';

	import {
		ArrowLeft,
		Upload,
		Image as ImageIcon,
		LayoutDashboard,
		Trash2,
		AlertCircle
	} from 'lucide-svelte';
	import Message from '$lib/components/admin/message.svelte';
	import {
		folder_cloudinary_admin_home_profilDashboard,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client.js';

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
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Top Bar / Navigation -->
	<div class="flex items-center gap-4">
		<!-- <button -->
		<!-- 	type="button" -->
		<!-- 	onclick={() => goto('/admin/profile-dashboard')} -->
		<!-- 	class="rounded-xl border border-white/10 bg-bg-secondary/40 p-2.5 text-text-muted transition-colors hover:bg-white/10 hover:text-white" -->
		<!-- 	title="Kembali" -->
		<!-- > -->
		<!-- 	<ArrowLeft class="h-5 w-5" /> -->
		<!-- </button> -->
		<div>
			<h1 class="text-pure-white text-xl font-bold md:text-2xl">Tambah Profile Dashboard</h1>
			<p class="text-sm text-text-muted">Tambahkan banner/gambar profile dashboard baru.</p>
		</div>
	</div>

	{#if form?.message}
		<Message type={form.message.type} text={form.message.text} />
	{/if}

	<form
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				isSubmitting = false;
				await update();
			};
		}}
		class="space-y-6 rounded-2xl border border-white/10 bg-bg-secondary/40 p-6 backdrop-blur-md md:p-8"
	>
		<!-- Input Hidden untuk Menyimpan Path Gambar -->
		<input type="hidden" name="image_path" value={imagePath} />

		<!-- Field 1: Judul -->
		<div class="space-y-2">
			<label for="title" class="text-pure-white block text-sm font-semibold">
				Profile Text <span class="text-amber-400">*</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				required
				value={form?.title || ''}
				placeholder="Contoh: Banner Dashboard Utama"
				class="w-full rounded-xl border border-white/10 bg-bg-primary-glare/50 px-4 py-3 text-sm text-text-main placeholder-text-muted focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
			/>
		</div>

		<!-- Field 2: Upload Gambar via svelte-cloudinary -->
		<div class="space-y-2">
			<label class="text-pure-white block text-sm font-semibold">
				Upload Gambar <span class="text-amber-400">*</span>
			</label>

			{#if imagePath}
				<div
					class="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950/60 p-4"
				>
					<img
						src={imagePath}
						alt="Preview Profile Dashboard"
						class="max-h-56 rounded-lg object-contain"
					/>
					<button
						type="button"
						onclick={handleRemoveImage}
						class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
					>
						<Trash2 class="h-3.5 w-3.5" />
						<span>Hapus Gambar</span>
					</button>
				</div>
			{:else}
				<!-- Component Cloudinary Upload Button -->
				<div
					class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-6 text-center transition-all hover:border-amber-500/40"
				>
					<div
						class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"
					>
						<ImageIcon class="h-6 w-6" />
					</div>
					<p class="mb-3 text-xs text-text-muted">Format yang didukung: PNG, JPG, WEBP atau SVG</p>

					<CldUploadButton
						uploadPreset={upload_cloudinary_preset}
						options={getUploadOptions(folder_cloudinary_admin_home_profilDashboard)}
						config={getUploadConfig()}
						onSuccess={handleUploadSuccess}
						class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/10 hover:bg-amber-400"
					>
						<Upload class="h-4 w-4" />
						<span>Unggah Gambar ke Cloudinary</span>
					</CldUploadButton>
					<!-- <CldUploadWidget -->
					<!-- 	uploadPreset={upload_cloudinary_preset} -->
					<!-- 	options={getUploadOptions(folder_cloudinary_admin_home_profilDashboard)} -->
					<!-- 	config={getUploadConfig()} -->
					<!-- 	onSuccess={handleUploadSuccess} -->
					<!-- 	let:open -->
					<!-- 	let:isLoading -->
					<!-- > -->
					<!-- 	<button -->
					<!-- 		type="button" -->
					<!-- 		on:click={() => open()} -->
					<!-- 		disabled={isLoading} -->
					<!-- 		class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/10 hover:bg-amber-400 disabled:opacity-50" -->
					<!-- 	> -->
					<!-- 		<Upload class="h-4 w-4" /> -->
					<!-- 		<span>{isLoading ? 'Memuat Widget...' : 'Unggah Gambar ke Cloudinary'}</span> -->
					<!-- 	</button> -->
					<!-- </CldUploadWidget> -->
				</div>
			{/if}
		</div>

		<!-- Form Action Buttons -->
		<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
			<button
				type="button"
				onclick={() => history.back()}
				class="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:bg-white/10 hover:text-white"
			>
				Batal
			</button>
			<button
				type="submit"
				disabled={isSubmitting || !imagePath}
				class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50"
			>
				<LayoutDashboard class="h-4 w-4" />
				<span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data'}</span>
			</button>
		</div>
	</form>
</div>
