import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './layouts/layout'
import HomePage from './pages/HomePage'
import AuthCallbackPage from './pages/AuthCallbackPage'

export default function AppRoutes() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<Layout>
						<HomePage />
					</Layout>
				}
			/>
			<Route path='/auth-callback' element={<AuthCallbackPage />} />
			<Route path='/user-profile' element={<span>User profile page</span>} />
			<Route path='*' element={<Navigate to='/' />} />
		</Routes>
	)
}
