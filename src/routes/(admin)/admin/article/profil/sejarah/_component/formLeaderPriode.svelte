<script lang="ts">
	import { enhance } from '$app/forms';
	import Message from '$lib/components/admin/message.svelte';
	import type { HistoryLeadersDTO, LecturerStaffItemDTO } from '$lib/dto/admin/article/profile';
	import type { ResponseMessage } from '$lib/types/message';
	import type { HistoryLeaderFormValues } from '$lib/types/values/admin/article';
	import { parsePhotoToUrl } from '$lib/utils.js';
	import { Calendar, Check, Search, ShieldAlert, User, UserPlus, X } from 'lucide-svelte';

	type Props = {
		lecturers: LecturerStaffItemDTO[];
		initialData?: HistoryLeadersDTO | null;
		valueData: HistoryLeaderFormValues | null;
		submitLabel?: string;
		actionUrl?: string;
		onCancel?: () => void;
	};

	let {
		lecturers = [],
		initialData = null,
		valueData,
		submitLabel = 'Simpan Data Pimpinan',
		actionUrl = '',
		onCancel
	}: Props = $props();

	let isSubmitting = $state(false);
	// Form state
	let period = $state(valueData?.period ?? initialData?.period ?? '');
	let headId = $state<string | null>(valueData?.head_id ?? initialData?.head_id ?? null);
	let secretaryId = $state<string | null>(
		valueData?.secretary_id ?? initialData?.secretary_id ?? null
	);

	// Picker Modal State
	let activePicker = $state<'head' | 'secretary' | null>(null);
	let searchQuery = $state('');

	// Dosen/Staff yang terpilih saat ini
	let selectedHead = $derived(lecturers.find((item) => item.id === headId));
	let selectedSecretary = $derived(lecturers.find((item) => item.id === secretaryId));

	// Filter daftar Dosen & Staff berdasarkan pencarian
	let filteredLecturers = $derived(
		lecturers.filter((item) => {
			const query = searchQuery.trim().toLowerCase();
			if (!query) return true;
			return (
				item.name.toLowerCase().includes(query) ||
				(item.nidn && item.nidn.toLowerCase().includes(query)) ||
				item.role.toLowerCase().includes(query)
			);
		})
	);

	// State untuk Pesan/Notifikasi
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	function selectLeader(item: LecturerStaffItemDTO) {
		if (activePicker === 'head') {
			headId = item.id;
		} else if (activePicker === 'secretary') {
			secretaryId = item.id;
		}
		closePicker();
	}

	function clearSelection(type: 'head' | 'secretary') {
		if (type === 'head') headId = null;
		if (type === 'secretary') secretaryId = null;
	}

	function closePicker() {
		activePicker = null;
		searchQuery = '';
	}
</script>

{#if showMessage}
	<div class="mb-6">
		<Message
			status={messageConfig.status}
			title={messageConfig.title}
			message={messageConfig.message}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	</div>
{/if}

<div class="space-y-8 rounded-3xl bg-bg-secondary p-6 shadow-xl transition-all lg:p-10">
	<form
		method="POST"
		action={actionUrl}
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					triggerMessage('success', 'Berhasil', 'Data akreditasi berhasil diperbarui!');
				} else if (result.type === 'error') {
					triggerMessage('error', 'Gagal', 'Terjadi kesalahan saat menyimpan data.');
				}
				await update();
			};
		}}
		class="space-y-6"
	>
		<input type="hidden" name="head_id" value={headId ?? ''} />
		<input type="hidden" name="secretary_id" value={secretaryId ?? ''} />

		<div class="space-y-2">
			<label for="period" class="flex items-center gap-2 text-xs font-semibold text-text-main">
				<div
					class="bg-scitech-mint/10 text-scitech-mint border-scitech-mint/20 flex h-6 w-6 items-center justify-center rounded-lg border"
				>
					<Calendar class="h-3.5 w-3.5" />
				</div>
				<span>Periode Jabatan</span>
				<span class="font-bold text-rose-500">*</span>
			</label>
			<div class="relative">
				<input
					id="period"
					name="period"
					type="text"
					bind:value={period}
					placeholder="Contoh: 2020 - 2024 atau 2024 - Sekarang"
					required
					class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/15 bg-bg-primary px-4 py-3 text-xs text-text-main placeholder-text-main/40 transition-all duration-200 focus:ring-2 focus:outline-none"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- ==================== SELEKSI KETUA PRODI ==================== -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-text-main">Ketua Program Studi</span>
					{#if selectedHead}
						<span
							class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
						>
							Terpilih
						</span>
					{/if}
				</div>

				{#if selectedHead}
					<div
						class="group border-scitech-mint/40 hover:border-scitech-mint/70 relative flex items-center justify-between rounded-2xl border bg-bg-primary/80 p-4 shadow-md backdrop-blur-sm transition-all duration-200"
					>
						<div class="flex items-center gap-3.5 overflow-hidden">
							<div class="relative shrink-0">
								<img
									src={parsePhotoToUrl(selectedHead.photo_url) || '/images/default-avatar.png'}
									alt={selectedHead.name}
									class="border-scitech-mint/50 h-12 w-12 rounded-full border-2 object-cover shadow-sm"
								/>
								<div
									class="bg-scitech-mint absolute -right-0.5 -bottom-0.5 rounded-full p-0.5 text-bg-primary shadow"
								>
									<Check class="h-2.5 w-2.5 stroke-[3]" />
								</div>
							</div>
							<div class="min-w-0">
								<p class="truncate text-xs font-bold text-text-main">{selectedHead.name}</p>
								<p class="mt-0.5 truncate text-[10px] text-text-main/60">
									{selectedHead.role}
								</p>
								<p class="mt-0.5 font-mono text-[10px] text-text-main/40">
									NIDN: {selectedHead.nidn ?? '-'}
								</p>
							</div>
						</div>

						<div class="flex items-center gap-2 pl-2">
							<button
								type="button"
								onclick={() => (activePicker = 'head')}
								class="border-scitech-mint/20 bg-scitech-mint/10 text-scitech-mint hover:bg-scitech-mint rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:text-bg-primary"
							>
								Ubah
							</button>
							<button
								type="button"
								onclick={() => clearSelection('head')}
								title="Hapus pilihan"
								class="rounded-xl border border-border-color/10 bg-bg-primary p-2 text-text-main/50 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
							>
								<X class="h-4 w-4" />
							</button>
						</div>
					</div>
				{:else}
					<button
						type="button"
						onclick={() => (activePicker = 'head')}
						class="group hover:border-scitech-mint/60 hover:text-scitech-mint flex w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed border-border-color/20 bg-bg-primary/40 p-6 text-xs text-text-main/60 transition-all duration-200 hover:bg-bg-primary/80"
					>
						<div
							class="group-hover:border-scitech-mint/30 group-hover:bg-scitech-mint/10 group-hover:text-scitech-mint flex h-9 w-9 items-center justify-center rounded-xl border border-border-color/10 bg-bg-secondary text-text-main/50 transition-colors"
						>
							<UserPlus class="h-4 w-4" />
						</div>
						<span class="font-semibold">Pilih Ketua Program Studi</span>
					</button>
				{/if}
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-text-main">Sekretaris Program Studi</span>
					{#if selectedSecretary}
						<span
							class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
						>
							Terpilih
						</span>
					{/if}
				</div>

				{#if selectedSecretary}
					<div
						class="group border-scitech-mint/40 hover:border-scitech-mint/70 relative flex items-center justify-between rounded-2xl border bg-bg-primary/80 p-4 shadow-md backdrop-blur-sm transition-all duration-200"
					>
						<div class="flex items-center gap-3.5 overflow-hidden">
							<div class="relative shrink-0">
								<img
									src={parsePhotoToUrl(selectedSecretary.photo_url) || '/images/default-avatar.png'}
									alt={selectedSecretary.name}
									class="border-scitech-mint/50 h-12 w-12 rounded-full border-2 object-cover shadow-sm"
								/>
								<div
									class="bg-scitech-mint absolute -right-0.5 -bottom-0.5 rounded-full p-0.5 text-bg-primary shadow"
								>
									<Check class="h-2.5 w-2.5 stroke-[3]" />
								</div>
							</div>
							<div class="min-w-0">
								<p class="truncate text-xs font-bold text-text-main">{selectedSecretary.name}</p>
								<p class="mt-0.5 truncate text-[10px] text-text-main/60">
									{selectedSecretary.role}
								</p>
								<p class="mt-0.5 font-mono text-[10px] text-text-main/40">
									NIDN: {selectedSecretary.nidn ?? '-'}
								</p>
							</div>
						</div>

						<div class="flex items-center gap-2 pl-2">
							<button
								type="button"
								onclick={() => (activePicker = 'secretary')}
								class="border-scitech-mint/20 bg-scitech-mint/10 text-scitech-mint hover:bg-scitech-mint rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:text-bg-primary"
							>
								Ubah
							</button>
							<button
								type="button"
								onclick={() => clearSelection('secretary')}
								title="Hapus pilihan"
								class="rounded-xl border border-border-color/10 bg-bg-primary p-2 text-text-main/50 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
							>
								<X class="h-4 w-4" />
							</button>
						</div>
					</div>
				{:else}
					<button
						type="button"
						onclick={() => (activePicker = 'secretary')}
						class="group hover:border-scitech-mint/60 hover:text-scitech-mint flex w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed border-border-color/20 bg-bg-primary/40 p-6 text-xs text-text-main/60 transition-all duration-200 hover:bg-bg-primary/80"
					>
						<div
							class="group-hover:border-scitech-mint/30 group-hover:bg-scitech-mint/10 group-hover:text-scitech-mint flex h-9 w-9 items-center justify-center rounded-xl border border-border-color/10 bg-bg-secondary text-text-main/50 transition-colors"
						>
							<UserPlus class="h-4 w-4" />
						</div>
						<span class="font-semibold">Pilih Sekretaris Program Studi</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- ==================== TOMBOL AKSI ==================== -->
		<div class="flex items-center justify-end gap-3 border-t border-border-color/10 pt-5">
			{#if onCancel}
				<button
					type="button"
					onclick={onCancel}
					class="rounded-xl border border-border-color/15 bg-bg-primary px-5 py-2.5 text-xs font-semibold text-text-main/70 transition-colors hover:bg-bg-primary/80 hover:text-text-main"
				>
					Batal
				</button>
			{/if}
			<button
				type="submit"
				disabled={isSubmitting}
				class="shadow-scitech-mint/20 hover:bg-scitech-mint/90 rounded-xl bg-bg-primary px-6 py-2.5 text-xs font-bold text-text-main shadow-lg transition-all active:scale-95"
			>
				<span>{isSubmitting ? 'Menyimpan...' : submitLabel}</span>
			</button>
		</div>
	</form>

	<!-- ==================== MODAL PENCARIAN DOSEN & STAF ==================== -->
	{#if activePicker !== null}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 p-4 backdrop-blur-md transition-all"
			onclick={(e) => e.target === e.currentTarget && closePicker()}
			role="presentation"
		>
			<div
				class="w-full max-w-lg space-y-4 rounded-3xl border border-border-color/15 bg-bg-secondary p-6 shadow-2xl ring-1 ring-white/10"
			>
				<!-- Header Modal -->
				<div class="flex items-center justify-between border-b border-border-color/10 pb-4">
					<div>
						<h3 class="text-sm font-bold text-text-main">
							Pilih {activePicker === 'head' ? 'Ketua Program Studi' : 'Sekretaris Program Studi'}
						</h3>
						<p class="mt-0.5 text-[11px] text-text-main/60">
							Cari dan pilih dosen/staf yang akan ditugaskan
						</p>
					</div>
					<button
						type="button"
						onclick={closePicker}
						class="rounded-xl border border-border-color/10 bg-bg-primary p-2 text-text-main/60 transition-colors hover:bg-bg-primary/80 hover:text-text-main"
					>
						<X class="h-4 w-4" />
					</button>
				</div>

				<!-- Input Filter Pencarian -->
				<div class="relative">
					<Search class="absolute top-3.5 left-3.5 h-4 w-4 text-text-main/40" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari berdasarkan nama, NIDN, atau peran..."
						class="focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/15 bg-bg-primary py-3 pr-9 pl-10 text-xs text-text-main placeholder-text-main/40 transition-all focus:ring-2 focus:outline-none"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={() => (searchQuery = '')}
							class="absolute top-3.5 right-3.5 text-text-main/40 hover:text-text-main"
						>
							<X class="h-3.5 w-3.5" />
						</button>
					{/if}
				</div>

				<div
					class="max-h-72 scrollbar-none space-y-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
				>
					{#if filteredLecturers.length === 0}
						<div
							class="flex flex-col items-center justify-center py-10 text-center text-xs text-text-main/60"
						>
							<div
								class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-bg-primary text-text-main/40"
							>
								<User class="h-5 w-5" />
							</div>
							<p class="font-semibold text-text-main">Tidak ada data ditemukan</p>
							<p class="mt-0.5 text-[11px] text-text-main/50">
								Coba sesuaikan kata kunci pencarian Anda.
							</p>
						</div>
					{:else}
						{#each filteredLecturers as item (item.id)}
							{@const isSelected = (activePicker === 'head' ? headId : secretaryId) === item.id}
							{@const isDisabled = (activePicker === 'head' ? secretaryId : headId) === item.id}

							<button
								type="button"
								disabled={isDisabled}
								onclick={() => selectLeader(item)}
								class="group flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-150 {isSelected
									? 'border-scitech-mint bg-scitech-mint/10 shadow-sm'
									: isDisabled
										? 'cursor-not-allowed border-transparent bg-bg-primary/20 opacity-40'
										: 'hover:border-scitech-mint/40 border-border-color/10 bg-bg-primary hover:bg-bg-primary/80'}"
							>
								<div class="flex items-center gap-3 overflow-hidden">
									<img
										src={parsePhotoToUrl(item.photo_url) || '/images/default-avatar.png'}
										alt={item.name}
										class="h-10 w-10 shrink-0 rounded-full border border-border-color/15 object-cover"
									/>
									<div class="min-w-0">
										<p
											class="group-hover:text-scitech-mint truncate text-xs font-bold text-text-main transition-colors"
										>
											{item.name}
										</p>
										<p class="mt-0.5 truncate text-[10px] text-text-main/60">
											{item.role} • <span class="font-mono">NIDN: {item.nidn ?? '-'}</span>
										</p>
									</div>
								</div>

								<div class="flex shrink-0 items-center pl-2">
									{#if isSelected}
										<span
											class="border-scitech-mint/30 bg-scitech-mint/20 text-scitech-mint flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
										>
											<Check class="h-3 w-3 stroke-[3]" /> Terpilih
										</span>
									{:else if isDisabled}
										<span
											class="rounded-lg border border-border-color/10 bg-bg-secondary px-2 py-0.5 text-[10px] text-text-main/40 italic"
										>
											Dipilih di jabatan lain
										</span>
									{/if}
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
