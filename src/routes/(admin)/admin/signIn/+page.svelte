<script lang="ts">
	import { enhance } from '$app/forms';
	import { Mail, Lock, LogIn, AlertCircle } from 'lucide-svelte';
	import type { ActionData } from './$types';

	import uinIcon from '$lib/assets/uin-icon.svg'; // Sesuaikan path
	import type { MessageStatus } from '$lib/types/message';
	import { goto } from '$app/navigation';
	import Message from '$lib/components/admin/message.svelte';

	let { form }: { form: ActionData } = $props();
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<{
		status: MessageStatus;
		title: string;
		message: string;
	}>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<svelte:head>
	<title>Sign In | Admin Portal</title>
</svelte:head>

{#if showMessage}
	<Message
		status={messageConfig.status}
		title={messageConfig.title}
		message={messageConfig.message}
		dismissible={true}
		onclose={() => (showMessage = false)}
	/>
{/if}

<div class="bg-scitech-navy flex min-h-screen items-center justify-center p-4">
	<div
		class="bg-scitech-slate flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl md:flex-row"
	>
		<div
			class="relative hidden w-full items-center justify-center overflow-hidden bg-white/5 p-12 md:flex md:w-1/2 lg:p-20"
		>
			<div
				class="bg-scitech-mint/10 absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl"
			></div>
			<div
				class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
			></div>

			<div class="z-10 flex flex-col items-center justify-center text-center">
				<img src={uinIcon} alt="Logo UIN" class="mb-8 h-40 w-auto object-contain drop-shadow-xl" />
				<h2 class="text-3xl font-bold text-text-main">Portal Admin</h2>
				<p class="mt-4 text-sm leading-relaxed text-slate-400">
					Sistem Informasi Manajemen Berita dan Akademik Fakultas Sains dan Teknologi.
				</p>
			</div>
		</div>

		<div class="w-full p-8 md:w-1/2 md:p-12 lg:p-16">
			<div class="mx-auto max-w-md">
				<div class="mb-10">
					<h1 class="text-3xl font-bold text-text-main">Selamat Datang</h1>
					<p class="mt-2 text-sm text-slate-400">Silakan masuk dengan kredensial yang valid.</p>
				</div>

				<!-- Alert Error dari Action Server -->
				{#if form?.error}
					<div
						class="bg-scitech-error/10 border-scitech-error/50 mb-6 flex items-center gap-3 rounded-xl border p-4 text-red-400"
					>
						<AlertCircle class="h-5 w-5 shrink-0" />
						<p class="text-sm font-medium">{form.error}</p>
					</div>
				{/if}

				<form
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						showMessage = false;
						return async ({ result }) => {
							isSubmitting = false;

							if (result.type === 'success' && result.data?.success) {
								triggerMessage(
									'success',
									(result.data.title as string) || 'Berhasil',
									(result.data.message as string) || 'Login berhasil!'
								);

								// Pindah halaman otomatis setelah 3 detik (3000ms)
								setTimeout(() => {
									goto((result.data?.redirectTo as string) || '/admin');
								}, 3000);
							} else if (result.type === 'failure' && result.data) {
								triggerMessage(
									'error',
									(result.data.title as string) || 'Gagal Login',
									(result.data.message as string) || 'Terjadi kesalahan saat masuk.'
								);
							} else {
								triggerMessage('error', 'Error', 'Terjadi kesalahan sistem.');
							}
						};
					}}
					class="space-y-6"
				>
					<div class="space-y-2">
						<label for="identifier" class="text-sm font-medium text-slate-300">
							Username atau Email
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<Mail class="h-5 w-5 text-slate-500" />
							</div>
							<input
								id="identifier"
								name="identifier"
								type="text"
								required
								placeholder="admin / admin@uin.ac.id"
								class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 block w-full rounded-xl border border-slate-700 py-3.5 pr-4 pl-12 text-text-main placeholder-slate-500 transition-all focus:ring-2 focus:outline-none"
							/>
						</div>
					</div>

					<!-- Field Password -->
					<div class="space-y-2">
						<label for="password" class="text-sm font-medium text-slate-300"> Password </label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<Lock class="h-5 w-5 text-slate-500" />
							</div>
							<input
								id="password"
								name="password"
								type="password"
								required
								placeholder="••••••••"
								class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 block w-full rounded-xl border border-slate-700 py-3.5 pr-4 pl-12 text-text-main placeholder-slate-500 transition-all focus:ring-2 focus:outline-none"
							/>
						</div>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isSubmitting}
						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint/90 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{#if isSubmitting}
							<div
								class="border-scitech-navy h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
							></div>
							<span>Memproses...</span>
						{:else}
							<LogIn class="h-5 w-5" />
							<span>Login</span>
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
