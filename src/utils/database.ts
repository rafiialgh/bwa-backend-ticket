import mongoose from "mongoose";

export default function connectDB() {
  const DATABASE_URL = process.env.DATABASE_URL ?? ''

  try {
    mongoose.connect(DATABASE_URL)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  const dbConnect = mongoose.connection

  dbConnect.on('open', (_) => {
    console.log(`Database connected: ${DATABASE_URL}`)
  })

  dbConnect.on('error', (err) => {
    console.log(`Connection error: ${err}`)
  })
}