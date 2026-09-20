<script lang="ts">
	import { User, GraduationCap, ShieldCheck, Calendar, ArrowLeft, Mail, BookOpen } from 'lucide-svelte';
  import type { LecturerStaffItemDTO } from '$lib/types/admin/article/profile';

	let { data } = $props();
	let lecturer = $derived<LecturerStaffItemDTO>(data.lecturer);
</script>

<svelte:head>
	<title>{lecturer.name} - Profil Dosen & Staff</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-bg-primary)] py-10 text-[var(--color-text-main)]">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<!-- Tombol Kembali -->
		<a
			href="/dosen-staff"
			class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-bg-secondary)] px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] shadow-sm border border-[var(--color-border-light)] transition-all hover:text-[var(--color-text-main)] hover:border-[var(--color-accent-primary)] mb-8"
		>
			<ArrowLeft class="h-4 w-4" />
			<span>Kembali ke Daftar Dosen & Staff</span>
		</a>

		<!-- Main Card Profil Detail -->
		<div class="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-xl">
			<div class="grid grid-cols-1 md:grid-cols-12">
				<!-- Sisi Kiri: Photo Frame -->
				<div class="md:col-span-5 relative bg-[var(--color-bg-primary-glare)] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--color-border-light)]">
					<div class="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl shadow-lg border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
						{#if lecturer.photo_url}
							<img
								src={lecturer.photo_url}
								alt={lecturer.name}
								class="h-full w-full object-cover object-top"
							/>
						{:else}
							<div class="flex h-full w-full flex-col items-center justify-center bg-[var(--color-bg-secondary-hover)] text-[var(--color-text-muted)] p-6 text-center">
								<User class="h-28 w-28 stroke-[1]" />
								<span class="mt-3 text-xs font-medium tracking-wide">Foto Profil Tidak Tersedia</span>
							</div>
						{/if}
					</div>

					<div class="mt-4 text-center">
						<span class="inline-block rounded-full bg-[var(--color-accent-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/20">
							{lecturer.nidn && lecturer.nidn !== '-' ? 'Dosen Tetap' : 'Staff Kependidikan'}
						</span>
					</div>
				</div>

				<!-- Sisi Kanan: Detail Informasi -->
				<div class="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
					<div>
						<!-- Nama & Gelar -->
						<h1 class="text-2xl font-extrabold text-[var(--color-text-main)] sm:text-3xl leading-snug">
							{lecturer.name}
						</h1>

						<!-- NIDN / NIP -->
						<div class="mt-3 flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] px-3 py-1.5 rounded-lg border border-[var(--color-border-light)] w-fit">
							<ShieldCheck class="h-4 w-4 text-[var(--color-accent-primary)]" />
							<span>NIDN / NIP: <strong>{lecturer.nidn || '-'}</strong></span>
						</div>

						<hr class="my-6 border-[var(--color-border-light)]" />

						<!-- Detail Keahlian / Tugas -->
						<div class="space-y-4">
							<div>
								<h2 class="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
									<GraduationCap class="h-4 w-4 text-[var(--color-accent-primary)]" />
									<span>Bidang Keahlian / Tugas</span>
								</h2>
								<p class="text-sm font-medium leading-relaxed text-[var(--color-text-main)] bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border-light)]">
									{lecturer.expertise}
								</p>
							</div>

							<div>
								<h2 class="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
									<BookOpen class="h-4 w-4 text-[var(--color-accent-primary)]" />
									<span>Program Studi</span>
								</h2>
								<p class="text-sm font-medium text-[var(--color-text-main)]">
									S1 Teknologi Informasi - Fakultas Sains dan Teknologi
								</p>
							</div>
						</div>
					</div>

					<!-- Timestamps / Meta -->
					<div class="pt-4 border-t border-[var(--color-border-light)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
						<div class="flex items-center gap-1.5">
							<Calendar class="h-3.5 w-3.5" />
							<span>Terdaftar sejak: {new Date(lecturer.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
