import { Navigate, Outlet } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuth0()

	if (isLoading) {
		return null
	}

	if (isAuthenticated) {
		return <Outlet />
	}

	return <Navigate to='/' replace />
}
