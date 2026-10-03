<script lang="ts">
	import { classShadowDown, classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { TrendingUp, GraduationCap, Calendar, User, Star } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let students = $derived(data.students);
	let selectedSemester = $derived(data.selectedSemester);
	let semesters = $derived(data.semesters);
</script>

<svelte:head>
	<title>Mahasiswa IPK Tertinggi - Prodi Teknologi Informasi</title>
</svelte:head>

<div class={`${classTopSpace} mx-auto max-w-7xl px-6 py-10 lg:px-12`}>
	<div class="mb-8 pb-6">
		<div>
			<h1 class="text-xl font-extrabold tracking-tight text-text-main sm:text-2xl">
				Mahasiswa IPK Tertinggi
			</h1>
			<p class="text-xs text-text-muted sm:text-sm">
				Daftar rekapitulasi mahasiswa peraih Indeks Prestasi Kumulatif (IPK) tertinggi tiap
				semester.
			</p>
		</div>
	</div>

	<!-- Konten Data IPK Tertinggi -->
	{#if students.length === 0}
		<EmptyData
			title="Belum Ada Data IPK Tertinggi"
			description="Tidak ditemukan data mahasiswa dengan IPK tertinggi untuk semester {selectedSemester ||
				'ini'}."
			icon={TrendingUp}
		/>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each students as item (item.id)}
				<div
					class={`group flex flex-col justify-between border border-border-light bg-bg-secondary p-5  hover:border-accent-primary/50 ${classShadowDown} `}
				>
					<div>
						<!-- Foto Mahasiswa & Badge IPK -->
						<div
							class="relative mb-4 aspect-square w-full overflow-hidden border border-border-light bg-bg-primary"
						>
							{#if item.image_url}
								<img
									src={item.image_url}
									alt={item.student_name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-text-muted">
									<User class="h-16 w-16 opacity-30" />
								</div>
							{/if}

							<!-- Badge IPK -->
							{#if item.gpa !== undefined}
								<div
									class="absolute top-2 right-2 flex items-center gap-1 border border-border-light bg-bg-primary/95 px-2.5 py-1 text-xs font-bold text-accent-primary shadow-sm backdrop-blur-sm"
								>
									<Star class="h-3.5 w-3.5 fill-accent-primary text-accent-primary" />
									<span>IPK {Number(item.gpa).toFixed(2)}</span>
								</div>
							{/if}
						</div>

						<h3
							class="line-clamp-1 text-base font-bold text-text-main group-hover:text-accent-primary"
						>
							{item.student_name}
						</h3>

						<div
							class="mt-4 space-y-2 border-t border-border-light/60 pt-3 text-xs text-text-muted"
						>
							{#if item.batch_year}
								<div class="flex items-center gap-2">
									<GraduationCap class="h-3.5 w-3.5 shrink-0 text-accent-primary" />
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
