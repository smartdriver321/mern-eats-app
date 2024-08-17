import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './layouts/layout'
import HomePage from './pages/HomePage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import ProtectedRoute from './auth/ProtectedRoute'
import UserProfilePage from './pages/UserProfilePage'

export default function AppRoutes() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<Layout showHero>
						<HomePage />
					</Layout>
				}
			/>

			<Route path='/auth-callback' element={<AuthCallbackPage />} />

			<Route element={<ProtectedRoute />}>
				<Route
					path='/user-profile'
					element={
						<Layout>
							<UserProfilePage />
						</Layout>
					}
				/>
			</Route>

			<Route path='*' element={<Navigate to='/' />} />
		</Routes>
	)
}
