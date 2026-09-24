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
	class="group relative flex flex-col border border-border-color bg-bg-secondary transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-primary hover:bg-bg-secondary-hover hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]"
>
	<div class="relative aspect-video w-full overflow-hidden border-b border-border-color bg-bg-primary-glare">
		<img
			src={imageUrl}
			alt={title ?? 'Card Image'}
			loading="lazy"
			class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
		/>
		<div
			class="absolute inset-0 bg-gradient  from-bg-primary/60 via-transparent to-transparent"
		></div>

		<a
			href={imageUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center border border-border-color bg-bg-secondary text-text-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary hover:text-text-dark active:scale-95"
			title="Lihat Gambar Full"
		>
			<ExternalLinkIcon class="h-4 w-4" />
		</a>
	</div>

	{#if title || subtitle || description || editUrl}
		<div class="flex flex-1 flex-col justify-between space-y-4 p-5">
			<div class="space-y-2">
				{#if subtitle}
					<span
						class="inline-block border border-accent-primary/30 bg-accent-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-accent-primary uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
					>
						{subtitle}
					</span>
				{/if}

				{#if title}
					<h3
						class="text-lg font-bold text-text-main transition-colors group-hover:text-accent-primary"
					>
						{title}
					</h3>
				{/if}

				{#if description}
					<p class="line-clamp-3 text-sm leading-relaxed text-text-muted">
						{description}
					</p>
				{/if}
			</div>

			{#if editUrl}
				<div class="pt-2">
					<a
						href={editUrl}
						class="inline-flex w-full items-center justify-center gap-2 border border-border-color bg-accent-primary px-4 py-2.5 text-sm font-bold text-text-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95"
					>
						<PencilIcon class="h-4 w-4" />
						<span>Ubah Data</span>
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
