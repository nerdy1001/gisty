'use server'

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Gist from "../models/gist.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: Params): Promise<void> {

    connectToDB()

    try {

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        )

        // revalidate data associated with path so that cached data
        // is updated without waiting for a revalidation period
        // to expire
        if(path == '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB()

        return await User
        .findOne({ id: userId })
        // .populate({
        //     path: 'groups',
        //     model: Group
        // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserGists(userId: string) {
    try {
        connectToDB()

        // find all gists belonging to the user with given userid
        const gists = await User.findOne({ id: userId })
        .populate({
            path: 'gists',
            model: Gist,
            populate: {
                path: 'children',
                model: Gist,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            }
        })

        return gists
        
    } catch (error: any) {
        throw new Error(`Failed to find gists for this user: ${error.message}`)
    }
}

export async function fetchUsers({ 
    userId, 
    searchString = '', 
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number
    pageSize?: number;
    sortBy?: SortOrder
}) {
    try {
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if(searchString.trim() !== '') {
            // search for user by name or username
            query.$or = [
                { username: { $regex: regex }},
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalUsers = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsers > skipAmount + users.length

        return { users, isNext }

    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

export async function getUserActivity(userId: string) {
    try {
        connectToDB()

        // find all gist created by the user
        const userGists = await Gist.find({ author: userId })

        // collect all the replies to users gists
        const replyIds = userGists.reduce((acc, userGists) => {
            return acc.concat(userGists.children)
        }, [])

        // find all the replies made to the user's gist excluding
        // their own reply
        const userReplies = await Gist.find({
            _id: { $in: replyIds },
            author: { $ne: userId },
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return userReplies
    } catch (error: any) {
        throw new Error(`Failed to get user activity: ${error.message}`)
    }
}