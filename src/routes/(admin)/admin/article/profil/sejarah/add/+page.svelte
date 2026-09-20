<script lang="ts">
    import { goto } from '$app/navigation';
    import { ArrowLeft } from 'lucide-svelte';
	import FormLeaderPriode from '../_component/formLeaderPriode.svelte';

    let { data, form } = $props();
</script>

<div class="space-y-6 p-6 lg:p-10">
    <div class="flex items-center justify-between border-b border-scitech-slate/20 pb-4">
        <div class="flex items-center gap-3">
            <button
                type="button"
                onclick={() => goto('/admin/profile/history')}
                class="rounded-xl border border-scitech-slate/30 p-2 text-slate-300 hover:bg-scitech-navy-glare hover:text-text-main"
            >
                <ArrowLeft class="h-4 w-4" />
            </button>
            <h1 class="text-2xl font-bold tracking-tight text-text-main">Tambah Pimpinan Jurusan</h1>
        </div>
    </div>

    <!-- WRAPPER FORM -->
    <div class="max-w-2xl rounded-2xl border border-scitech-slate/20 bg-scitech-navy-glare p-6 shadow-xl">
        <FormLeaderPriode
            lecturers={data.lecturers}
            formError={form?.message}
            submitLabel="Simpan Data Pimpinan"
            onCancel={() => goto('/admin/profile/history')}
        />
    </div>
</div>
