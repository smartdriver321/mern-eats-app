import { useMutation, useQuery } from 'react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from 'sonner'

import { Order } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CheckoutSessionRequest = {
	cartItems: {
		menuItemId: string
		name: string
		quantity: string
	}[]
	deliveryDetails: {
		email: string
		name: string
		addressLine1: string
		city: string
	}
	restaurantId: string
}

type UpdateOrderStatusRequest = {
	orderId: string
	status: string
}

export const useGetMyRestaurantOrders = () => {
	const { getAccessTokenSilently } = useAuth0()

	const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(`${API_BASE_URL}/api/order`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (!response.ok) {
			throw new Error('Failed to fetch orders')
		}

		return response.json()
	}

	const { data: orders, isLoading } = useQuery(
		'fetchMyRestaurantOrders',
		getMyRestaurantOrdersRequest
	)

	return { orders, isLoading }
}

export const useUpdateMyRestaurantOrder = () => {
	const { getAccessTokenSilently } = useAuth0()

	const updateMyRestaurantOrder = async (
		updateStatusOrderRequest: UpdateOrderStatusRequest
	) => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(
			`${API_BASE_URL}/api/order/${updateStatusOrderRequest.orderId}/status`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ status: updateStatusOrderRequest.status }),
			}
		)

		if (!response.ok) {
			throw new Error('Failed to update status')
		}

		return response.json()
	}

	const {
		mutateAsync: updateRestaurantStatus,
		isLoading,
		isError,
		isSuccess,
		reset,
	} = useMutation(updateMyRestaurantOrder)

	if (isSuccess) {
		toast.success('Order updated')
	}

	if (isError) {
		toast.error('Unable to update order')
		reset()
	}

	return { updateRestaurantStatus, isLoading }
}

export const useGetMyOrders = () => {
	const { getAccessTokenSilently } = useAuth0()

	const getMyOrdersRequest = async (): Promise<Order[]> => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(`${API_BASE_URL}/api/order`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (!response.ok) {
			throw new Error('Failed to get orders')
		}

		return response.json()
	}

	const { data: orders, isLoading } = useQuery(
		'fetchMyOrders',
		getMyOrdersRequest,
		{
			refetchInterval: 5000,
		}
	)

	return { orders, isLoading }
}

export const useCreateCheckoutSession = () => {
	const { getAccessTokenSilently } = useAuth0()

	const createCheckoutSessionRequest = async (
		checkoutSessionRequest: CheckoutSessionRequest
	) => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(
			`${API_BASE_URL}/api/order/checkout/create-checkout-session`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(checkoutSessionRequest),
			}
		)

		if (!response.ok) {
			throw new Error('Unable to create checkout session')
		}

		return response.json()
	}

	const {
		mutateAsync: createCheckoutSession,
		isLoading,
		error,
		reset,
	} = useMutation(createCheckoutSessionRequest)

	if (error) {
		toast.error(error.toString())
		reset()
	}

	return {
		createCheckoutSession,
		isLoading,
	}
}
