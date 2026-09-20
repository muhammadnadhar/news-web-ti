<script lang="ts">
	import { User, GraduationCap, ChevronRight, Search } from 'lucide-svelte';
	import type { LecturerStaffItemDTO } from '$lib/types/admin/article/profile';

	let { data } = $props();

	let lecturers = $derived<LecturerStaffItemDTO[]>(data.lecturers || []);
	let searchQuery = $state('');

	// Filter pencarian berdasarkan nama, NIDN, atau bidang keahlian
	let filteredLecturers = $derived(
		lecturers.filter((item) => {
			const query = searchQuery.toLowerCase();
			return (
				item.name.toLowerCase().includes(query) ||
				item.expertise.toLowerCase().includes(query) ||
				(item.nidn && item.nidn.toLowerCase().includes(query))
			);
		})
	);
</script>

<svelte:head>
	<title>Dosen & Staff</title>
</svelte:head>

<!-- Header Banner -->
<section
	class="relative overflow-hidden border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] py-12 lg:py-16"
>
	<div
		class="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[var(--color-accent-primary)]/10 blur-3xl"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<nav class="mb-4 flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
			<a href="/" class="transition-colors hover:text-[var(--color-accent-primary)]">Home</a>
			<ChevronRight class="h-3 w-3" />
			<span class="font-semibold text-[var(--color-text-main)]">Dosen & Staff</span>
		</nav>

		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<h1
					class="text-2xl font-extrabold tracking-tight text-[var(--color-text-main)] sm:text-3xl lg:text-4xl"
				>
					Dosen & Staff Pengajar
				</h1>
				<p class="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
					Tenaga pendidik dan kependidikan profesional Program Studi Teknologi Informasi Fakultas
					Sains dan Teknologi.
				</p>
			</div>

			<!-- Input Pencarian -->
			<div class="relative w-full md:w-72">
				<Search
					class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari dosen, NIDN, keahlian..."
					class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-4 pl-10 text-xs text-[var(--color-text-main)] shadow-sm transition-all focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] focus:outline-none"
				/>
			</div>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	{#if filteredLecturers.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredLecturers as item (item.id)}
				<a
					href={`/dosen-staff/${item.id}`}
					class="group relative flex flex-col justify-between border border-border-color bg-bg-secondary
               shadow-[0_4px_0_0_var(--border-color)] transition-all duration-300
               hover:-translate-y-1 hover:border-border-color hover:bg-bg-secondary-hover hover:shadow-[0_8px_0_0_var(--border-color)]"
				>
					<!-- 1. Frame Gambar Full Width (Border-b Tajam) -->
					<div
						class="relative aspect-[4/5] w-full overflow-hidden border-b border-border-color bg-bg-primary"
					>
						{#if item.photo_url}
							<img
								src={item.photo_url}
								alt={item.name}
								class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-full w-full flex-col items-center justify-center bg-bg-secondary text-text-muted"
							>
								<User class="h-16 w-16 stroke-[1.25]" />
								<span class="mt-2 text-[10px] font-bold tracking-wider uppercase opacity-60"
									>Foto Belum Ada</span
								>
							</div>
						{/if}

						<!-- Badge NIDN Tajam -->
						<div class="absolute bottom-3 left-3 flex items-center">
							<span
								class="border border-border-color bg-bg-primary/90 px-2.5 py-1 font-mono text-[10px] font-bold text-text-main backdrop-blur-md"
							>
								{item.nidn && item.nidn !== '-' ? `NIDN: ${item.nidn}` : 'Staff Prodi'}
							</span>
						</div>
					</div>

					<!-- 2. Area Konten Teks (Padding Berada di Sini) -->
					<div class="flex flex-1 flex-col justify-between space-y-4 p-5">
						<div>
							<h2
								class="line-clamp-2 text-base leading-snug font-bold text-text-main transition-colors duration-300 group-hover:text-text-muted"
							>
								{item.name}
							</h2>

							{#if item.expertise}
								<div class="mt-2.5 flex items-start gap-2 text-xs text-text-muted">
									<GraduationCap class="mt-0.5 h-4 w-4 shrink-0 text-text-main" />
									<span class="line-clamp-2">{item.expertise}</span>
								</div>
							{/if}
						</div>

						<!-- Action Link Indicator -->
						<div
							class="flex items-center justify-between border-t border-border-color pt-3 text-xs font-bold text-text-main"
						>
							<span>Lihat Profil</span>
							<ChevronRight
								class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
							/>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] py-16 text-center"
		>
			<User class="mb-3 h-12 w-12 text-[var(--color-text-muted)] opacity-40" />
			<h3 class="text-base font-semibold text-[var(--color-text-main)]">Data Tidak Ditemukan</h3>
			<p class="mt-1 text-xs text-[var(--color-text-muted)]">
				Coba cari dengan kata kunci nama atau NIDN yang berbeda.
			</p>
		</div>
	{/if}
</section>
