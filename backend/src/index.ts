import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'

import myUserRoute from './routes/MyUserRoute'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/health', async (req: Request, res: Response) => {
	res.json({ message: ' App is healthy' })
})

app.use('/api/my/user', myUserRoute)

// Connect to DB and start server
mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING as string)
	.then(() => {
		app.listen(7000, () => {
			console.log(`Connected to database!\nServer running on port 7000`)
		})
	})
	.catch((err) => console.log(err))
