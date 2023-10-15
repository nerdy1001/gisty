import GistCard from "@/components/cards/GistCard"
import CommentSection from "@/components/forms/CommentSection";
import { fetchGistById } from "@/lib/actions/gist.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string }}) => {
    if (!params.id) return null;

    const user = await currentUser() 
    if(!user) return null

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')

    const gist = await fetchGistById(params.id)

    console.log(gist.children)

    return (
        <section className="relative">
            <div>
                <GistCard 
                    key={gist._id} 
                    id={gist._id} 
                    currentUserId={user?.id || ''} 
                    content={gist.text}
                    parentId={gist.parentId}
                    author={gist.author}
                    group={gist.group}
                    createdAt={gist.createdAt}
                    comments={gist.children}
                />
            </div>
            <div className="mt-7">
                <CommentSection
                    gistId={gist.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {gist.children.map((child: any) => (
                    <GistCard 
                        key={child._id} 
                        id={child._id} 
                        currentUserId={child?.id || ''} 
                        content={child.text}
                        parentId={child.parentId}
                        author={child.author}
                        group={child.group}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default Page