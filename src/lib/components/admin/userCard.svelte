<script lang="ts">
	import { PencilIcon, ExternalLinkIcon } from 'lucide-svelte';

	interface Props {
		imageUrl: string; // Wajib (tidak boleh null)
		id?: string | null;
		title?: string | null;
		subtitle?: string | null;
		description?: string | null;
		editUrl?: string | null;
	}

	let {
		imageUrl,
		id = null,
		title = null,
		subtitle = null,
		description = null,
		editUrl = null
	}: Props = $props();
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-2xl border border-border-color bg-bg-secondary transition-all duration-300 hover:border-accent-primary hover:bg-bg-secondary-hover hover:shadow-lg"
>
	<!-- Container Gambar (Wajib) -->
	<div class="relative aspect-video w-full overflow-hidden bg-bg-primary-glare">
		<img
			src={imageUrl}
			alt={title ?? 'Card Image'}
			loading="lazy"
			class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent"
		></div>

		<!-- Tombol Buka Gambar di Tab Baru -->
		<a
			href={imageUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-bg-secondary/80 text-text-muted backdrop-blur-sm transition-all hover:border-accent-primary hover:bg-accent-primary hover:text-text-dark"
			title="Lihat Gambar Full"
		>
			<ExternalLinkIcon class="h-4 w-4" />
		</a>
	</div>

	<!-- Card Body (Hanya Tampil Jika Minimal Ada 1 Field Lain) -->
	{#if title || subtitle || description || editUrl}
		<div class="flex flex-1 flex-col justify-between space-y-4 p-5">
			<div class="space-y-2">
				<!-- Subtitle (Jika Ada) -->
				{#if subtitle}
					<span
						class="inline-block text-xs font-semibold tracking-wider text-accent-primary uppercase"
					>
						{subtitle}
					</span>
				{/if}

				<!-- Title (Jika Ada) -->
				{#if title}
					<h3
						class="text-lg font-bold text-text-main transition-colors group-hover:text-accent-primary"
					>
						{title}
					</h3>
				{/if}

				<!-- Description (Jika Ada) -->
				{#if description}
					<p class="line-clamp-3 text-sm leading-relaxed text-text-muted">
						{description}
					</p>
				{/if}
			</div>

			<!-- Action Button (Jika editUrl Ada) -->
			{#if editUrl}
				<div class="pt-2">
					<a
						href={editUrl}
						class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-bold text-text-dark shadow-md transition-all hover:scale-[1.01] hover:bg-accent-primary-hover active:scale-[0.99]"
					>
						<PencilIcon class="h-4 w-4" />
						<span>Ubah Data</span>
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
