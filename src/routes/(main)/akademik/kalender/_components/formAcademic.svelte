<script lang="ts">
	import type { AcademicCalendarWithImagesDTO } from '$lib/repository/admin/article/akedemik/kalender';
	import { Calendar, Image as ImageIcon, ExternalLink, FileText, Info } from 'lucide-svelte';

	let { calendar }: { calendar: AcademicCalendarWithImagesDTO } = $props();

	// Defensive check: Ambil array gambar secara aman dari calendar.images
	let imagesList = $derived(calendar?.images ?? []);

	// State gambar utama yang dipilih
	let selectedImage = $state<string | null>(imagesList[0]?.image_url ?? null);

	// Sinkronkan selectedImage jika prop calendar diperbarui
	$effect(() => {
		selectedImage = imagesList[0]?.image_url ?? null;
	});

	$inspect(calendar);
</script>

<article class="relative flex flex-col border border-border-color bg-bg-secondary/50 p-6 sm:p-8">
	<!-- Header Item: Judul & Badge Status -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<div
				class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint mb-2 inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
			>
				<Calendar class="h-4 w-4" />
				<span>Kalender Akademik Aktif</span>
			</div>
			<h2 class="text-xl font-bold text-text-main sm:text-2xl">
				{calendar?.title ?? 'Kalender Akademik'}
			</h2>
		</div>
	</div>

	<!-- Deskripsi -->
	{#if calendar?.description}
		<div
			class="mt-5 border border-border-color bg-bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]"
		>
			<!-- Header Panel Deskripsi -->
			<div
				class="bg-scitech-navy text-scitech-mint flex items-center justify-between border-b border-border-color px-4 py-2.5 text-xs font-bold tracking-wider uppercase"
			>
				<div class="flex items-center gap-2">
					<FileText class="text-scitech-mint h-4 w-4" />
					<span>Rincian & Catatan Kalender</span>
				</div>
				<span
					class="bg-scitech-slate inline-flex items-center gap-1 border border-border-color px-2 py-0.5 text-[10px] font-semibold text-text-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
				>
					<Info class="text-scitech-cyan h-3 w-3" />
					Informasi Resmi
				</span>
			</div>

			<!-- Isi Konten Deskripsi dengan Tailwind Class Langsung -->
			<div
				class="[&_th]:bg-scitech-navy [&_th]:text-scitech-mint p-4 text-sm leading-relaxed text-text-main sm:p-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border-color [&_td]:border [&_td]:border-border-color [&_td]:p-2.5 [&_td]:text-text-main [&_th]:border [&_th]:border-border-color [&_th]:p-2.5 [&_th]:text-left [&_th]:font-bold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
			>
				{@html calendar.description}
			</div>
		</div>
	{/if}
	<!-- Bagian Galeri Gambar Kalender -->
	{#if imagesList.length > 0}
		<div class="mt-6 space-y-4">
			<!-- Frame Pratinjau Gambar Utama (Style 3D Solid Shadow) -->
			{#if selectedImage}
				<div
					class="bg-scitech-navy/90 relative w-full border border-border-color p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]"
				>
					<!-- Container dalam dengan overflow-hidden dan relative anchor yang presisi -->
					<div
						class="relative flex max-h-[500px] w-full items-center justify-center overflow-hidden bg-black/40"
					>
						<img
							src={selectedImage}
							alt={calendar?.title ?? 'Kalender'}
							class="h-auto max-h-[500px] w-full object-contain"
						/>

						<!-- Tombol Buka Ukuran Penuh dikunci aman di dalam bingkai -->
						<a
							href={selectedImage}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover absolute right-3 bottom-3 z-10 flex items-center gap-1.5 border border-border-color px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] transition-all active:scale-95"
						>
							<ExternalLink class="h-3.5 w-3.5" />
							<span>Buka Ukuran Penuh</span>
						</a>
					</div>
				</div>
			{/if}

			<!-- 2. BARIS THUMBNAIL (Diperbaiki dengan padding p-1.5 pb-3 agar shadow 3D tidak terpotong) -->
			{#if imagesList.length > 1}
				<div class="flex items-center gap-3 overflow-x-auto p-1.5 pb-3">
					{#each imagesList as img (img.id)}
						<button
							type="button"
							onclick={() => (selectedImage = img.image_url)}
							class={`relative h-20 w-28 flex-shrink-0 overflow-hidden border transition-all ${
								selectedImage === img.image_url
									? 'border-scitech-mint ring-scitech-mint/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] ring-2'
									: 'border-border-color opacity-60 hover:opacity-100'
							}`}
						>
							<img src={img.image_url} alt="Thumbnail" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Empty state jika tidak ada gambar -->
		<div
			class="bg-scitech-navy/30 mt-6 flex flex-col items-center justify-center border border-dashed border-border-color p-8 text-center text-xs text-text-muted shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
		>
			<ImageIcon class="mb-2 h-8 w-8 text-text-muted/40" />
			<span>Belum ada berkas/gambar lampiran untuk kalender ini.</span>
		</div>
	{/if}
</article>
