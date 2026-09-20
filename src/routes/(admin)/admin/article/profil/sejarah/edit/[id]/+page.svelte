<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { ArrowLeft } from 'lucide-svelte';
	import FormLeaderPriode from '../../_component/formLeaderPriode.svelte';
	import { mergeNewPath } from '$lib/utils.js';

    let { data, form } = $props();

    // Data lama yang akan diedit
    let initialData = $derived(data.historyLeader);
</script>

<svelte:head>
    <title>Edit Pimpinan Jurusan Periode {initialData.period} | Admin SciTech</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-10">
    <div class="flex items-center justify-between border-b border-scitech-slate/20 pb-4">
        <div class="flex items-center gap-3">
           
                <h1 class="text-2xl font-bold tracking-tight text-text-main">Edit Pimpinan Jurusan</h1>
                <p class="text-xs text-slate-400">Memperbarui data pimpinan untuk periode {initialData.period}</p>
            </div>
    </div>

    <!-- wrapper form -->
    <div class="max-w-2xl rounded-2xl border border-scitech-slate/20 bg-scitech-navy-glare p-6 shadow-xl">
        <FormLeaderPriode
            lecturers={data.lecturers}
            {initialData} 
            formError={form?.message}
            submitLabel="Perbarui Data Pimpinan"
            onCancel={() => history.back()}
        />
    </div>
</div>
