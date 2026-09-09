<script lang="ts">
	import uinIcon from '$lib/assets/uin-icon.webp';
</script>

<div class="flex min-h-[75vh] items-center justify-center">
	<!-- Wrapper Utama (Flex Col & Center) -->
	<div class="group relative flex flex-col items-center text-center">
		<!-- Ambient Glow Effect -->
		<div
			class="from-scitech-mint/30 via-scitech-cyan/20 to-scitech-mint/30 absolute -inset-8 animate-pulse rounded-full bg-gradient-to-tr opacity-80 blur-3xl transition duration-700 group-hover:opacity-100"
		></div>

		<!-- Container Ikon -->
		<div
			class="bg-scitech-slate/40 relative flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-105 sm:h-52 sm:w-52"
		>
			<img
				src={uinIcon}
				alt="UIN Ar-Raniry Icon"
				class="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(45,212,191,0.3)] filter"
			/>
		</div>

		<div class="mt-6 space-y-1">
			<h1 class="text-scitech-mint text-xs font-bold tracking-widest uppercase sm:text-sm">
				Prodi Teknologi Informasi
			</h1>
			<p class="text-text-muted text-[11px] font-medium sm:text-xs">
				Fakultas Sains dan Teknologi UIN Ar-Raniry
			</p>
		</div>
	</div>
</div>
