import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

import myUserRoute from './routes/MyUserRoute'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/health', async (req: Request, res: Response) => {
	res.json({ message: ' App is healthy' })
})

app.use('/api/my/user', myUserRoute)

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Connect to DB and start server
mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING as string)
	.then(() => {
		app.listen(7000, () => {
			console.log(`Connected to database!\nServer running on port 7000`)
		})
	})
	.catch((err) => console.log(err))
