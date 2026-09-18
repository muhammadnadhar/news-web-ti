<script lang="ts">
	import { enhance } from '$app/forms';
	import { UserCheck, User, Send, Search, CheckCircle2, Award } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import Message from '$lib/components/admin/message.svelte';
	import SelectJabatan from '../../../dataset/jabatan-prodi/_component/selectJabatan.svelte';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	let selectedLecturerId = $state(form?.values?.lecturerStaffId ?? '');
	let selectedPosition = $state(form?.values?.position ?? '');
	let searchQuery = $state('');
	let isSubmitting = $state(false);

	// Filter dosen berdasarkan pencarian
	let filteredLecturers = $derived(
		data.lecturers.filter(
			(lecturer) =>
				lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(lecturer.nidn && lecturer.nidn.includes(searchQuery)) ||
				lecturer.expertise.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	// Info dosen yang sedang dipilih
	let selectedLecturer = $derived(data.lecturers.find((l) => l.id === selectedLecturerId));
</script>

<svelte:head>
	<title>Tambah Dosen Primary - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-bg-primary)] p-4 text-[var(--color-text-main)] md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<div
			class="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-xl"
		>
			<div
				class="border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] px-6 py-4"
			>
				<h2
					class="flex items-center gap-2 text-base font-semibold text-[var(--color-accent-primary)]"
				>
					<UserCheck class="h-5 w-5" />
					<span>Tambah Slot Dosen Primary / Struktural</span>
				</h2>
			</div>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-6 p-6"
			>
				{#if form?.message}
					<Message type={form.message.type} text={form.message.text} />
				{/if}

				<!-- Hidden Input untuk ID Dosen yang Dipilih -->
				<input type="hidden" name="lecturer_staff_id" value={selectedLecturerId} />

				<!-- Step 1: Pilih Jabatan Prodi -->
				<div
					class="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] p-4"
				>
					<h3
						class="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase"
					>
						<Award class="h-4 w-4 text-[var(--color-accent-primary)]" />
						<span>1. Tentukan Jabatan Struktural</span>
					</h3>
					<SelectJabatan positions={data.positions} bind:selectedPosition />
				</div>

				<!-- Step 2: Pilih Dosen / Staff -->
				<div
					class="space-y-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] p-4"
				>
					<h3
						class="flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase"
					>
						<User class="h-4 w-4 text-[var(--color-accent-primary)]" />
						<span>2. Pilih Dosen / Staff</span>
					</h3>

					<!-- Filter / Search Box Dosen -->
					<div class="relative">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Cari Dosen berdasarkan Nama, NIDN, atau Keahlian..."
							class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] py-2 pr-3 pl-9 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
						/>
						<Search class="absolute top-2.5 left-3 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
					</div>

					<!-- List Card Dosen -->
					<div class="max-h-72 space-y-2 overflow-y-auto pr-1">
						{#if filteredLecturers.length === 0}
							<div class="py-8 text-center text-xs text-[var(--color-text-muted)]">
								Dosen tidak ditemukan.
							</div>
						{:else}
							{#each filteredLecturers as lecturer (lecturer.id)}
								<button
									type="button"
									onclick={() => (selectedLecturerId = lecturer.id)}
									class="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all {selectedLecturerId ===
									lecturer.id
										? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
										: 'border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-muted)]'}"
								>
									<div class="flex items-center gap-3">
										<div
											class="h-10 w-10 overflow-hidden rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-primary)]"
										>
											{#if lecturer.photo_url}
												<img
													src={lecturer.photo_url}
													alt={lecturer.name}
													class="h-full w-full object-cover"
												/>
											{:else}
												<div
													class="flex h-full w-full items-center justify-center text-[var(--color-text-muted)]"
												>
													<User class="h-5 w-5 opacity-40" />
												</div>
											{/if}
										</div>
										<div>
											<p class="text-xs font-semibold text-[var(--color-text-main)]">
												{lecturer.name}
											</p>
											<p class="text-[11px] text-[var(--color-text-muted)]">
												NIDN: {lecturer.nidn || '-'} • Bidang: {lecturer.expertise}
											</p>
										</div>
									</div>

									{#if selectedLecturerId === lecturer.id}
										<CheckCircle2 class="h-5 w-5 shrink-0 text-[var(--color-accent-primary)]" />
									{/if}
								</button>
							{/each}
						{/if}
					</div>
				</div>

				<!-- Preview Ringkasan Pilihan -->
				{#if selectedLecturer && selectedPosition}
					<div
						class="rounded-xl border border-[var(--color-accent-primary)]/30 bg-[var(--color-accent-primary)]/5 p-4"
					>
						<p class="text-xs font-semibold text-[var(--color-accent-primary)]">
							Ringkasan Penetapan:
						</p>
						<p class="mt-1 text-xs text-[var(--color-text-main)]">
							<span class="font-bold">{selectedLecturer.name}</span> akan ditetapkan sebagai
							<span class="font-bold text-[var(--color-accent-primary)]">{selectedPosition}</span>.
						</p>
					</div>
				{/if}

				<!-- Submit Button -->
				<div class="flex justify-end border-t border-[var(--color-border-light)] pt-4">
					<button
						type="submit"
						disabled={isSubmitting || !selectedLecturerId || !selectedPosition}
						class="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-5 py-2.5 text-xs font-bold text-[var(--color-text-dark)] shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isSubmitting}
							<span>Memproses...</span>
						{:else}
							<Send class="h-4 w-4" />
							<span>Simpan Dosen Primary</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
