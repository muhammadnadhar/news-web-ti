<script lang="ts">
	import { enhance } from '$app/forms';
	import type { HistoryLeadersDTO, LecturerStaffItemDTO } from '$lib/dto/admin/article/profile';
	import { parsePhotoToUrl } from '$lib/utils.js';
	import {
		Calendar,
		Check,
		Search,
		ShieldAlert,
		User,
		UserCheck,
		UserPlus,
		X
	} from 'lucide-svelte';

	type Props = {
		lecturers: LecturerStaffItemDTO[];
		initialData?: HistoryLeadersDTO | null;
		formError?: string | null;
		submitLabel?: string;
		actionUrl?: string;
		onCancel?: () => void;
	};

	let {
		lecturers = [],
		initialData = null,
		formError = null,
		submitLabel = 'Simpan Data Pimpinan',
		actionUrl = '',
		onCancel
	}: Props = $props();

	// Form state
	let period = $state(initialData?.period ?? '');
	let headId = $state<string | null>(initialData?.head_id ?? null);
	let secretaryId = $state<string | null>(initialData?.secretary_id ?? null);

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

<!-- BANYAK PESAN ERROR -->
{#if formError}
	<div
		class="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 shadow-lg shadow-red-500/5 backdrop-blur-sm"
	>
		<ShieldAlert class="h-4 w-4 shrink-0 text-red-400" />
		<div class="leading-relaxed">{formError}</div>
	</div>
{/if}

<form method="POST" action={actionUrl} use:enhance class="space-y-6">
	<!-- Hidden inputs untuk dikirim ke action server -->
	<input type="hidden" name="head_id" value={headId ?? ''} />
	<input type="hidden" name="secretary_id" value={secretaryId ?? ''} />

	<!-- INPUT PERIODE -->
	<div class="space-y-2">
		<label for="period" class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
			<Calendar class="text-scitech-mint h-3.5 w-3.5" />
			<span>Periode Jabatan</span>
			<span class="text-scitech-error">*</span>
		</label>
		<div class="relative">
			<input
				id="period"
				name="period"
				type="text"
				bind:value={period}
				placeholder="Contoh: 2020 - 2024 atau 2024 - Sekarang"
				required
				class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border px-4 py-2.5 text-xs text-text-main placeholder-slate-500 transition-all duration-200 focus:ring-2 focus:outline-none"
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		<!-- SELEKSI KETUA PRODI -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-text-main">Ketua Program Studi</span>
				{#if selectedHead}
					<span
						class="bg-scitech-mint/10 text-scitech-mint rounded-full px-2 py-0.5 text-[10px] font-medium"
					>
						Terpilih
					</span>
				{/if}
			</div>

			{#if selectedHead}
				<div
					class="group border-scitech-mint/40 bg-scitech-navy-glare/80 hover:border-scitech-mint/70 relative flex items-center justify-between rounded-xl border p-3.5 shadow-md backdrop-blur-sm transition-all duration-200"
				>
					<div class="flex items-center gap-3 overflow-hidden">
						<div class="relative shrink-0">
							<img
								src={parsePhotoToUrl(selectedHead.photo_url) || '/images/default-avatar.png'}
								alt={selectedHead.name}
								class="border-scitech-mint/50 h-11 w-11 rounded-full border-2 object-cover shadow-sm"
							/>
							<div
								class="bg-scitech-mint text-scitech-navy absolute -right-0.5 -bottom-0.5 rounded-full p-0.5"
							>
								<Check class="h-2.5 w-2.5 stroke-[3]" />
							</div>
						</div>
						<div class="min-w-0">
							<p class="truncate text-xs font-bold text-text-main">{selectedHead.name}</p>
							<p class="truncate text-[10px] text-slate-400">
								{selectedHead.role}
							</p>
							<p class="font-mono text-[10px] text-slate-500">
								NIDN: {selectedHead.nidn ?? '-'}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-1.5 pl-2">
						<button
							type="button"
							onclick={() => (activePicker = 'head')}
							class="bg-scitech-mint/10 text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors"
						>
							Ubah
						</button>
						<button
							type="button"
							onclick={() => clearSelection('head')}
							title="Hapus pilihan"
							class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				</div>
			{:else}
				<button
					type="button"
					onclick={() => (activePicker = 'head')}
					class="group border-scitech-slate/40 bg-scitech-navy/40 hover:border-scitech-mint/60 hover:bg-scitech-navy/80 hover:text-scitech-mint flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed p-5 text-xs text-slate-400 transition-all duration-200"
				>
					<div
						class="bg-scitech-slate/20 group-hover:bg-scitech-mint/10 group-hover:text-scitech-mint flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors"
					>
						<UserPlus class="h-4 w-4" />
					</div>
					<span class="font-medium">Pilih Ketua Program Studi</span>
				</button>
			{/if}
		</div>

		<!-- SELEKSI SEKRETARIS PRODI -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-text-main">Sekretaris Program Studi</span>
				{#if selectedSecretary}
					<span
						class="bg-scitech-mint/10 text-scitech-mint rounded-full px-2 py-0.5 text-[10px] font-medium"
					>
						Terpilih
					</span>
				{/if}
			</div>

			{#if selectedSecretary}
				<div
					class="group border-scitech-mint/40 bg-scitech-navy-glare/80 hover:border-scitech-mint/70 relative flex items-center justify-between rounded-xl border p-3.5 shadow-md backdrop-blur-sm transition-all duration-200"
				>
					<div class="flex items-center gap-3 overflow-hidden">
						<div class="relative shrink-0">
							<img
								src={parsePhotoToUrl(selectedSecretary.photo_url) || '/images/default-avatar.png'}
								alt={selectedSecretary.name}
								class="border-scitech-mint/50 h-11 w-11 rounded-full border-2 object-cover shadow-sm"
							/>
							<div
								class="bg-scitech-mint text-scitech-navy absolute -right-0.5 -bottom-0.5 rounded-full p-0.5"
							>
								<Check class="h-2.5 w-2.5 stroke-[3]" />
							</div>
						</div>
						<div class="min-w-0">
							<p class="truncate text-xs font-bold text-text-main">{selectedSecretary.name}</p>
							<p class="truncate text-[10px] text-slate-400">
								{selectedSecretary.role}
							</p>
							<p class="font-mono text-[10px] text-slate-500">
								NIDN: {selectedSecretary.nidn ?? '-'}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-1.5 pl-2">
						<button
							type="button"
							onclick={() => (activePicker = 'secretary')}
							class="bg-scitech-mint/10 text-scitech-mint hover:bg-scitech-mint hover:text-scitech-navy rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors"
						>
							Ubah
						</button>
						<button
							type="button"
							onclick={() => clearSelection('secretary')}
							title="Hapus pilihan"
							class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				</div>
			{:else}
				<button
					type="button"
					onclick={() => (activePicker = 'secretary')}
					class="group border-scitech-slate/40 bg-scitech-navy/40 hover:border-scitech-mint/60 hover:bg-scitech-navy/80 hover:text-scitech-mint flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed p-5 text-xs text-slate-400 transition-all duration-200"
				>
					<div
						class="bg-scitech-slate/20 group-hover:bg-scitech-mint/10 group-hover:text-scitech-mint flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors"
					>
						<UserPlus class="h-4 w-4" />
					</div>
					<span class="font-medium">Pilih Sekretaris Program Studi</span>
				</button>
			{/if}
		</div>
	</div>

	<!-- AKSI TOMBOL -->
	<div class="border-scitech-slate/20 flex items-center justify-end gap-3 border-t pt-5">
		{#if onCancel}
			<button
				type="button"
				onclick={onCancel}
				class="border-scitech-slate/30 hover:bg-scitech-slate/20 rounded-xl border px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:text-text-main"
			>
				Batal
			</button>
		{/if}
		<button
			type="submit"
			class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover hover:shadow-scitech-mint/20 rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95"
		>
			{submitLabel}
		</button>
	</div>
</form>

<!-- MODAL PENCARIAN DOSEN & STAF -->
{#if activePicker !== null}
	<!-- Backdrop with dismiss handler -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-all"
		onclick={(e) => e.target === e.currentTarget && closePicker()}
		role="presentation"
	>
		<div
			class="border-scitech-slate/30 bg-scitech-navy-glare w-full max-w-lg space-y-4 rounded-2xl border p-5 shadow-2xl ring-1 ring-white/10"
		>
			<!-- Header Modal -->
			<div class="border-scitech-slate/20 flex items-center justify-between border-b pb-3">
				<div>
					<h3 class="text-sm font-bold text-text-main">
						Pilih {activePicker === 'head' ? 'Ketua Program Studi' : 'Sekretaris Program Studi'}
					</h3>
					<p class="text-[11px] text-slate-400">Cari dan pilih dosen/staf yang akan ditugaskan</p>
				</div>
				<button
					type="button"
					onclick={closePicker}
					class="hover:bg-scitech-slate/20 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-text-main"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- INPUT FILTER PENCARIAN -->
			<div class="relative">
				<Search class="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari berdasarkan nama, NIDN, atau peran..."
					class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border py-2.5 pr-9 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:ring-2 focus:outline-none"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="absolute top-3 right-3 text-slate-500 hover:text-slate-300"
					>
						<X class="h-3.5 w-3.5" />
					</button>
				{/if}
			</div>

			<!-- DAFTAR LIST HASIL FILTER -->
			<div class="max-h-72 space-y-2 overflow-y-auto pr-1">
				{#if filteredLecturers.length === 0}
					<div
						class="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400"
					>
						<User class="mb-2 h-8 w-8 text-slate-600" />
						<p class="font-medium text-slate-300">Tidak ada data ditemukan</p>
						<p class="text-[11px] text-slate-500">Coba sesuaikan kata kunci pencarian Anda.</p>
					</div>
				{:else}
					{#each filteredLecturers as item (item.id)}
						{@const isSelected = (activePicker === 'head' ? headId : secretaryId) === item.id}
						{@const isDisabled = (activePicker === 'head' ? secretaryId : headId) === item.id}

						<button
							type="button"
							disabled={isDisabled}
							onclick={() => selectLeader(item)}
							class="group flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all duration-150 {isSelected
								? 'border-scitech-mint bg-scitech-mint/10 shadow-sm'
								: isDisabled
									? 'bg-scitech-navy/30 cursor-not-allowed border-transparent opacity-40'
									: 'border-scitech-slate/20 bg-scitech-navy hover:border-scitech-mint/40 hover:bg-scitech-navy/80'}"
						>
							<div class="flex items-center gap-3 overflow-hidden">
								<img
									src={parsePhotoToUrl(item.photo_url) || '/images/default-avatar.png'}
									alt={item.name}
									class="border-scitech-slate/30 h-10 w-10 shrink-0 rounded-full border object-cover"
								/>
								<div class="min-w-0">
									<p
										class="group-hover:text-scitech-mint truncate text-xs font-bold text-text-main"
									>
										{item.name}
									</p>
									<p class="truncate text-[10px] text-slate-400">
										{item.role} • <span class="font-mono">NIDN: {item.nidn ?? '-'}</span>
									</p>
								</div>
							</div>

							<div class="flex shrink-0 items-center pl-2">
								{#if isSelected}
									<span
										class="bg-scitech-mint/20 text-scitech-mint flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
									>
										<Check class="h-3 w-3 stroke-[3]" /> Terpilih
									</span>
								{:else if isDisabled}
									<span
										class="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 italic"
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
