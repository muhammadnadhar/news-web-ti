<script lang="ts">
    import FormEditor from '$lib/components/admin/formEditor.svelte';
    import { Save, UploadCloud, FileCheck2, Trash2 } from 'lucide-svelte';

    // Props dari SvelteKit PageData
    let { data } = $props();

    // Local States
    let title = $state('Akreditasi');
    let description = $state(data?.accreditation?.description ?? '');
    let imageUrl = $state<string | null>(data?.accreditation?.image_url ?? null);
    let selectedFile = $state<File | null>(null);
    let previewUrl = $state<string | null>(data?.accreditation?.image_url ?? null);
    let isSubmitting = $state(false);

    // Handle Image Preview saat memilih file baru
    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            selectedFile = file;
            previewUrl = URL.createObjectURL(file);
        }
    }

    // Submit handler
    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        isSubmitting = true;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        // Logic submit action via fetch atau SvelteKit form actions
        setTimeout(() => {
            isSubmitting = false;
            alert('Data Akreditasi berhasil diperbarui!');
        }, 800);
    }
</script>

<div class="p-6 lg:p-10 space-y-8">
    <!-- PAGE TITLE -->
    <div class="border-scitech-slate/20 flex items-center justify-between border-b pb-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-white">Akreditasi</h1>
            <p class="text-text-muted text-xs sm:text-sm">Kelola sertifikat dan informasi akreditasi Program Studi TI.</p>
        </div>
        <button
            type="submit"
            form="accreditation-form"
            disabled={isSubmitting}
            class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
            <Save class="h-4 w-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
    </div>

    <!-- FORM UTAMA -->
    <form id="accreditation-form" onsubmit={handleSubmit} class="space-y-8">
        <div class="border-scitech-slate/20 bg-scitech-navy-glare rounded-2xl border p-6 shadow-xl">
            <h2 class="text-scitech-mint mb-6 text-sm font-semibold">Form Ubah Data Akreditasi</h2>

            <!-- GRID BAGIAN ATAS: INPUT JUDUL & FOTO PREVIEW -->
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                <!-- KIRI: INPUT JUDUL -->
                <div class="space-y-2 lg:col-span-5">
                    <label for="title" class="text-text-main text-xs font-medium">
                        Judul<span class="text-scitech-error">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        bind:value={title}
                        required
                        class="border-scitech-slate/30 bg-scitech-navy text-text-main w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:border-scitech-mint focus:outline-none"
                        placeholder="Contoh: Akreditasi Program Studi"
                    />
                </div>

                <!-- KANAN: INPUT & PREVIEW SERTIFIKAT -->
                <div class="space-y-3 lg:col-span-7">
                    <label for="image-upload" class="text-text-main text-xs font-medium">Foto Sertifikat</label>
                    
                    <div class="flex flex-col gap-4">
                        <!-- Custom File Input -->
                        <div class="flex items-center gap-3">
                            <label
                                for="image-upload"
                                class="bg-scitech-slate hover:bg-scitech-slate/80 text-text-main inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-medium transition-all"
                            >
                                <UploadCloud class="text-scitech-cyan h-4 w-4" />
                                <span>Browse File...</span>
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onchange={handleFileSelect}
                                class="hidden"
                            />
                            <span class="text-text-muted truncate text-xs">
                                {selectedFile ? selectedFile.name : 'Belum ada file baru dipilih'}
                            </span>
                        </div>

                        <!-- Certificate Image Preview Box -->
                        <div class="border-scitech-slate/30 bg-scitech-navy relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border p-4">
                            {#if previewUrl}
                                <img
                                    src={previewUrl}
                                    alt="Sertifikat Akreditasi"
                                    class="max-h-[450px] w-auto rounded-lg object-contain shadow-md"
                                />
                            {:else}
                                <div class="text-text-muted flex flex-col items-center gap-2 text-center text-xs">
                                    <FileCheck2 class="h-10 w-10 opacity-30" />
                                    <span>Sertifikat belum diunggah</span>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- bottom section: isi akreditasi (rich text editor) -->
        <div class="border-scitech-slate/20 bg-scitech-navy-glare rounded-2xl border p-6 shadow-xl">
            <label for="description" class="text-text-main mb-3 block text-xs font-medium">
                Isi Akreditasi<span class="text-scitech-error">*</span>
            </label>

            <!-- memanggil component editor di paling bawah -->
            <FormEditor bind:value={description} />
        </div>
    </form>
</div>
