<script lang="ts">
	import type { ActionData } from './$types';
	import FormUser from '../_component/formUser.svelte';

	let { form }: { form: ActionData } = $props();

</script>

<svelte:head>
	<title>Tambah User Baru | Admin SciTech</title>
</svelte:head>

<div class="min-h-screen p-4 text-text-main md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Header Page -->
		<div class="border-scitech-slate/20 flex items-center justify-between pb-4">
			<div class="flex items-center gap-3">
				<div>
					<h1 class="text-2xl font-bold tracking-tight text-text-main">Tambah Pengguna Baru</h1>
					<p class="text-xs text-text-main">Buat akun pengelola portal berita dan sistem</p>
				</div>
			</div>
		</div>

		<FormUser
			initialData={form?.values}
			formError={form?.error}
			isEditMode={false}
			submitLabel="Simpan User Baru"
			onCancel={() => history.back()}
		/>
	</div>
</div>
