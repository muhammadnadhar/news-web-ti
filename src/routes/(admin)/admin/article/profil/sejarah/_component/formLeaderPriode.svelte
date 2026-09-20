<script lang="ts">
    import { enhance } from '$app/forms';
	import type { HistoryLeadersDTO, LecturerStaffItemDTO } from '$lib/dto/admin/article/profile';
    import { parsePhotoToUrl } from '$lib/utils.js';
    import { ArrowLeft, Check, Search, UserCheck, X } from 'lucide-svelte';

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
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                item.name.toLowerCase().includes(query) ||
                (item.nidn && item.nidn.toLowerCase().includes(query)) ||
                item.role.toLowerCase().includes(query);

            return matchesSearch;
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

{#if formError}
    <div class="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
        {formError}
    </div>
{/if}

<form method="POST" action={actionUrl} use:enhance class="space-y-6">
    <!-- Hidden inputs untuk dikirim ke action server -->
    <input type="hidden" name="head_id" value={headId ?? ''} />
    <input type="hidden" name="secretary_id" value={secretaryId ?? ''} />

    <!-- INPUT PERIODE -->
    <div class="space-y-2">
        <label for="period" class="text-xs font-medium text-text-main">
            Periode Jabatan <span class="text-scitech-error">*</span>
        </label>
        <input
            id="period"
            name="period"
            type="text"
            bind:value={period}
            placeholder="Contoh: 2020 - 2024 atau 2024 - Sekarang"
            required
            class="w-full rounded-xl border border-scitech-slate/30 bg-scitech-navy px-4 py-2.5 text-xs text-text-main placeholder-slate-500 focus:border-scitech-mint focus:outline-none"
        />
    </div>

    <!-- SELEKSI KETUA PRODI -->
    <div class="space-y-2">
        <span class="text-xs font-medium text-text-main">Ketua Program Studi</span>
        {#if selectedHead}
            <div class="flex items-center justify-between rounded-xl border border-scitech-mint/30 bg-scitech-navy p-3">
                <div class="flex items-center gap-3">
                    <img
                        src={parsePhotoToUrl(selectedHead.photo_url) || '/images/default-avatar.png'}
                        alt={selectedHead.name}
                        class="h-10 w-10 rounded-full object-cover border border-scitech-mint/40"
                    />
                    <div>
                        <p class="text-xs font-semibold text-text-main">{selectedHead.name}</p>
                        <p class="text-[10px] text-slate-400">
                            {selectedHead.role} • NIDN: {selectedHead.nidn ?? '-'}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        onclick={() => (activePicker = 'head')}
                        class="text-xs text-scitech-mint hover:underline"
                    >
                        Ubah
                    </button>
                    <button
                        type="button"
                        onclick={() => clearSelection('head')}
                        class="text-slate-400 hover:text-red-400"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        {:else}
            <button
                type="button"
                onclick={() => (activePicker = 'head')}
                class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-scitech-slate/40 bg-scitech-navy/50 p-4 text-xs text-slate-400 transition-all hover:border-scitech-mint/50 hover:text-scitech-mint"
            >
                <UserCheck class="h-4 w-4" />
                <span>Pilih Ketua Program Studi</span>
            </button>
        {/if}
    </div>

    <!-- SELEKSI SEKRETARIS PRODI -->
    <div class="space-y-2">
        <span class="text-xs font-medium text-text-main">Sekretaris Program Studi</span>
        {#if selectedSecretary}
            <div class="flex items-center justify-between rounded-xl border border-scitech-mint/30 bg-scitech-navy p-3">
                <div class="flex items-center gap-3">
                    <img
                        src={parsePhotoToUrl(selectedSecretary.photo_url) || '/images/default-avatar.png'}
                        alt={selectedSecretary.name}
                        class="h-10 w-10 rounded-full object-cover border border-scitech-mint/40"
                    />
                    <div>
                        <p class="text-xs font-semibold text-text-main">{selectedSecretary.name}</p>
                        <p class="text-[10px] text-slate-400">
                            {selectedSecretary.role} • NIDN: {selectedSecretary.nidn ?? '-'}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        onclick={() => (activePicker = 'secretary')}
                        class="text-xs text-scitech-mint hover:underline"
                    >
                        Ubah
                    </button>
                    <button
                        type="button"
                        onclick={() => clearSelection('secretary')}
                        class="text-slate-400 hover:text-red-400"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        {:else}
            <button
                type="button"
                onclick={() => (activePicker = 'secretary')}
                class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-scitech-slate/40 bg-scitech-navy/50 p-4 text-xs text-slate-400 transition-all hover:border-scitech-mint/50 hover:text-scitech-mint"
            >
                <UserCheck class="h-4 w-4" />
                <span>Pilih Sekretaris Program Studi</span>
            </button>
        {/if}
    </div>

    <!-- AKSI TOMBOL -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-scitech-slate/20">
        {#if onCancel}
            <button
                type="button"
                onclick={onCancel}
                class="rounded-xl border border-scitech-slate/30 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
                Batal
            </button>
        {/if}
        <button
            type="submit"
            class="rounded-xl bg-scitech-mint px-5 py-2 text-xs font-bold text-scitech-navy hover:bg-scitech-mint-hover transition-all active:scale-95"
        >
            {submitLabel}
        </button>
    </div>
</form>

<!-- MODAL PENCARIAN DOSEN & STAF -->
{#if activePicker !== null}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-lg rounded-2xl border border-scitech-slate/30 bg-scitech-navy-glare p-6 shadow-2xl space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-text-main">
                    Pilih {activePicker === 'head' ? 'Ketua Program Studi' : 'Sekretaris Program Studi'}
                </h3>
                <button type="button" onclick={closePicker} class="text-slate-400 hover:text-text-main">
                    <X class="h-5 w-5" />
                </button>
            </div>

            <!-- INPUT FILTER PENCARIAN -->
            <div class="relative">
                <Search class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Cari berdasarkan nama, NIDN, atau peran..."
                    class="w-full rounded-xl border border-scitech-slate/30 bg-scitech-navy pl-9 pr-4 py-2 text-xs text-text-main placeholder-slate-500 focus:border-scitech-mint focus:outline-none"
                />
            </div>

            <!-- DAFTAR LIST HASIL FILTER -->
            <div class="max-h-64 space-y-2 overflow-y-auto pr-1">
                {#if filteredLecturers.length === 0}
                    <div class="p-6 text-center text-xs text-slate-400">
                        Tidak ada data Dosen / Staf yang sesuai pencarian.
                    </div>
                {:else}
                    {#each filteredLecturers as item (item.id)}
                        {@const isSelected = (activePicker === 'head' ? headId : secretaryId) === item.id}
                        {@const isDisabled = (activePicker === 'head' ? secretaryId : headId) === item.id}
                        
                        <button
                            type="button"
                            disabled={isDisabled}
                            onclick={() => selectLeader(item)}
                            class="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all {
                                isSelected
                                    ? 'border-scitech-mint bg-scitech-mint/10'
                                    : isDisabled
                                      ? 'opacity-40 cursor-not-allowed border-transparent'
                                      : 'border-scitech-slate/20 bg-scitech-navy hover:border-scitech-mint/40 hover:bg-scitech-navy/80'
                            }"
                        >
                            <div class="flex items-center gap-3">
                                <img
                                    src={parsePhotoToUrl(item.photo_url) || '/images/default-avatar.png'}
                                    alt={item.name}
                                    class="h-9 w-9 rounded-full object-cover border border-scitech-slate/30"
                                />
                                <div>
                                    <p class="text-xs font-semibold text-text-main">{item.name}</p>
                                    <p class="text-[10px] text-slate-400">
                                        {item.role} • NIDN: {item.nidn ?? '-'}
                                    </p>
                                </div>
                            </div>
                            {#if isSelected}
                                <Check class="h-4 w-4 text-scitech-mint" />
                            {/if}
                            {#if isDisabled}
                                <span class="text-[10px] italic text-slate-500">Sudah dipilih</span>
                            {/if}
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
{/if}
