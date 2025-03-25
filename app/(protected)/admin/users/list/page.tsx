import { Metadata } from 'next';
import AdminUsersListPage from '@/components/admin/users/users-list-page';

export const metadata: Metadata = {
	title: 'User Management | NoteMeet Admin',
	description: 'Manage users, permissions, and account status',
};

export default function AdminUsersPage() {
	return <AdminUsersListPage />;
}
