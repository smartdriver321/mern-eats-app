import { useAuth0 } from '@auth0/auth0-react'

import { Button } from './ui/button'

export default function MainNav() {
	const { loginWithRedirect } = useAuth0()

	return (
		<span className='flex space-x-2 items-center'>
			<Button
				className='font-bold hover:text-orange-500 hover:bg-white'
				variant='ghost'
				onClick={async () => await loginWithRedirect()}
			>
				Log In
			</Button>
		</span>
	)
}
