<script lang="ts">
	import FormPrimaryDosen from '../_component/formPrimaryDosen.svelte';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<svelte:head>
	<title>Tambah Dosen Primary - Admin Portal</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<FormPrimaryDosen
		lecturers={data.lecturers}
		positions={data.positions}
		action="?/create"
		initialLecturerId={form?.values?.lecturerStaffId ?? ''}
		initialPosition={form?.values?.position ?? ''}
		isEdit={false}
	/>
</div>
