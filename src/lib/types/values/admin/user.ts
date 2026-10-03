import type { RoleUser } from '$lib/dto/admin/userAdmin';

export interface UserFormValues {
	id?: string;
	name: string;
	username: string;
	email: string;
	password?: string;
	image_public_id?: string | null;
	role: RoleUser;
	status: string;
}
export interface AvatarFormValues {
	image_url?: string | null;
	image_public_id?: string | null;
}

export interface PasswordFormValues {
	newPassword: string;
}

export interface ProfileFormValues {
	name: string;
	username: string;
	email: string;
}
