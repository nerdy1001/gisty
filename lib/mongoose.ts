import mongoose from 'mongoose'

// variable that checks mongoose connection
let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log('No mongodb connection found')

    try {
        await mongoose.connect(process.env.MONGODB_URL)

        isConnected = true

        console.log('Connected to gist-cluster')
    } catch (error) {
        console.log(error)
    }
}