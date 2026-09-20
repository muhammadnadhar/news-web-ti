<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import type { ActionData } from './$types';
	import FormUser from '../_component/formUser.svelte';
	import type { ResponseMessage } from '$lib/types/message';

	let { form }: { form: ActionData } = $props();

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);
</script>

<svelte:head>
	<title>Tambah User Baru | Admin SciTech</title>
</svelte:head>

<div class="min-h-screen p-4 text-text-main md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Header Page -->
		<div class="border-scitech-slate/20 flex items-center justify-between border-b pb-4">
			<div class="flex items-center gap-3">
				<button
					type="button"
					onclick={() => goto('/admin/users')}
					class="border-scitech-slate/30 hover:bg-scitech-navy-glare flex h-10 w-10 items-center justify-center rounded-xl border text-slate-300 transition-all hover:text-white"
					title="Kembali"
				>
					<ArrowLeft class="h-5 w-5" />
				</button>
				<div>
					<h1 class="text-2xl font-bold tracking-tight text-text-main">Tambah Pengguna Baru</h1>
					<p class="text-xs text-slate-400">Buat akun pengelola portal berita dan sistem</p>
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
