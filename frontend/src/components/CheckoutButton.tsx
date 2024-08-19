import { useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import { useGetMyUser } from '@/api/MyUserApi'
import UserProfileForm, {
	UserFormData,
} from '@/forms/user-profile-form/UserProfileForm'
import LoadingButton from './LoadingButton'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

type Props = {
	onCheckout: (userFormData: UserFormData) => void
	disabled: boolean
}

export default function CheckoutButton({ onCheckout, disabled }: Props) {
	const { pathname } = useLocation()

	const {
		isAuthenticated,
		isLoading: isAuthLoading,
		loginWithRedirect,
	} = useAuth0()

	const { currentUser, isLoading: isGetUserLoading } = useGetMyUser()

	const onLogin = async () => {
		await loginWithRedirect({
			appState: {
				returnTo: pathname,
			},
		})
	}

	if (!isAuthenticated) {
		return (
			<Button onClick={onLogin} className='bg-orange-500 flex-1'>
				Log in to check out
			</Button>
		)
	}

	if (isAuthLoading || !currentUser) {
		return <LoadingButton />
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button disabled={disabled} className='bg-orange-500 flex-1'>
					Go to Checkout
				</Button>
			</DialogTrigger>

			<DialogContent className='max-w-[425px] md:min-w-[700px] bg-gray-50'>
				<UserProfileForm
					currentUser={currentUser}
					onSave={onCheckout}
					isLoading={isGetUserLoading}
				/>
			</DialogContent>
		</Dialog>
	)
}
