<script lang="ts">
	import { fade } from 'svelte/transition';
	import { 
		Info, 
		CheckCircle2, 
		AlertTriangle, 
		XCircle, 
		X 
	} from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	export type MessageStatus = 'info' | 'success' | 'warning' | 'error';

	interface Props {
		status?: MessageStatus;
		title?: string;
		message?: string;
		dismissible?: boolean;
		timeout?: number; // Durasi auto-close dalam milidetik (misal: 3000 = 3 detik)
		onclose?: () => void;
		children?: Snippet;
	}

	let {
		status = 'info',
		title,
		message,
		dismissible = false,
		timeout,
		onclose,
		children
	}: Props = $props();

	let visible = $state(true);

	function handleClose() {
		visible = false;
		onclose?.();
	}

	// Auto-dismiss
	$effect(() => {
		if (timeout && timeout > 0 && visible) {
			const timer = setTimeout(() => {
				handleClose();
			}, timeout);

			// Cleanup timer jika komponen di-unmount atau status berubah
			return () => clearTimeout(timer);
		}
	});

	const statusConfig = {
		info: {
			icon: Info,
			bg: 'bg-blue-500/10 dark:bg-blue-950/80',
			border: 'border-blue-500/30',
			iconColor: 'text-blue-500 dark:text-blue-400',
			titleColor: 'text-blue-900 dark:text-blue-200',
			textColor: 'text-blue-700 dark:text-blue-300',
			closeHover: 'hover:bg-blue-500/20 text-blue-500'
		},
		success: {
			icon: CheckCircle2,
			bg: 'bg-emerald-500/10 dark:bg-emerald-950/80',
			border: 'border-emerald-500/30',
			iconColor: 'text-emerald-500 dark:text-emerald-400',
			titleColor: 'text-emerald-900 dark:text-emerald-200',
			textColor: 'text-emerald-700 dark:text-emerald-300',
			closeHover: 'hover:bg-emerald-500/20 text-emerald-500'
		},
		warning: {
			icon: AlertTriangle,
			bg: 'bg-amber-500/10 dark:bg-amber-950/80',
			border: 'border-amber-500/30',
			iconColor: 'text-amber-500 dark:text-amber-400',
			titleColor: 'text-amber-900 dark:text-amber-200',
			textColor: 'text-amber-700 dark:text-amber-300',
			closeHover: 'hover:bg-amber-500/20 text-amber-500'
		},
		error: {
			icon: XCircle,
			bg: 'bg-rose-500/10 dark:bg-rose-950/80',
			border: 'border-rose-500/30',
			iconColor: 'text-rose-500 dark:text-rose-400',
			titleColor: 'text-rose-900 dark:text-rose-200',
			textColor: 'text-rose-700 dark:text-rose-300',
			closeHover: 'hover:bg-rose-500/20 text-rose-500'
		}
	};

	const config = $derived(statusConfig[status]);
	const IconComponent = $derived(config.icon);
</script>

{#if visible}
	<div
		transition:fade={{ duration: 200 }}
		role="alert"
		class="fixed z-50 flex w-[calc(100%-2rem)] max-w-md gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all
		       top-4 left-1/2 -translate-x-1/2
md:top-auto md:bottom-6 md:left-auto md:right-6 md:translate-x-0
		       {config.bg} {config.border}"
	>
		<div class="shrink-0">
			<IconComponent class="h-5 w-5 {config.iconColor}" />
		</div>

		<!-- konten message -->
		<div class="flex-1 text-sm leading-relaxed">
			{#if title}
				<h5 class="mb-1 font-semibold {config.titleColor}">
					{title}
				</h5>
			{/if}

			<div class={config.textColor}>
				{#if message}
					<p>{message}</p>
				{:else if children}
					{@render children()}
				{/if}
			</div>
		</div>

		<!-- Tombol Close -->
		{#if dismissible}
			<button
				type="button"
				onclick={handleClose}
				aria-label="Tutup pesan"
				class="shrink-0 -mr-1 -mt-1 flex h-7 w-7 items-center justify-center rounded-lg transition-colors {config.closeHover}"
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>
{/if}
