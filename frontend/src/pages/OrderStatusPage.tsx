import { AspectRatio } from '@/components/ui/aspect-ratio'

import { useGetMyOrders } from '@/api/OrderApi'

export default function OrderStatusPage() {
	const { orders, isLoading } = useGetMyOrders()

	if (isLoading) {
		return 'Loading...'
	}

	if (!orders || orders.length === 0) {
		return 'No orders found'
	}

	return (
		<div className='space-y-10'>
			{orders.map((order) => (
				<div className='space-y-10 bg-gray-50 p-10 rounded-lg'>
					OrderStatusHeader
					<div className='grid gap-10 md:grid-cols-2'>
						OrderStatusDetail
						<AspectRatio ratio={16 / 5}>
							<img
								src={order.restaurant.imageUrl}
								className='rounded-md object-cover h-full w-full'
							/>
						</AspectRatio>
					</div>
				</div>
			))}
		</div>
	)
}
