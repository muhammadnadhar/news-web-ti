<script lang="ts">
	interface Props {
		currentText: string;
	}

	let { currentText }: Props = $props();

	let characters = $derived(Array.from(currentText));
	// Menghitung indeks awal untuk 35% huruf terakhir
	let yellowStartIndex = $derived(Math.floor(characters.length * 0.65));
	// Memproses atribut tiap karakter (warna, variasi posisi 3D acak, delay)
	let charList = $derived(
		characters.map((char, index) => {
			const isYellow = index >= yellowStartIndex;
			const displayChar = char === ' ' ? '\u00A0' : char;

			// Pseudo-random deterministic seed berdasarkan indeks
			const seed = (index * 9301 + 49297) % 233280;
			const rnd = seed / 233280;

			// Variasi susunan acak (3D depth, scale, offset)
			let randomTransform = '';
			if (index % 7 === 0) {
				// Menonjol ke depan (zoom ke arah layar) & naik sedikit
				randomTransform = 'transform: translateZ(28px) scale(1.12) translateY(-3px);';
			} else if (index % 5 === 0) {
				// Agak mundur ke belakang & turun sedikit
				randomTransform = 'transform: translateZ(-18px) scale(0.92) translateY(3px);';
			} else if (index % 3 === 0) {
				// Miring & geser vertikal acak
				const rotateDeg = (rnd * 6 - 3).toFixed(1);
				const translateY = (rnd * 6 - 3).toFixed(1);
				randomTransform = `transform: translateY(${translateY}px) rotate(${rotateDeg}deg);`;
			} else {
				// Rapi / Sejajar
				randomTransform = 'transform: translateZ(0) translateY(0);';
			}

			return {
				char: displayChar,
				isYellow,
				transform: randomTransform,
				delay: index * 0.035
			};
		})
	);
</script>

<div
	class="flex min-h-[8rem] w-full max-w-3xl items-center justify-center text-center sm:min-h-[10rem]"
>
	{#key currentText}
		<div
			class="animate-text-flip flex transform-gpu flex-col items-center justify-center text-center [perspective:1000px]"
		>
			<h2
				class="text-center text-4xl leading-tight font-black tracking-tight sm:text-5xl md:text-7xl"
			>
				<span class="inline-block text-center [transform-style:preserve-3d]">
					{#each charList as item}
						<span
							class="animate-char-blast relative inline-block transition-transform {item.isYellow
								? 'is-yellow text-accent-yellow'
								: 'text-white'}"
							data-char={item.char}
							style="animation-delay: {item.delay}s; {item.transform}"
						>
							{item.char}
						</span>
					{/each}
				</span>
			</h2>
		</div>
	{/key}
</div>

<style>
	/* Animasi Teks Utama Muncul */
	@keyframes charAppear {
		0% {
			opacity: 0;
			transform: scale(0.6) translateY(12px);
		}
		100% {
			opacity: 1;
		}
	}

	/* Animasi Bayangan Hempasan (Huruf Putih) */
	@keyframes shadowBlastWhite {
		0% {
			opacity: 0.9;
			transform: scale(1);
			text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
			color: #ffffff;
		}
		100% {
			opacity: 0;
			transform: scale(2.2);
			text-shadow: 0 0 20px rgba(255, 255, 255, 0);
			color: #ffffff;
		}
	}

	/* Animasi Bayangan Hempasan (Huruf Kuning) */
	@keyframes shadowBlastYellow {
		0% {
			opacity: 0.9;
			transform: scale(1);
			text-shadow: 0 0 10px rgba(250, 204, 21, 0.9);
			color: #facc15;
		}
		100% {
			opacity: 0;
			transform: scale(3);
			text-shadow: 0 0 20px rgba(250, 204, 21, 0);
			color: #facc15;
		}
	}

	.animate-char-blast {
		opacity: 0;
		animation: charAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		will-change: transform, opacity;
		transform-style: preserve-3d;
	}

	/* Bayangan Hempasan Default (Putih) */
	.animate-char-blast::after {
		content: attr(data-char);
		position: absolute;
		left: 0;
		top: 0;
		pointer-events: none;
		user-select: none;
		opacity: 0;
		animation: shadowBlastWhite 0.45s ease-out forwards;
		animation-delay: inherit;
		will-change: transform, opacity;
	}

	/* Bayangan Hempasan Khusus Karakter Kuning */
	.animate-char-blast.is-yellow::after {
		animation-name: shadowBlastYellow;
	}
</style>
