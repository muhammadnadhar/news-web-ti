import { writable, get } from 'svelte/store';

export type Theme = 'dark' | 'light';

function ThemeManager() {
	const store = writable<Theme>('dark');
	const { subscribe, set, update } = store;

	return {
		subscribe,
		get current() {
			return get(store);
		},
		init: () => {
			if (typeof window !== 'undefined') {
				const savedTheme = localStorage.getItem('theme') as Theme | null;
				const initial =
					savedTheme ||
					(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

				set(initial);
				applyTheme(initial);
			}
		},
		toggle: () => {
			update((current) => {
				const next = current === 'dark' ? 'light' : 'dark';
				if (typeof window !== 'undefined') {
					localStorage.setItem('theme', next);
					applyTheme(next);
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
