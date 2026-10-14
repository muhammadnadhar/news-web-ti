import { availableIcons } from '$lib/data/icon';

/* Helper untuk pemetaan cepat string ke komponen ikon
 */
export const iconMap: Record<string, any> = availableIcons.reduce(
	(acc, item) => {
		acc[item.name] = item.component;
		return acc;
	},
	{} as Record<string, any>
);
