<script lang="ts">
	import { classShadowDown, classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { Award, Calendar, GraduationCap, Maximize, User, XIcon } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// Menggunakan $derived untuk reaktivitas Svelte 5
	let achievements = $derived(data.achievements);
	let selectedSemester = $derived(data.selectedSemester);
	let semesters = $derived(data.semesters);


	// State untuk Modal Preview Sampul Buku / Pedoman
	let selectedImage = $state<{ url: string; title: string } | null>(null);

	function openModal(url: string, title: string) {
		selectedImage = { url, title };
	}

	function closeModal() {
		selectedImage = null;
	}



</script>

<svelte:head>
	<title>Prestasi Non-Akademik Mahasiswa - Prodi Teknologi Informasi</title>
</svelte:head>

<div class={` ${classTopSpace} mx-auto max-w-7xl px-6`}>
	<div class="mb-8 pb-6">
		<div class="flex items-center gap-3">
			<div>
				<h1 class="text-xl font-bold tracking-tight text-text-main sm:text-2xl">
					Prestasi Non-Akademik Mahasiswa
				</h1>
				<p class="text-xs text-text-muted sm:text-sm">
					Daftar capaian kejuaraan mahasiswa di bidang olahraga, seni, minat/bakat, dan minat khusus
					lainnya.
				</p>
			</div>
		</div>

		<!-- Filter Semester (Tab Navigation) -->
		<!-- {#if semesters.length > 0} -->
		<!-- 	<div class="mt-6 flex flex-wrap gap-2"> -->
		<!-- 		{#each semesters as sem} -->
		<!-- 			<a -->
		<!-- 				href="?semester={encodeURIComponent(sem.name)}" -->
		<!-- 				class="border px-3 py-1.5 text-xs font-semibold transition-colors {selectedSemester === sem.name -->
		<!-- 					? 'border-accent-primary bg-accent-primary/10 text-accent-primary' -->
		<!-- 					: 'border-border-light bg-bg-secondary text-text-muted hover:border-text-muted hover:text-text-main'}" -->
		<!-- 			> -->
		<!-- 				{sem.name} -->
		<!-- 			</a> -->
		<!-- 		{/each} -->
		<!-- 	</div> -->
		<!-- {/if} -->
	</div>

	{#if achievements.length === 0}
		<EmptyData
			title="Belum Ada Prestasi Non-Akademik"
			description="Tidak ditemukan data mahasiswa berprestasi non-akademik untuk semester {selectedSemester ||
				'ini'}."
			icon={Award}
		/>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each achievements as item (item.id)}
				<div
					class={`${classShadowDown} group flex flex-col justify-between border border-border-light bg-bg-secondary p-5 hover:border-accent-primary/50`}
				>
					<div>
						<div
							class="relative mb-4 aspect-video w-full overflow-hidden border border-border-light bg-bg-primary"
						>
							{#if item.image_url}
								<img
									src={item.image_url}
									alt={item.achievement_name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
	<div
									class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<button
										onclick={() => openModal(item.image_url!, item.student_name)}
										class="bg-bg-primary text-text-main inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
									>
										<Maximize class="h-4 w-4" />
										<span>Lihat Sampul</span>
									</button>
								</div>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-text-muted">
									<Award class="h-10 w-10 opacity-30" />
								</div>
							{/if}

							<span
								class="absolute top-2 right-2 border border-border-light bg-bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-accent-primary backdrop-blur-sm"
							>
								Non-Akademik
							</span>
						</div>

						<h3
							class="line-clamp-2 text-base font-bold text-text-main group-hover:text-accent-primary"
						>
							{item.achievement_name}
						</h3>

						<div
							class="mt-4 space-y-2 border-t border-border-light/60 pt-3 text-xs text-text-muted"
						>
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



<!-- MODAL PREVIEW SAMPUL -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<button
			onclick={closeModal}
			class="absolute inset-0 h-full w-full cursor-default"
			aria-label="Tutup Pratinjau"
		></button>

		<div
			class="bg-bg-secondary relative z-10 flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl border border-border-color shadow-2xl"
		>
			<div
				class="bg-scitech-navy flex items-center justify-between border-b border-border-color px-6 py-4"
			>
				<h3 class="line-clamp-1 text-sm font-bold text-text-main sm:text-base">
					{selectedImage.title}
				</h3>
				<button
					onclick={closeModal}
					class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
					aria-label="Tutup Modal"
				>
					<XIcon class="h-5 w-5" />
				</button>
			</div>

			<div
				class="bg-scitech-navy/80 flex max-h-[80vh] items-center justify-center overflow-auto p-4"
			>
				<img
					src={selectedImage.url}
					alt={selectedImage.title}
					class="h-auto max-w-full rounded-lg object-contain"
				/>
			</div>
		</div>
	</div>
{/if}
