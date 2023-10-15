'use server'

import { revalidatePath } from "next/cache";
import Gist from "../models/gist.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string;
    author: string;
    groupId: string | null;
    path: string;
}

export async function createGist ({ text, author, groupId, path} : Params) {
    try {

        connectToDB()

        const createdGist = await Gist.create({
            text,
            author,
            group: null
        })
    
        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { gists: createdGist._id }
        })
    
        // makes sure changes occur immediately on the app
        revalidatePath(path)

    } catch (error: any) {
        throw new Error(`Error posting gist: ${error.message}`)
    }
}

export async function fetchGists(pageNumber = 1, pageSize = 20) {
    
    try {
        connectToDB()

        // calculate the number of gists to skip
        const skipAmount = (pageNumber - 1) * pageSize

        const gistQuery = Gist.find({
            parentId: { $in: [null, undefined] }
        })
        .sort({
            createdAt: 'desc'
        })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path: 'author',
            model: User
        })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
        })

        const totalGistCount = await Gist.countDocuments({
            parentId: { $in: [null, undefined] }
        })

        const gists = await gistQuery.exec()

        const isNext = totalGistCount > skipAmount + gists.length

        return { gists, isNext }
    } catch (error: any) {
        throw new Error(`No gist found: ${error.message}`)
    }

}

export async function fetchGistById(id: string) {
    
    connectToDB()
    
    try {

        //todo: populate group
        const gist = await Gist.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: 'children',
                    model: Gist,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec()
        return gist
    } catch (error: any) {
        throw new Error(`Error getting gist: ${error.message}`)
    }
}

export async function CommentToGist(
    gistId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB()

    try {

        // find the orginal gist by its id
        const originalGist = await Gist.findById(gistId)

        // create new gist with the comment text
        const commentGist = new Gist({
            text: commentText,
            author: userId,
            parentId: gistId
        })

        // save the new gist to the database
        const savedCommentGist = await commentGist.save()

        // update the original gist to include the new comment
        originalGist.children.push(savedCommentGist._id)

        await originalGist.save()

        revalidatePath(path)
        
    } catch (error: any) {
        throw new Error(`Could not post comment: ${error.message}`)
    }
}