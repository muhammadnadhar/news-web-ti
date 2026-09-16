<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import FormSemester from '../../_component/formSemester.svelte';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<FormSemester
	{form}
	isEdit={true}
	title="Edit Data Semester"
	backUrl="/admin/akademik/semester"
	initialData={{
		name: data.semester.name,
		academicYear: data.semester.academic_year,
		isActive: data.semester.is_active === 'y' || data.semester.is_active === true
	}}
/>
