<script lang="ts">
	import FormMshPublish from '../../_component/formMshPublish.svelte';
    import type { PageData, ActionData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
    <title>Edit Publikasi Mahasiswa | Admin SciTech</title>
</svelte:head>

<FormMshPublish initialData={data.studentPublication} isEdit={true} {form} />
