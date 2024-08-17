import { useMutation, useQuery } from 'react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from 'sonner'

import { User } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateUserRequest = {
	auth0Id: string
	email: string
}

type UpdateMyUserRequest = {
	name: string
	addressLine1: string
	city: string
	country: string
}

export const useGetMyUser = () => {
	const { getAccessTokenSilently } = useAuth0()

	const getMyUserRequest = async (): Promise<User> => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(`${API_BASE_URL}/api/my/user`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})

		if (!response.ok) {
			throw new Error('Failed to fetch user')
		}

		return response.json()
	}

	const {
		data: currentUser,
		isLoading,
		error,
	} = useQuery('fetchCurrentUser', getMyUserRequest)

	if (error) {
		toast.error(error.toString())
	}

	return { currentUser, isLoading }
}

export const useCreateMyUser = () => {
	const { getAccessTokenSilently } = useAuth0()

	const createMyUserRequest = async (user: CreateUserRequest) => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(`${API_BASE_URL}/api/my/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(user),
		})

		if (!response.ok) {
			throw new Error('Failed to create user')
		}
	}

	const {
		mutateAsync: createUser,
		isLoading,
		isError,
		isSuccess,
	} = useMutation(createMyUserRequest)

	return {
		createUser,
		isLoading,
		isError,
		isSuccess,
	}
}

export const useUpdateMyUser = () => {
	const { getAccessTokenSilently } = useAuth0()

	const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
		const accessToken = await getAccessTokenSilently()

		const response = await fetch(`${API_BASE_URL}/api/my/user`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(formData),
		})

		if (!response.ok) {
			throw new Error('Failed to update user')
		}

		return response.json()
	}

	const {
		mutateAsync: updateUser,
		isLoading,
		isSuccess,
		error,
		reset,
	} = useMutation(updateMyUserRequest)

	if (isSuccess) {
		toast.success('User profile updated!')
	}

	if (error) {
		toast.error(error.toString())
		reset()
	}

	return { updateUser, isLoading }
}
