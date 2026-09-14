<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import type { ActionData } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	let title = $state(form?.values?.title ?? '');
	let category = $state(form?.values?.category ?? '');
	let content = $state(form?.values?.content ?? '');
	let imageUrl = $state(form?.values?.imageUrl ?? '');
	let isSubmitting = $state(false);

	// Handler saat unggah ke Cloudinary berhasil
	function handleUpload(result: any) {
		if (result?.event === 'success') {
			imageUrl = result.info.secure_url; // Mengambil URL Cloudinary
		}
	}

	// Fungsi untuk mengosongkan gambar jika ingin mengganti
	function removeImage() {
		imageUrl = '';
	}

	// Daftar Kategori sesuai kebutuhan
	const categories = [
		'Berita Mahasiswa',
		'Berita Prodi',
		'Akreditasi',
		'Seminar',
		'HIMA-TI',
		'Webinar'
	];
</script>

<div class="min-h-screen bg-[var(--color-bg-primary)] p-6 text-[var(--color-text-main)]">
	<!-- Header Halaman -->
	<h1 class="mb-6 text-2xl font-semibold text-[var(--color-text-main)]">Berita</h1>

	<!-- Card Form -->
	<div
		class="overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-sm"
	>
		<!-- Header Card -->
		<div
			class="border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] px-6 py-4"
		>
			<h2 class="text-base font-semibold text-[var(--color-accent-primary)]">
				Form Ubah Data Berita
			</h2>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-6 p-6"
		>
			{#if form?.error}
				<div class="rounded-md bg-[var(--color-status-error)] p-3 text-sm text-white">
					{form.error}
				</div>
			{/if}

			<!-- Judul Berita -->
			<div class="space-y-2">
				<label for="title" class="block text-sm font-medium text-[var(--color-text-muted)]">
					Judul Berita <span class="text-[var(--color-status-error)]">*</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					bind:value={title}
					required
					placeholder="Masukkan judul berita"
					class="w-full rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
				/>
			</div>

			<!-- Grid Foto Cloudinary & Kategori Berita -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				
				<!-- Upload Foto Cloudinary -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-[var(--color-text-muted)]">
						Foto Berita
					</label>

					<!-- Hidden input untuk mengirimkan path/URL Cloudinary ke backend server -->
					<input type="hidden" name="imageUrl" value={imageUrl} />

					{#if imageUrl}
						<!-- Tampilan Pratinjau Jika Gambar Sudah Diunggah -->
						<div class="relative overflow-hidden rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] p-2">
							<img
								src={imageUrl}
								alt="Pratinjau Foto"
								class="h-36 w-full rounded object-cover"
							/>
							<div class="mt-2 flex items-center justify-between">
								<span class="max-w-[200px] truncate text-xs text-[var(--color-text-muted)]">
									{imageUrl}
								</span>
								<button
									type="button"
									onclick={removeImage}
									class="rounded bg-[var(--color-status-error)]/20 px-2 py-1 text-xs text-[var(--color-status-error)] hover:bg-[var(--color-status-error)]/30"
								>
									Hapus / Ganti
								</button>
							</div>
						</div>
					{:else}
						<!-- Widget Tombol Upload Cloudinary -->
						<CldUploadWidget
							uploadPreset="nama_preset_unsigned_anda"
							onUpload={handleUpload}
							let:open
						>
							<button
								type="button"
								onclick={() => open()}
								class="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-4 py-8 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span>Pilih dan Unggah Gambar</span>
							</button>
						</CldUploadWidget>
					{/if}
				</div>

				<!-- Select Kategori -->
				<div class="space-y-2">
					<label for="category" class="block text-sm font-medium text-[var(--color-text-muted)]">
						Kategori Berita <span class="text-[var(--color-status-error)]">*</span>
					</label>
					<select
						id="category"
						name="category"
						bind:value={category}
						required
						class="w-full rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
					>
						<option value="" disabled selected>Kategori . . .</option>
						{#each categories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Isi Berita -->
			<div class="space-y-2">
				<label for="content" class="block text-sm font-medium text-[var(--color-text-muted)]">
					Isi Berita <span class="text-[var(--color-status-error)]">*</span>
				</label>

				<div
					class="overflow-hidden rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary)]"
				>
					<div
						class="flex flex-wrap gap-2 border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] p-2 text-sm text-[var(--color-text-muted)]"
					>
						<span
							class="cursor-pointer rounded border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-2 py-1"
							>Paragraph ▾</span
						>
						<button type="button" class="px-2 py-1 font-bold hover:text-[var(--color-text-main)]"
							>B</button
						>
						<button type="button" class="px-2 py-1 italic hover:text-[var(--color-text-main)]"
							>I</button
						>
						<button type="button" class="px-2 py-1 hover:text-[var(--color-text-main)]">🔗</button>
						<button type="button" class="px-2 py-1 hover:text-[var(--color-text-main)]">≡</button>
						<button type="button" class="px-2 py-1 hover:text-[var(--color-text-main)]">🖼</button>
						<button type="button" class="px-2 py-1 hover:text-[var(--color-text-main)]">“ ”</button>
						<button type="button" class="px-2 py-1 hover:text-[var(--color-text-main)]">📊 ▾</button>
					</div>

					<textarea
						id="content"
						name="content"
						rows="8"
						bind:value={content}
						placeholder="Enter the Description"
						required
						class="w-full resize-y border-none bg-[var(--color-bg-primary)] p-3 text-sm text-[var(--color-text-main)] focus:outline-none"
					></textarea>
				</div>
			</div>

			<!-- Tombol Submit Kirim -->
			<div>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center justify-center rounded-md bg-[var(--color-accent-primary)] p-3 text-[var(--color-text-dark)] shadow-sm transition-colors hover:bg-[var(--color-accent-primary-hover)] disabled:opacity-50"
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
