import GistCard from "@/components/cards/GistCard";
import { fetchGists } from "@/lib/actions/gist.actions";
import { currentUser } from "@clerk/nextjs";
 
export default async function Home() {

  const results = await fetchGists(1, 30)

  const user = await currentUser()

  console.log(results)

  return (
    <>
      <section className="flex flex-col gap-5">
        {results.gists.length === 0 ? (
          <p className="no-result">
            No gists for you
          </p>
        ): (
          <>
            {results.gists.map((gist) => (
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
            ))}
          </>
        )}
      </section>
    </>
  )
}
