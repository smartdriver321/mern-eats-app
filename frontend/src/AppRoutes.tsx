import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './layouts/layout'

export default function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<Layout>Home page</Layout>} />
			<Route path='/user-profile' element={<span>User profile page</span>} />
			<Route path='*' element={<Navigate to='/' />} />
		</Routes>
	)
}
