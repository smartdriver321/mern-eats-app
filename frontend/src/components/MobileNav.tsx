import { Menu } from 'lucide-react'

import { Separator } from './ui/separator'
import { Button } from './ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet'

export default function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger>
				<Menu className='text-orange-500' />
			</SheetTrigger>

			<SheetContent className='space-y-3'>
				<SheetTitle>
					<span> Welcome to MernEats.com!</span>
				</SheetTitle>
				<Separator />
				<SheetDescription className='flex flex-col gap-4'>
					<Button>Log In</Button>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	)
}
