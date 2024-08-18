import {
	useCreateMyRestaurant,
	useGetMyRestaurant,
} from '@/api/MyRestaurantApi'
import ManageRestaurantForm from '@/forms/manage-restaurant-form/ManageRestaurantForm'

export default function ManageRestaurantPage() {
	const { restaurant } = useGetMyRestaurant()

	const { createRestaurant, isLoading: isCreateLoading } =
		useCreateMyRestaurant()

	return (
		<ManageRestaurantForm
			restaurant={restaurant}
			onSave={createRestaurant}
			isLoading={isCreateLoading}
		/>
	)
}
