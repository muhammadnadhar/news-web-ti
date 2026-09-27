<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export interface PaginationMeta {
		currentPage: number;
		totalPages: number;
		hasPrevPage: boolean;
		hasNextPage: boolean;
	}

	interface Props {
		pagination: PaginationMeta;
		onPageChange: (page: number) => void;
		class?: string;
	}

	let { pagination, onPageChange, class: className = '' }: Props = $props();
</script>

{#if pagination && pagination.totalPages > 1}
	<!-- 
		Posisi Default: 
		- Mobile (< sm): top-4 right-4 (Kanan Atas)
		- Desktop (>= sm): bottom-6 left-1/2 -translate-x-1/2 (Tengah Bawah)
	-->
	<div
		class="fixed top-4 right-4 z-40 border border-border-color bg-bg-secondary px-4 py-2.5 backdrop-blur-xl sm:top-auto sm:right-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:px-5 sm:py-3 {className}"
	>
		<div class="flex items-center gap-3 sm:gap-6">
			<!-- Tombol Previous -->
			<button
				onclick={() => onPageChange(pagination.currentPage - 1)}
				disabled={!pagination.hasPrevPage}
				class="inline-flex items-center gap-1.5 border border-border-color bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-main transition-colors hover:bg-bg-secondary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:py-1.5"
				title="Halaman Sebelumnya"
			>
				<ChevronLeft class="h-4 w-4" />
				<span class="hidden sm:inline">Sebelumnya</span>
			</button>

			<!-- Indikator Halaman -->
			<div class="font-mono text-xs text-text-muted">
				<span class="hidden sm:inline">Halaman </span>
				<span class="font-bold text-accent-primary">{pagination.currentPage}</span>
				<span class="text-text-muted"> / </span>
				<span class="font-bold text-text-main">{pagination.totalPages}</span>
			</div>

			<!-- Tombol Next -->
			<button
				onclick={() => onPageChange(pagination.currentPage + 1)}
				disabled={!pagination.hasNextPage}
				class="inline-flex items-center gap-1.5 border border-border-color bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-main transition-colors hover:bg-bg-secondary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:py-1.5"
				title="Halaman Selanjutnya"
			>
				<span class="hidden sm:inline">Selanjutnya</span>
				<ChevronRight class="h-4 w-4" />
			</button>
		</div>
	</div>
{/if}

<!-- example  -->
<!-- {#await data.pagination then pagination} -->
<!-- 	<!-- Contoh: Paksa posisi selalu di kanan bawah baik mobile maupun desktop --> 
<!-- 	<FloatingPagination  -->
<!-- 		{pagination}  -->
<!-- 		onPageChange={goToPage}  -->
<!-- 		class="top-auto bottom-4 right-4 sm:left-auto sm:translate-x-0"  -->
<!-- 	/> -->
<!-- {/await} -->
