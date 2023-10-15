import { fetchUserGists } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { FC } from 'react'
import GistCard from '../cards/GistCard';

interface GistTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string
}

const GistTab = async ({ currentUserId, accountId, accountType }: GistTabProps) => {
    let result = await fetchUserGists(accountId)

    if(!result) redirect('/')

  return (
    <section className='mt-9 flex flex-col gap-10'>
        {result.gists.map((gist: any) => (
            <GistCard 
                key={gist._id} 
                id={gist._id} 
                currentUserId={currentUserId} 
                content={gist.text}
                parentId={gist.parentId}
                author={
                    accountType === 'User' ? {
                        name: result.name,
                        image: result.image,
                        id: result.id
                    } : {
                        name: gist.author.name,
                        image: gist.author.image,
                        id: gist.author.id
                    }
                }
                group={gist.group} //todo: update groupId
                createdAt={gist.createdAt}
                comments={gist.children}
            />
        ))}
    </section>
  )
}

export default GistTab