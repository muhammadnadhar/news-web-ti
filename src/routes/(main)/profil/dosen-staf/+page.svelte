<script lang="ts">
	import { User, GraduationCap, ChevronRight, Search, ShieldCheck } from 'lucide-svelte';
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
	<title>Dosen & Staff - Prodi Teknologi Informasi</title>
</svelte:head>

<!-- Header Banner -->
<section class="relative overflow-hidden bg-[var(--color-bg-secondary)] py-12 lg:py-16 border-b border-[var(--color-border-light)]">
	<div class="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[var(--color-accent-primary)]/10 blur-3xl"></div>
	
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
		<nav class="mb-4 flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
			<a href="/" class="hover:text-[var(--color-accent-primary)] transition-colors">Home</a>
			<ChevronRight class="h-3 w-3" />
			<span class="text-[var(--color-text-main)] font-semibold">Dosen & Staff</span>
		</nav>

		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
			<div>
				<h1 class="text-2xl font-extrabold tracking-tight text-[var(--color-text-main)] sm:text-3xl lg:text-4xl">
					Dosen & Staff Pengajar
				</h1>
				<p class="mt-2 text-sm text-[var(--color-text-muted)] max-w-2xl">
					Tenaga pendidik dan kependidikan profesional Program Studi Teknologi Informasi Fakultas Sains dan Teknologi.
				</p>
			</div>

			<!-- Input Pencarian -->
			<div class="relative w-full md:w-72">
				<Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari dosen, NIDN, keahlian..."
					class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] pl-10 pr-4 py-2.5 text-xs text-[var(--color-text-main)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)] shadow-sm transition-all"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Content Grid -->
<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	{#if filteredLecturers.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredLecturers as item (item.id)}
				<a
					href={`/dosen-staff/${item.id}`}
					class="group relative flex flex-col overflow-hidden rounded-2xl border border-color-border-light bg-bg-secondary p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-color-accent-primary/50 hover:shadow-lg"
				>
					<!-- Photo Wrapper -->
					<div class="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-xl bg-[var(--color-bg-primary-glare)]">
						{#if item.photo_url}
							<img
								src={item.photo_url}
								alt={item.name}
								class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<!-- Default Fallback dengan Lucide Icon -->
							<div class="flex h-full w-full flex-col items-center justify-center bg-[var(--color-bg-secondary-hover)] text-[var(--color-text-muted)]">
								<User class="h-20 w-20 stroke-[1.25]" />
								<span class="mt-2 text-[10px] font-medium tracking-wider uppercase opacity-60">Foto Belum Ada</span>
							</div>
						{/if}

						<!-- NIDN / Category Badge -->
						<div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
							<span class="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-medium text-text-main shadow-sm border border-white/10">
								{item.nidn && item.nidn !== '-' ? `NIDN: ${item.nidn}` : 'Staff Prodi'}
							</span>
						</div>
					</div>

					<!-- Content Info -->
					<div class="flex flex-1 flex-col justify-between space-y-3">
						<div>
							<h2 class="text-sm font-bold leading-snug text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-accent-primary)] line-clamp-2">
								{item.name}
							</h2>

							<div class="mt-2 flex items-start gap-1.5 text-xs text-[var(--color-text-muted)]">
								<GraduationCap class="h-4 w-4 shrink-0 text-[var(--color-accent-primary)] mt-0.5" />
								<span class="line-clamp-2">{item.expertise}</span>
							</div>
						</div>

						<!-- Action Link Indicator -->
						<div class="pt-2 border-t border-[var(--color-border-light)] flex items-center justify-between text-xs font-semibold text-[var(--color-accent-primary)]">
							<span>Lihat Profil</span>
							<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] py-16 text-center">
			<User class="h-12 w-12 text-[var(--color-text-muted)] opacity-40 mb-3" />
			<h3 class="text-base font-semibold text-[var(--color-text-main)]">Data Tidak Ditemukan</h3>
			<p class="mt-1 text-xs text-[var(--color-text-muted)]">Coba cari dengan kata kunci nama atau NIDN yang berbeda.</p>
		</div>
	{/if}
</section>
