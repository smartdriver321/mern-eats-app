import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './layouts/layout'
import HomePage from './pages/HomePage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import SearchPage from './pages/SearchPage'
import DetailsPage from './pages/DetailsPage'
import ProtectedRoute from './auth/ProtectedRoute'
import UserProfilePage from './pages/UserProfilePage'
import OrderStatusPage from './pages/OrderStatusPage'
import ManageRestaurantPage from './pages/ManageRestaurantPage'

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
			<Route
				path='/search/:city'
				element={
					<Layout showHero={false}>
						<SearchPage />
					</Layout>
				}
			/>

			<Route
				path='/detail/:restaurantId'
				element={
					<Layout showHero={false}>
						<DetailsPage />
					</Layout>
				}
			/>

			<Route element={<ProtectedRoute />}>
				<Route
					path='/order-status'
					element={
						<Layout>
							<OrderStatusPage />
						</Layout>
					}
				/>

				<Route
					path='/user-profile'
					element={
						<Layout>
							<UserProfilePage />
						</Layout>
					}
				/>

				<Route
					path='/manage-restaurant'
					element={
						<Layout>
							<ManageRestaurantPage />
						</Layout>
					}
				/>
			</Route>

			<Route path='*' element={<Navigate to='/' />} />
		</Routes>
	)
}
