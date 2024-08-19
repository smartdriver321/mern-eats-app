import { useParams } from 'react-router-dom'

import { useSearchRestaurants } from '@/api/RestaurantApi'

export default function SearchPage() {
	const { city } = useParams()
	const { results } = useSearchRestaurants(city)
	console.log(results)
	return (
		<span>
			User searched for {city}
			<span>
				{results?.data.map((restaurant) => (
					<span>
						found {restaurant.restaurantName},{restaurant.city}
					</span>
				))}
			</span>
		</span>
	)
}
