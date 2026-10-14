import type { DashboardActionLink } from '../dashboard';
import type { NavMenuItemType } from '../navbar';

export interface DataUIFormValues {
	navMenus?: NavMenuItemType[] | null;
	actionLinks?: DashboardActionLink[] | null;
}
