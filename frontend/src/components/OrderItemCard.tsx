import { Order } from '@/types'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type Props = {
	order: Order
}

export default function OrderItemCard({ order }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='grid md:grid-cols-4 gap-4 justify-between mb-3'>
					<div>
						Customer Name:
						<span className='ml-2 font-normal'>
							{order.deliveryDetails.name}
						</span>
					</div>
					<div>
						Delivery address:
						<span className='ml-2 font-normal'>
							{order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
						</span>
					</div>
					<div>
						Time:
						<span className='ml-2 font-normal'>12.45</span>
					</div>
					<div>
						Total Cost:
						<span className='ml-2 font-normal'>
							£{(order.totalAmount / 100).toFixed(2)}
						</span>
					</div>
				</CardTitle>
				<Separator />
			</CardHeader>
			<CardContent className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					{order.cartItems.map((cartItem) => (
						<span>
							<Badge variant='outline' className='mr-2'>
								{cartItem.quantity}
							</Badge>
							{cartItem.name}
						</span>
					))}
				</div>
				<div className='flex flex-col space-y-1.5'>
					<Label htmlFor='status'>What is the status of this order?</Label>
				</div>
			</CardContent>
		</Card>
	)
}
