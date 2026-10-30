<script>
	// di gunkan di SIdebar , Layout header admin ( mobile )

	import { goto } from '$app/navigation';
	import { User } from 'lucide-svelte';
</script>

<button
	onclick={() => goto('/admin/user/profil')}
	class="flex items-center gap-3 border-l border-border-color pl-4 hover:cursor-pointer"
>
	<div class="text-right">
		<span class="block text-xs font-bold text-text-main">Profile</span>
		<span class="text-scitech-mint block font-mono text-[10px]">Detailt</span>
	</div>

	<div class="from-scitech-mint to-scitech-cyan h-9 w-9 rounded-xl bg-linear-to-tr p-0.5 shadow-md">
		<div
			class="bg-scitech-navy flex h-full w-full items-center justify-center overflow-hidden rounded-[10px]"
		>
			<User class="text-scitech-mint h-5 w-5" />
		</div>
	</div>
</button>
