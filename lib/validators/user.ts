import * as z from 'zod'

export const UserValidator = z.object({
    profile_img: z.string().url().nonempty(),
    name: z.string().min(3).max(30),
    username: z.string().min(3, { message: 'username must have a minimum of three(3) characters'}).max(30),
    bio: z.string().max(1000),
})