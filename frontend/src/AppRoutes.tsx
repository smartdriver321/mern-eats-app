import { Navigate, Route, Routes } from 'react-router-dom'

export default function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<span>Home page</span>} />
			<Route path='/user-profile' element={<span>User profile page</span>} />
			<Route path='*' element={<Navigate to='/' />} />
		</Routes>
	)
}
