import { Request, Response } from 'express'
import Stripe from 'stripe'

import Restaurant, { MenuItemType } from '../models/restaurant'
import Order from '../models/order'

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL as string
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string

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

const getMyRestaurantOrders = async (req: Request, res: Response) => {
	try {
		const restaurant = await Restaurant.findOne({ user: req.userId })

		if (!restaurant) {
			return res.status(404).json({ message: 'restaurant not found' })
		}

		const orders = await Order.find({ restaurant: restaurant._id })
			.populate('restaurant')
			.populate('user')

		res.json(orders)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params
		const { status } = req.body

		const order = await Order.findById(orderId)

		if (!order) {
			return res.status(404).json({ message: 'order not found' })
		}

		const restaurant = await Restaurant.findById(order.restaurant)

		if (restaurant?.user?._id.toString() !== req.userId) {
			return res.status(401).send()
		}

		order.status = status
		await order.save()

		res.status(200).json(order)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Unable to update order status' })
	}
}

///////////////////////

const createLineItems = (
	checkoutSessionRequest: CheckoutSessionRequest,
	menuItems: MenuItemType[]
) => {
	// For each cartItem, get the menuItem object from the restaurant to get the price
	const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
		const menuItem = menuItems.find(
			(item) => item._id.toString() === cartItem.menuItemId.toString()
		)

		if (!menuItem) {
			throw new Error(`Menu item not found: ${cartItem.menuItemId}`)
		}

		// For each cartItem, convert it to a stripe line items
		const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
			price_data: {
				currency: 'gbp',
				unit_amount: menuItem.price,
				product_data: {
					name: menuItem.name,
				},
			},
			quantity: parseInt(cartItem.quantity),
		}

		return line_item
	})

	// Return lineItems array
	return lineItems
}

const createSession = async (
	lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
	orderId: string,
	deliveryPrice: number,
	restaurantId: string
) => {
	const sessionData = await STRIPE.checkout.sessions.create({
		line_items: lineItems,
		shipping_options: [
			{
				shipping_rate_data: {
					display_name: 'Delivery',
					type: 'fixed_amount',
					fixed_amount: {
						amount: deliveryPrice,
						currency: 'gbp',
					},
				},
			},
		],
		mode: 'payment',
		metadata: {
			orderId,
			restaurantId,
		},
		success_url: `${FRONTEND_URL}/order-status?success=true`,
		cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
	})

	return sessionData
}

const getMyOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find({ user: req.userId })
			.populate('restaurant')
			.populate('user')

		res.json(orders)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}

const createCheckoutSession = async (req: Request, res: Response) => {
	try {
		const checkoutSessionRequest: CheckoutSessionRequest = req.body

		const restaurant = await Restaurant.findById(
			checkoutSessionRequest.restaurantId
		)

		if (!restaurant) {
			throw new Error('Restaurant not found')
		}

		const newOrder = new Order({
			restaurant: restaurant,
			user: req.userId,
			status: 'placed',
			deliveryDetails: checkoutSessionRequest.deliveryDetails,
			cartItems: checkoutSessionRequest.cartItems,
			createdAt: new Date(),
		})

		const lineItems = createLineItems(
			checkoutSessionRequest,
			restaurant.menuItems
		)

		const session = await createSession(
			lineItems,
			newOrder._id.toString(),
			restaurant.deliveryPrice,
			restaurant._id.toString()
		)

		if (!session.url) {
			return res.status(500).json({ message: 'Error creating stripe session' })
		}

		await newOrder.save()

		res.json({ url: session.url })
	} catch (error: any) {
		console.log(error)
		res.status(500).json({ message: error.raw.message })
	}
}

const stripeWebhookHandler = async (req: Request, res: Response) => {
	let event

	try {
		const sig = req.headers['stripe-signature']
		event = STRIPE.webhooks.constructEvent(
			req.body,
			sig as string,
			STRIPE_ENDPOINT_SECRET
		)
	} catch (error: any) {
		console.log(error)
		return res.status(400).send(`Webhook error: ${error.message}`)
	}

	if (event.type === 'checkout.session.completed') {
		const order = await Order.findById(event.data.object.metadata?.orderId)

		if (!order) {
			return res.status(404).json({ message: 'Order not found' })
		}

		order.totalAmount = event.data.object.amount_total
		order.status = 'paid'

		await order.save()
	}

	res.status(200).send()
}

export default {
	getMyRestaurantOrders,
	updateOrderStatus,
	getMyOrders,
	createCheckoutSession,
	stripeWebhookHandler,
}
