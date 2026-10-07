<script lang="ts">
	import { classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class={`relative container mx-auto px-4 ${classTopSpace}`}>
	<header class="mb-8 text-center sm:text-left">
		<h1 class="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
			Daftar Penerima Beasiswa
		</h1>
		<p class="mt-2 text-sm text-text-main/70">
			Mahasiswa Program Studi Teknologi Informasi penerima program beasiswa.
		</p>
	</header>

	{#if data.scholarships.length === 0}
		<EmptyData
			title="Belum ada Data Beasiswa"
			description="Data penerima beasiswa belum dimasukkan atau belum tersedia saat ini."
		/>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.scholarships as item (item.id)}
				<article
					class="group flex flex-col overflow-hidden rounded-2xl border border-border-color/10 bg-bg-secondary p-4 shadow-lg transition-all duration-300 hover:border-border-color/30 hover:shadow-xl"
				>
					<div class="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-bg-primary/50">
						<img
							src={item.image_url || '/placeholder-student.png'}
							alt={item.student_name}
							class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
					</div>

					<div class="mt-4 flex flex-1 flex-col justify-between">
						<div>
							<span
								class="border-scitech-mint/20 bg-bg-secondary-dim text-scitech-mint inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold"
							>
								Penerima Beasiswa
							</span>

							<!-- Nama Mahasiswa -->
							<h3
								class="group-hover:text-scitech-mint mt-2 text-base font-bold tracking-wide text-text-main transition-colors"
							>
								{item.student_name}
							</h3>

							<!-- Program Beasiswa -->
							<p class="mt-1 text-xs font-medium text-text-main/60">
								{item.scholarship_name}
							</p>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
