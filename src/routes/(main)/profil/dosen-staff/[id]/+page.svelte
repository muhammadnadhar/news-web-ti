<script lang="ts">
	import { classTopSpace } from '$lib/constants.js';
	import type { LecturerStaffItemDTO } from '$lib/dto/admin/article/profile.js';
	import {
		User,
		GraduationCap,
		ShieldCheck,
		Calendar,
		ArrowLeft,
		Mail,
		BookOpen,
		ExternalLinkIcon
	} from 'lucide-svelte';

	let { data } = $props();
	let lecturer = $derived<LecturerStaffItemDTO>(data.lecturer);
</script>

<svelte:head>
	<title>{lecturer.name} - Profil Dosen & Staff</title>
</svelte:head>

<div
	class={` ${classTopSpace} min-h-screen bg-[var(--color-bg-primary)] py-10 text-[var(--color-text-main)]`}
>
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<button
			onclick={() => history.back()}
			class="mb-8 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] shadow-sm transition-all hover:border-[var(--color-accent-primary)] hover:text-[var(--color-text-main)]"
		>
			<ArrowLeft class="h-4 w-4" />
			<span>Kembali ke Daftar Dosen & Staff</span>
		</button>

		<div
			class="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-xl"
		>
			<div class="grid grid-cols-1 md:grid-cols-12">
				<div
					class="relative flex flex-col items-center justify-center border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] p-6 md:col-span-5 md:border-r md:border-b-0"
				>
					<div
						class="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-lg"
					>
						{#if lecturer.photo_url}
							<img
								src={lecturer.photo_url}
								alt={lecturer.name}
								class="h-full w-full object-cover object-top"
							/>
						{:else}
							<div
								class="flex h-full w-full flex-col items-center justify-center bg-[var(--color-bg-secondary-hover)] p-6 text-center text-[var(--color-text-muted)]"
							>
								<User class="h-28 w-28 stroke-[1]" />
								<span class="mt-3 text-xs font-medium tracking-wide"
									>Foto Profil Tidak Tersedia</span
								>
							</div>
						{/if}
					</div>

					<div class="mt-4 text-center">
						<span
							class="inline-block rounded-full border border-[var(--color-accent-primary)]/20 bg-[var(--color-accent-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent-primary)]"
						>
							{lecturer.nidn && lecturer.nidn !== '-' ? 'Dosen Tetap' : 'Staff Kependidikan'}
						</span>
					</div>
				</div>

				<!-- Sisi Kanan: Detail Informasi -->
				<div class="flex flex-col justify-between space-y-6 p-6 sm:p-10 md:col-span-7">
					<div>
						<!-- Nama & Gelar -->
						<h1
							class="text-2xl leading-snug font-extrabold text-[var(--color-text-main)] sm:text-3xl"
						>
							{lecturer.name}
						</h1>

						<!-- NIDN / NIP -->
						<div
							class="mt-3 flex w-fit items-center gap-2 rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-muted)]"
						>
							<ShieldCheck class="h-4 w-4 text-[var(--color-accent-primary)]" />
							<span>NIDN / NIP: <strong>{lecturer.nidn || '-'}</strong></span>
						</div>

						<hr class="my-6 border-[var(--color-border-light)]" />

						<!-- Detail Keahlian / Tugas -->
						<div class="space-y-4">
							<div>
								<h2
									class="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase"
								>
									<GraduationCap class="h-4 w-4 text-[var(--color-accent-primary)]" />
									<span>Bidang Keahlian / Tugas</span>
								</h2>
								<p
									class="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] p-4 text-sm leading-relaxed font-medium text-[var(--color-text-main)]"
								>
									{lecturer.expertise}
								</p>
							</div>

							<div>
								<h2
									class="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase"
								>
									<BookOpen class="h-4 w-4 text-[var(--color-accent-primary)]" />
									<span>Program Studi</span>
								</h2>
								<p class="text-sm font-medium text-[var(--color-text-main)]">
									S1 Teknologi Informasi - Fakultas Sains dan Teknologi
								</p>
							</div>
						</div>
						<!-- Tombol Link PDDikti / DDT -->
						{#if lecturer.pddikti_url}
							<div class="my-10 self-start sm:self-auto">
								<a
									href={lecturer.pddikti_url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 rounded-xl border border-accent-blue/30 bg-accent-blue/10 px-4 py-2.5 text-xs font-semibold text-accent-blue transition-colors hover:bg-accent-blue/20"
								>
									<ExternalLinkIcon class="h-4 w-4" />
									<span>Profil PDDikti</span>
								</a>
							</div>
						{/if}
					</div>

					<!-- Timestamps / Meta -->
					<div
						class="flex items-center justify-between border-t border-[var(--color-border-light)] pt-4 font-mono text-[11px] text-[var(--color-text-muted)]"
					>
						<div class="flex items-center gap-1.5">
							<Calendar class="h-3.5 w-3.5" />
							<span
								>Terdaftar sejak: {new Date(lecturer.created_at).toLocaleDateString('id-ID', {
									year: 'numeric',
									month: 'short'
								})}</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
