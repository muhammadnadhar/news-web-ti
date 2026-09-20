<script lang="ts">
	import FormUser from '../../_component/formUser.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Edit User {data.user?.name} | Admin SciTech</title>
</svelte:head>

<div class="min-h-screen p-4 text-text-main md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<div class="border-scitech-slate/20 flex items-center justify-between border-b pb-4">
			<div class="flex items-center gap-3">
				<div>
					<h1 class="text-2xl font-bold tracking-tight text-text-main">Edit Pengguna</h1>
					<p class="text-xs text-slate-400">Perbarui informasi dan hak akses pengguna</p>
				</div>
			</div>
		</div>

		<!-- Component UserForm (Mode Edit) -->
		<FormUser
			initialData={form?.values ?? data.user}
			formError={form?.error}
			isEditMode={true}
			submitLabel="Perbarui Data User"
			onCancel={() => history.back()}
		/>
	</div>
</div>
