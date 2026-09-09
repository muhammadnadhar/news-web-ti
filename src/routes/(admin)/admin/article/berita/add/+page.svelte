<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let title = form?.values?.title ?? '';
	let category = form?.values?.category ?? '';
	let content = form?.values?.content ?? '';
	let isSubmitting = false;

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

		<!-- Body Form -->
		<form
			method="POST"
			enctype="multipart/form-data"
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

			<!-- Grid Foto & Kategori Berita -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Upload Foto -->
				<div class="space-y-2">
					<label for="photo" class="block text-sm font-medium text-[var(--color-text-muted)]">
						Foto
					</label>
					<input
						type="file"
						id="photo"
						name="photo"
						accept="image/*"
						class="w-full cursor-pointer rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] text-sm text-[var(--color-text-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-secondary-hover)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-text-main)] hover:file:bg-[var(--color-border-light)]"
					/>
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

			<!-- Isi Berita (Rich Text / WYSIWYG Container) -->
			<div class="space-y-2">
				<label for="content" class="block text-sm font-medium text-[var(--color-text-muted)]">
					Isi Berita <span class="text-[var(--color-status-error)]">*</span>
				</label>

				<div
					class="overflow-hidden rounded-md border border-[var(--color-border-light)] bg-[var(--color-bg-primary)]"
				>
					<!-- Toolbar Editor Dummy (Menyerupai Tampilan UI Gambar) -->
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
						<button type="button" class="px-2 py-1 hover:text-[var(--color-text-main)]">📊 ▾</button
						>
					</div>

					<!-- Area Text (Dapat Diganti dengan Package Rich Text Editor Pilihan Anda) -->
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
						<!-- Icon Kirim/Telegram (sesuai gambar) -->
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
