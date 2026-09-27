import { writable, get } from 'svelte/store';


export type Theme = 'dark' | 'light';

function ThemeManager() {
	const store = writable<Theme>('dark');

	return {
		subscribe: store.subscribe,
		get current() {
			return get(store);
		},
		init: () => {
			if (typeof window !== 'undefined') {
				const savedTheme = localStorage.getItem('theme') as Theme | null;
				const initial =
					savedTheme ||
					(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

				store.set(initial);
				applyTheme(initial);
			}
		},
		// Tambahkan parameter event (MouseEvent)
		toggle: (event?: MouseEvent) => {
			store.update((current) => {
				const next = current === 'dark' ? 'light' : 'dark';

				if (typeof window !== 'undefined') {
					localStorage.setItem('theme', next);

					// Jika browser TIDAK mendukung View Transitions API atau tidak ada event klik
					if (!document.startViewTransition || !event) {
						applyTheme(next);
						return next;
					}

					// 1. Ambil koordinat titik pusat tombol yang diklik
					const x = event.clientX;
					const y = event.clientY;

					// 2. Hitung jarak terjauh dari titik klik ke pojok layar (jari-jari maksimum)
					const endRadius = Math.hypot(
						Math.max(x, window.innerWidth - x),
						Math.max(y, window.innerHeight - y)
					);

					// 3. Set variabel CSS untuk posisi animasi lingkaran
					const root = document.documentElement;
					root.style.setProperty('--ripple-x', `${x}px`);
					root.style.setProperty('--ripple-y', `${y}px`);
					root.style.setProperty('--ripple-radius', `${endRadius}px`);

					// 4. Jalankan View Transition
					document.startViewTransition(() => {
						applyTheme(next);
					});
				}
				return next;
			});
		}
	};
}

function applyTheme(t: Theme) {
	if (typeof document !== 'undefined') {
		const root = document.documentElement;
		if (t === 'dark') {
			root.classList.add('dark');
			root.classList.remove('light');
		} else {
			root.classList.add('light');
			root.classList.remove('dark');
		}
	}
}

export const Apptheme = ThemeManager();
