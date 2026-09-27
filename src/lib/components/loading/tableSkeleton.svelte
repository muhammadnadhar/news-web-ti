<script lang="ts">
	interface Props {
		columnsCount?: number; // Jumlah kolom data (default: 3)
		rowCount?: number; // Jumlah baris skeleton (default: 5)
	}

	// Svelte 5 Runes syntax
	let { columnsCount = 3, rowCount = 5 }: Props = $props();
</script>

<div
	class="relative overflow-hidden rounded-2xl border border-border-color bg-bg-secondary p-5 shadow-xs backdrop-blur-xl"
>
	<div
		class="flex flex-col gap-3 border-b border-border-color pb-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="h-4 w-36 animate-pulse rounded bg-text-muted/30"></div>
		<div class="h-8 w-28 animate-pulse rounded-xl bg-accent-primary-dim"></div>
	</div>

	<div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex animate-pulse items-center gap-2">
			<div class="h-3 w-8 rounded bg-text-muted/30"></div>
			<div class="h-7 w-12 rounded-lg bg-bg-primary"></div>
			<div class="h-3 w-12 rounded bg-text-muted/30"></div>
		</div>
		<div class="h-7 w-full animate-pulse rounded-lg bg-bg-primary sm:w-64"></div>
	</div>

	<!-- Fake Table Content -->
	<div class="mt-4 overflow-x-auto rounded-xl border border-border-color bg-bg-primary/50">
		<table class="w-full border-collapse text-left text-xs">
			<!-- Fake Thead -->
			<thead>
				<tr class="border-b border-border-color bg-bg-primary uppercase">
					{#each Array(columnsCount) as _}
						<th class="p-3.5">
							<div class="h-3 w-20 animate-pulse rounded bg-text-muted/30"></div>
						</th>
					{/each}
					<th class="w-28 p-3.5 text-center">
						<div class="mx-auto h-3 w-12 animate-pulse rounded bg-text-muted/30"></div>
					</th>
				</tr>
			</thead>

			<!-- Fake Tbody Rows -->
			<tbody class="divide-y divide-border-color/60">
				{#each Array(rowCount) as _, rowIndex}
					<tr class="bg-transparent">
						{#each Array(columnsCount) as _, colIndex}
							<td class="p-3.5 align-middle">
								<!-- Variasi lebar baris agar tampilan animasi lebih alami -->
								<div
									class="h-3.5 animate-pulse rounded bg-text-muted/20"
									style="width: {(rowIndex + colIndex) % 3 === 0
										? '75%'
										: (rowIndex + colIndex) % 3 === 1
											? '55%'
											: '85%'}"
								></div>
							</td>
						{/each}

						<!-- Fake Action Buttons -->
						<td class="p-3.5 align-middle">
							<div class="flex items-center justify-center gap-2">
								<div class="h-7 w-7 animate-pulse rounded-lg bg-bg-secondary"></div>
								<div class="h-7 w-7 animate-pulse rounded-lg bg-bg-secondary"></div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Efek Shimmer Wave Diagonal -->
	<div class="shimmer-wave"></div>
</div>

<style>
	@keyframes shimmer {
		0% {
			transform: translate(-100%, -100%);
		}
		100% {
			transform: translate(100%, 100%);
		}
	}

	.shimmer-wave {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.01) 30%,
			rgba(255, 255, 255, 0.04) 50%,
			rgba(255, 255, 255, 0.01) 70%,
			rgba(255, 255, 255, 0) 100%
		);
		animation: shimmer 2.5s infinite linear;
	}
</style>
