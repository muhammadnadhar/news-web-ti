<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import FormSemester from '../../_component/formSemester.svelte';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<FormSemester
	valuesData={form?.values}
	isEdit={true}
	title="Edit Data Semester"
	backUrl="/admin/akademik/semester"
	initialData={{
		name: data.semester.name,
		academic_year: data.semester.academic_year,
		is_active: data.semester.is_active === 'y' || data.semester.is_active === true
	}}
/>
