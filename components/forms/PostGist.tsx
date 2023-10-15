'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { GistValidator } from '@/lib/validators/gist'
import { Textarea } from '../ui/textarea'
import { createGist } from '@/lib/actions/gist.actions'

// import { updateUser } from '@/lib/actions/user.actions';
// import { UserValidator } from "@/lib/validators/user";


interface AccountProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string
}

const PostGist = ({ userId }: { userId: string }) => {

    const pathName = usePathname()
    const router = useRouter()

    const form = useForm({
      resolver: zodResolver(GistValidator),
      defaultValues: {
        gist: '',
        accountId: userId
      }
    })

    const onSubmit = async (values: z.infer<typeof GistValidator>) => {
        await createGist({
            text: values.gist,
            author: userId,
            groupId: null,
            path: pathName
        })

        router.push('/')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 flex flex-col justify-start gap-10">
                <FormField
                control={form.control}
                name="gist"
                render={({ field }) => (
                    <FormItem className='flex flex-col w-full gap-3'>
                        <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                            <Textarea rows={5} className='account-form_input' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type='submit' className='bg-primary-500'>
                    Post
                </Button>
            </form>
        </Form>
    )
}

export default PostGist