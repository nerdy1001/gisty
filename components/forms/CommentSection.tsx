'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidator } from '@/lib/validators/gist'
import { CommentToGist } from '@/lib/actions/gist.actions'
import Image from 'next/image'


interface CommentSectionProps {
  gistId: string;
  currentUserImg: string;
  currentUserId: string;
}

const CommentSection = ({ gistId, currentUserId, currentUserImg }: CommentSectionProps) => {

    const pathName = usePathname()
    const router = useRouter()

    const form = useForm({
      resolver: zodResolver(CommentValidator),
      defaultValues: {
        gist: '',
      }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidator>) => {
        await CommentToGist(gistId, values.gist, JSON.parse(currentUserId), pathName)

        form.reset()
    }
  return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                control={form.control}
                name="gist"
                render={({ field }) => (
                    <FormItem className='flex items-center w-full gap-3'>
                        <FormLabel>
                            <Image src={currentUserImg} alt='profile-img' width={48} height={48} className='rounded-full object-cover' />
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input type='text' placeholder="what's on your mind ?" className='no-focus text-light-1 outline-none' {...field} />
                        </FormControl>
                    </FormItem>
                )}
                />
                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default CommentSection