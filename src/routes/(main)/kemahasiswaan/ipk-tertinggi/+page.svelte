<script lang="ts">
	import { classShadowDown, classTopSpace } from '$lib/constants';
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { TrendingUp, GraduationCap, Calendar, User, Star, Maximize2, XIcon } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let students = $derived(data.students);
	let selectedSemester = $derived(data.selectedSemester);

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

								<div
									class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<button
										onclick={() => openModal(item.image_url!, item.student_name)}
										class="inline-flex items-center gap-2 rounded-xl bg-bg-primary px-4 py-2 text-xs font-bold text-text-main shadow-xl transition-transform hover:scale-105 active:scale-95"
									>
										<Maximize2 class="h-4 w-4" />
										<span>Lihat Sampul</span>
									</button>
								</div>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-text-muted">
									<User class="h-16 w-16 opacity-30" />
								</div>
							{/if}

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
			class="relative z-10 flex max-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl border border-border-color bg-bg-secondary shadow-2xl"
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
