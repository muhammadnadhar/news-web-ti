<script lang="ts">
	import { classTopSpace } from '$lib/constants';
import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { Award, Calendar, GraduationCap, User } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// Menggunakan $derived untuk reaktivitas Svelte 5
	let achievements = $derived(data.achievements);
	let selectedSemester = $derived(data.selectedSemester);
	let semesters = $derived(data.semesters);
</script>

<svelte:head>
	<title>Prestasi Non-Akademik Mahasiswa - Prodi Teknologi Informasi</title>
</svelte:head>

<div class={` ${classTopSpace} mx-auto max-w-7xl px-6`}>
	<!-- Header Halaman -->
	<div class="mb-8 border-b border-border-light pb-6">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center border border-border-light bg-bg-secondary text-accent-primary">
				<Award class="h-5 w-5" />
			</div>
			<div>
				<h1 class="text-xl font-bold tracking-tight text-text-main sm:text-2xl">
					Prestasi Non-Akademik Mahasiswa
				</h1>
				<p class="text-xs text-text-muted sm:text-sm">
					Daftar capaian kejuaraan mahasiswa di bidang olahraga, seni, minat/bakat, dan minat khusus lainnya.
				</p>
			</div>
		</div>

		<!-- Filter Semester (Tab Navigation) -->
		{#if semesters.length > 0}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each semesters as sem}
					<a
						href="?semester={encodeURIComponent(sem.name)}"
						class="border px-3 py-1.5 text-xs font-semibold transition-colors {selectedSemester === sem.name
							? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
							: 'border-border-light bg-bg-secondary text-text-muted hover:border-text-muted hover:text-text-main'}"
					>
						{sem.name}
					</a>
				{/each}
			</div>
		{/if}
	</div>

	{#if achievements.length === 0}
		<EmptyData
			title="Belum Ada Prestasi Non-Akademik"
			description="Tidak ditemukan data mahasiswa berprestasi non-akademik untuk semester {selectedSemester || 'ini'}."
			icon={Award}
		/>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each achievements as item (item.id)}
				<div
					class="group flex flex-col justify-between border border-border-light bg-bg-secondary p-5 transition-all hover:border-accent-primary/50"
				>
					<div>
						<div class="relative mb-4 aspect-video w-full overflow-hidden border border-border-light bg-bg-primary">
							{#if item.image_url}
								<img
									src={item.image_url}
									alt={item.achievement_name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-text-muted">
									<Award class="h-10 w-10 opacity-30" />
								</div>
							{/if}
							
							<span class="absolute top-2 right-2 border border-border-light bg-bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-accent-primary backdrop-blur-sm">
								Non-Akademik
							</span>
						</div>

						<h3 class="line-clamp-2 text-base font-bold text-text-main group-hover:text-accent-primary">
							{item.achievement_name}
						</h3>

						<div class="mt-4 space-y-2 border-t border-border-light/60 pt-3 text-xs text-text-muted">
							<div class="flex items-center gap-2">
								<User class="h-3.5 w-3.5 shrink-0 text-accent-primary" />
								<span class="font-medium text-text-main">{item.student_name}</span>
							</div>

							{#if item.batch_year}
								<div class="flex items-center gap-2">
									<GraduationCap class="h-3.5 w-3.5 shrink-0" />
									<span>Angkatan {item.batch_year}</span>
								</div>
							{/if}

							{#if item.semester_name}
								<div class="flex items-center gap-2">
									<Calendar class="h-3.5 w-3.5 shrink-0" />
									<span>{item.semester_name}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
