import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { MenuItem as Menu_Item } from '../types'
import { useGetRestaurant } from '@/api/RestaurantApi'
import RestaurantInfo from '@/components/RestaurantInfo'
import MenuItem from '@/components/MenuItem'
import OrderSummary from '@/components/OrderSummary'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card } from '@/components/ui/card'

export type CartItem = {
	_id: string
	name: string
	price: number
	quantity: number
}

export default function DetailsPage() {
	const [cartItems, setCartItems] = useState<CartItem[]>([])

	const { restaurantId } = useParams()
	const { restaurant, isLoading } = useGetRestaurant(restaurantId)

	const addToCart = (menuItem: Menu_Item) => {
		// Check if the item is already in the cart
		setCartItems((prevCartItems) => {
			const existingCartItem = prevCartItems.find(
				(cartItem) => cartItem._id === menuItem._id
			)

			// If item is in cart, update the quantity
			let updatedCartItems

			if (existingCartItem) {
				updatedCartItems = prevCartItems.map((cartItem) =>
					cartItem._id === menuItem._id
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem
				)
			} else {
				// If item is not in cart, add it as new item
				updatedCartItems = [
					...prevCartItems,
					{
						_id: menuItem._id,
						name: menuItem.name,
						price: menuItem.price,
						quantity: 1,
					},
				]
			}

			return updatedCartItems
		})
	}

	const removeFromCart = (cartItem: CartItem) => {
		setCartItems((prevCartItems) => {
			const updatedCartItems = prevCartItems.filter(
				(item) => cartItem._id !== item._id
			)

			return updatedCartItems
		})
	}

	if (isLoading || !restaurant) {
		return 'Loading...'
	}

	return (
		<div className='flex flex-col gap-10'>
			<AspectRatio ratio={16 / 5}>
				<img
					src={restaurant.imageUrl}
					className='rounded-md object-cover h-full w-full'
				/>
			</AspectRatio>

			<div className='grid md:grid-cols-[4fr_2fr] gap-5 md:px-32'>
				<div className='flex flex-col gap-4'>
					<RestaurantInfo restaurant={restaurant} />

					<span className='text-2xl font-bold tracking-tight'>Menu</span>
					{restaurant.menuItems.map((menuItem) => (
						<MenuItem
							menuItem={menuItem}
							addToCart={() => addToCart(menuItem)}
						/>
					))}
				</div>

				<div>
					<Card>
						<OrderSummary
							restaurant={restaurant}
							cartItems={cartItems}
							removeFromCart={removeFromCart}
						/>
					</Card>
				</div>
			</div>
		</div>
	)
}
