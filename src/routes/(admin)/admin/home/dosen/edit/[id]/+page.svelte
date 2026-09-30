<script lang="ts">
	import FormPrimaryDosen from '../../_component/formPrimaryDosen.svelte';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<svelte:head>
	<title>Edit Dosen Primary - Admin Portal</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<FormPrimaryDosen
		lecturers={data.lecturers}
		positions={data.positions}
		action="?/update"
		idPrimary={data.primaryLecturer?.id ?? ''}
		initialLecturerId={form?.values?.lecturerStaffId ?? data.primaryLecturer?.lecturerStaffId ?? ''}
		initialPosition={form?.values?.position ?? data.primaryLecturer?.position ?? ''}
		isEdit={true}
		submitText="Perbarui Dosen Primary"
	/>
</div>
