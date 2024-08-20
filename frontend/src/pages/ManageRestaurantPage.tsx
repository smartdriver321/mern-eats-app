import { useGetMyRestaurantOrders } from '@/api/OrderApi'
import {
	useCreateMyRestaurant,
	useGetMyRestaurant,
	useUpdateMyRestaurant,
} from '@/api/MyRestaurantApi'
import ManageRestaurantForm from '@/forms/manage-restaurant-form/ManageRestaurantForm'
import OrderItemCard from '@/components/OrderItemCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ManageRestaurantPage() {
	const { restaurant } = useGetMyRestaurant()
	const { orders } = useGetMyRestaurantOrders()
	const { createRestaurant, isLoading: isCreateLoading } =
		useCreateMyRestaurant()
	const { updateRestaurant, isLoading: isUpdateLoading } =
		useUpdateMyRestaurant()

	const isEditing = !!restaurant

	return (
		<Tabs defaultValue='orders'>
			<TabsList>
				<TabsTrigger value='orders'>Orders</TabsTrigger>
				<TabsTrigger value='manage-restaurant'>Manage Restaurant</TabsTrigger>
			</TabsList>
			<TabsContent
				value='orders'
				className='space-y-5 bg-gray-50 p-10 rounded-lg'
			>
				<h2 className='text-2xl font-bold'>{orders?.length} Active Orders</h2>
				{orders?.map((order) => (
					<OrderItemCard order={order} />
				))}
			</TabsContent>
			<TabsContent value='manage-restaurant'>
				<ManageRestaurantForm
					restaurant={restaurant}
					onSave={isEditing ? updateRestaurant : createRestaurant}
					isLoading={isCreateLoading || isUpdateLoading}
				/>
			</TabsContent>
		</Tabs>
	)
}
