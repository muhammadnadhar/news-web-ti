<script lang="ts">
	import { enhance } from '$app/forms';
	import { UserCheck, User, Send, Search, CheckCircle2, Award } from 'lucide-svelte';
	import Message from '$lib/components/admin/message.svelte';
	import SelectJabatan from '../../../dataset/jabatan-prodi/_component/selectJabatan.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import type { LecturerStaffItemDTO } from '$lib/dto/admin/article/profile';

	interface Position {
		id: string;
		name: string;
		[key: string]: any;
	}

	interface Props {
		lecturers: LecturerStaffItemDTO[];
		positions: Position[];
		action: string;
		initialLecturerId?: string;
		initialPosition?: string;
		isEdit?: boolean;
		submitText?: string;
		idPrimary?: string;
	}

	let {
		lecturers = [],
		positions = [],
		action,
		initialLecturerId = '',
		initialPosition = '',
		isEdit = false,
		submitText,
		idPrimary = ''
	}: Props = $props();

	let selectedLecturerId = $state(initialLecturerId);
	let selectedPosition = $state(initialPosition);
	let searchQuery = $state('');
	let isSubmitting = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	let filteredLecturers = $derived(
		lecturers.filter(
			(lecturer) =>
				lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(lecturer.nidn && lecturer.nidn.includes(searchQuery)) ||
				lecturer.expertise.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let selectedLecturer = $derived(lecturers.find((l) => l.id === selectedLecturerId));
</script>

{#if showMessage}
	<Message
		status={messageConfig.status}
		title={messageConfig.title}
		message={messageConfig.message}
		dismissible={true}
		timeout={4000}
		onclose={() => (showMessage = false)}
	/>
{/if}

<div class="overflow-hidden rounded-2xl border border-border-light bg-bg-secondary shadow-2xl">
	<!-- Header -->
	<div class="border-b border-border-light bg-bg-secondary/80 px-6 py-4 backdrop-blur">
		<h2 class="flex items-center gap-2 text-base font-semibold text-accent-blue">
			<UserCheck class="h-5 w-5 text-accent-blue" />
			<span
				>{isEdit
					? 'Edit Slot Dosen Primary / Struktural'
					: 'Tambah Slot Dosen Primary / Struktural'}</span
			>
		</h2>
	</div>

	<!-- Form -->
	<form
		method="POST"
		{action}
		use:enhance={() => {
			isSubmitting = true;

			return async ({ result, update }) => {
				isSubmitting = false;

				if (result.type === 'success') {
					const resData = result.data as any;
					const msgText =
						resData?.message?.text ||
						resData?.message ||
						(isEdit ? 'Data berhasil diperbarui!' : 'Data Dosen Primary berhasil disimpan!');
					triggerMessage('success', 'Berhasil', msgText);
				} else if (result.type === 'failure') {
					const resData = result.data as any;
					const msgText = resData?.message?.text || resData?.message || 'Gagal menyimpan data.';
					triggerMessage('error', 'Gagal', msgText);
				} else if (result.type === 'error') {
					triggerMessage('error', 'Error', 'Terjadi kesalahan sistem pada server.');
				}

				await update({ reset: false });
			};
		}}
		class="space-y-6 p-6"
	>
		{#if isEdit && idPrimary}
			<input type="hidden" name="id" value={idPrimary} />
		{/if}
		<input type="hidden" name="lecturer_staff_id" value={selectedLecturerId} />

		<!-- Step 1: Pilih Jabatan Prodi -->
		<div class="rounded-xl border border-border-light bg-bg-primary-glare/60 p-4 shadow-inner">
			<h3
				class="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-text-muted uppercase"
			>
				<Award class="h-4 w-4 text-accent-blue" />
				<span>1. Tentukan Jabatan Struktural</span>
			</h3>
			<SelectJabatan {positions} bind:selectedPosition />
		</div>

		<!-- Step 2: Pilih Dosen / Staff -->
		<div
			class="space-y-3 rounded-xl border border-border-light bg-bg-primary-glare/60 p-4 shadow-inner"
		>
			<h3
				class="flex items-center gap-2 text-xs font-bold tracking-wider text-text-muted uppercase"
			>
				<User class="h-4 w-4 text-accent-blue" />
				<span>2. Pilih Dosen / Staff</span>
			</h3>

			<!-- Search Box -->
			<div class="relative">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari Dosen berdasarkan Nama, NIDN, atau Keahlian..."
					class="w-full rounded-xl border border-border-light bg-bg-primary py-2.5 pr-3 pl-9 text-xs text-text-main placeholder-text-muted transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none"
				/>
				<Search class="absolute top-3 left-3 h-3.5 w-3.5 text-text-muted" />
			</div>

			<!-- List Card Dosen -->
			<div class="max-h-72 space-y-2 overflow-y-auto pr-1">
				{#if filteredLecturers.length === 0}
					<div class="py-8 text-center text-xs text-text-muted">Dosen tidak ditemukan.</div>
				{:else}
					{#each filteredLecturers as lecturer (lecturer.id)}
						<button
							type="button"
							onclick={() => (selectedLecturerId = lecturer.id)}
							class="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all {selectedLecturerId ===
							lecturer.id
								? 'border-accent-blue bg-accent-blue-dim shadow-sm'
								: 'border-border-light bg-bg-primary/70 hover:border-border-color hover:bg-bg-secondary-hover'}"
						>
							<div class="flex items-center gap-3">
								<div
									class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-light bg-bg-primary-glare"
								>
									{#if lecturer.photo_url}
										<img
											src={lecturer.photo_url}
											alt={lecturer.name}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center text-text-muted">
											<User class="h-5 w-5 opacity-40" />
										</div>
									{/if}
								</div>
								<div>
									<p class="text-xs font-semibold text-text-main">
										{lecturer.name}
									</p>
									<p class="text-[11px] text-text-muted">
										NIDN: {lecturer.nidn || '-'} • Bidang: {lecturer.expertise}
									</p>
								</div>
							</div>

							{#if selectedLecturerId === lecturer.id}
								<CheckCircle2 class="h-5 w-5 shrink-0 text-accent-blue" />
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Preview Ringkasan -->
		{#if selectedLecturer && selectedPosition}
			<div class="rounded-xl border border-accent-blue/30 bg-accent-blue-dim p-4">
				<p class="text-xs font-semibold text-accent-blue">Ringkasan Penetapan:</p>
				<p class="mt-1 text-xs text-text-muted">
					<span class="font-bold text-text-main">{selectedLecturer.name}</span> akan ditetapkan
					sebagai
					<span class="font-bold text-accent-blue">{selectedPosition}</span>.
				</p>
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3 border-t border-border-light pt-4">
			<button
				type="button"
				onclick={() => history.back()}
				class="rounded-xl border border-border-light bg-bg-primary-glare px-5 py-2.5 text-xs font-medium text-text-main transition-all hover:bg-bg-secondary-hover focus:outline-none disabled:opacity-50"
			>
				Batal
			</button>

			<button
				type="submit"
				disabled={isSubmitting || !selectedLecturerId || !selectedPosition}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-accent-blue-hover focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isSubmitting}
					<span>Memproses...</span>
				{:else}
					<Send class="h-4 w-4" />
					<span>{submitText ?? (isEdit ? 'Perbarui Dosen Primary' : 'Simpan Dosen Primary')}</span>
				{/if}
			</button>
		</div>
	</form>
</div>
