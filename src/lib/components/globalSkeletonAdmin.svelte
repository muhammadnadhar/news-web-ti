<script lang="ts">
	import { Loader2, Image as ImageIcon, Layers, MoreVertical, Sparkles } from 'lucide-svelte';

	interface Props {
		count?: number;
		showTitle?: boolean;
		title?: string;
	}

	// Svelte 5 Runes syntax
	let { count = 8, showTitle = true, title = 'Memuat Data...' }: Props = $props();
</script>

<!-- Sub Header / Loading Status Indicator -->
{#if showTitle}
	<div class="mb-6 flex items-center justify-between px-1">
		<div class="flex items-center gap-2.5">
			<div
				class="bg-scitech-navy-glare/80 border-scitech-slate/40 animate-spin rounded-lg border p-2 text-sky-400"
			>
				<Loader2 class="h-4 w-4" />
			</div>
			<div>
				<h3 class="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200">
					{title}
					<Sparkles class="h-3.5 w-3.5 animate-pulse text-sky-400/70" />
				</h3>
				<p class="text-xs text-slate-400">Harap tunggu sebentar, sistem sedang menarik data.</p>
			</div>
		</div>
		<div class="bg-scitech-slate/30 hidden h-6 w-20 animate-pulse rounded-full sm:block"></div>
	</div>
{/if}

<!-- Skeleton Card Grid -->
<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
	{#each Array(count) as _, i}
		<div
			class="bg-scitech-navy-glare/90 border-scitech-slate/40 relative flex animate-pulse flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-lg shadow-black/10"
			style="animation-delay: {i * 75}ms;"
		>
			<!-- Top Bar: Icon Badge & Options Placeholder -->
			<div class="mb-3 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div
						class="bg-scitech-slate/40 border-scitech-slate/50 rounded-lg border p-1.5 text-sky-400/50"
					>
						<Layers class="h-4 w-4" />
					</div>
					<div class="bg-scitech-slate/60 h-3 w-16 rounded-full"></div>
				</div>
				<div class="text-scitech-slate/40">
					<MoreVertical class="h-4 w-4" />
				</div>
			</div>

			<!-- Image / Media Placeholder with Lucide Icon Blend -->
			<div
				class="bg-scitech-slate/40 border-scitech-slate/30 group relative mb-4 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border"
			>
				<!-- Background Subtle Glow -->
				<div
					class="from-scitech-navy-glare/80 absolute inset-0 bg-gradient-to-t to-transparent"
				></div>

				<!-- Centered Lucide Icon with Color Integration -->
				<div
					class="bg-scitech-navy-glare/60 border-scitech-slate/40 relative z-10 rounded-full border p-3 text-slate-500/60 shadow-inner"
				>
					<ImageIcon class="h-6 w-6 stroke-[1.5]" />
				</div>
			</div>

			<!-- Content Text Skeletons -->
			<div class="mb-4 space-y-2.5">
				<div class="bg-scitech-slate/70 h-4 w-4/5 rounded-md"></div>
				<div class="bg-scitech-slate/40 h-3 w-3/5 rounded-md"></div>
			</div>

			<!-- Footer Meta & Button Placeholder -->
			<div class="border-scitech-slate/30 mt-auto flex items-center justify-between border-t pt-3">
				<div class="flex items-center gap-2">
					<div class="h-2 w-2 animate-ping rounded-full bg-sky-500/40"></div>
					<div class="bg-scitech-slate/40 h-2.5 w-14 rounded-full"></div>
				</div>
				<div class="h-7 w-16 rounded-lg border border-sky-500/30 bg-sky-600/20"></div>
			</div>
		</div>
	{/each}
</div>
