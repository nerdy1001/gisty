import * as z from 'zod'

export const GistValidator = z.object({
    gist: z.string().nonempty().min(3, { message: 'Say the full gist or dont say it at all!!!'}),
    accountId: z.string(),
})

export const CommentValidator = z.object({
    gist: z.string().nonempty().min(3, { message: 'You can do better than that...'})
})