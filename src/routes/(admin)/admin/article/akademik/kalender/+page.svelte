<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, Save, Image as ImageIcon, Upload, Trash2 } from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';

	let { data } = $props();

	// State
	let calendarData = $derived(data.calendar);
	let descriptionContent = $state(calendarData?.description || '');
	let titleInput = $state(calendarData?.title || 'Kalender Akademik T.A 2024/2025');

	// Dummy Gambar Sebelumnya (Dapat diganti dengan data dari relasi DB/Array)
	let existingImages = $state<string[]>([
		'/images/kalender/page1.jpg',
		'/images/kalender/page2.jpg',
		'/images/kalender/page3.jpg',
		'/images/kalender/page4.jpg',
		'/images/kalender/page5.jpg',
		'/images/kalender/page6.jpg',
		'/images/kalender/page7.jpg'
	]);

	function removeExistingImage(index: number) {
		existingImages = existingImages.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<!-- Page Header -->
	<div class="border-b border-white/10 pb-6">
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Artikel Akademik
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Kalender Akademik</h1>
	</div>

	<!-- Main Form Container -->
	<div
		class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<div class="border-b border-white/10 pb-4">
			<h2 class="text-scitech-mint text-base font-bold">Form Ubah Data Kalender Akademik</h2>
		</div>

		<form method="POST" action="?/save" enctype="multipart/form-data" use:enhance class="space-y-6">
			<input type="hidden" name="id" value={calendarData?.id || ''} />

			<!-- Title Input -->
			<div>
				<label for="title" class="mb-2 block text-xs font-medium text-text-muted"
					>Judul Kalender*</label
				>
				<input
					id="title"
					name="title"
					type="text"
					required
					bind:value={titleInput}
					class="bg-scitech-navy/80 focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
				/>
			</div>

			<!-- Rich Text Editor -->
			<div class="space-y-2">
				<label for="description" class="block text-xs font-medium text-text-muted"
					>Description*</label
				>
				<FormEditor bind:value={descriptionContent} />
				<input type="hidden" name="description" value={descriptionContent} />
			</div>

			<!-- Foto Sebelumnya Grid -->
			<div class="space-y-3">
				<span class="block text-xs font-medium text-text-muted">Foto Sebelumnya:</span>

				{#if existingImages.length === 0}
					<p class="text-xs text-text-muted italic">Belum ada foto yang diunggah.</p>
				{:else}
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{#each existingImages as img, idx}
							<div
								class="group bg-scitech-navy/50 relative overflow-hidden rounded-xl border border-white/10 p-2 shadow-md"
							>
								<img
									src={img}
									alt={`Halaman Kalender ${idx + 1}`}
									class="h-36 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<button
									type="button"
									onclick={() => removeExistingImage(idx)}
									class="absolute top-3 right-3 rounded-lg bg-rose-500/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600"
									title="Hapus foto"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Upload Multiple Images -->
			<div class="space-y-2">
				<label for="images" class="block text-xs font-medium text-text-muted">
					Foto* <span class="text-text-muted/60">(bisa lebih dari satu)</span>
				</label>
				<div class="flex items-center gap-3">
					<label
						for="images"
						class="bg-scitech-navy hover:bg-scitech-navy/80 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs font-medium text-text-muted transition-all hover:text-white"
					>
						<Upload class="h-4 w-4" />
						<span>Browse...</span>
					</label>
					<input id="images" name="images" type="file" multiple accept="image/*" class="hidden" />
				</div>
			</div>

			<!-- Submit Button -->
			<div class="pt-4">
				<button
					type="submit"
					class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95"
				>
					<Save class="h-4 w-4" />
					<span>Simpan Perubahan</span>
				</button>
			</div>
		</form>
	</div>
</div>
