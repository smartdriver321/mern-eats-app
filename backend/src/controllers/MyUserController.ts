import { Request, Response } from 'express'

import User from '../models/user'

const createCurrentUser = async (req: Request, res: Response) => {
	try {
		// Check if the user exists
		const { auth0Id } = req.body
		const existingUser = await User.findOne({ auth0Id })

		if (existingUser) {
			return res.status(200).send()
		}

		// Create the user if it doesn't exist
		const newUser = new User(req.body)
		await newUser.save()

		// Return the user object to the calling client
		res.status(201).json(newUser.toObject())
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error creating user' })
	}
}

export default {
	createCurrentUser,
}
