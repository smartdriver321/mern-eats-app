import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/test', async (req: Request, res: Response) => {
	res.json({ message: 'Healthy App' })
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
