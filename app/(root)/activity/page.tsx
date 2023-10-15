import { fetchUser, getUserActivity } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

const Page = async () => {

  const user = await currentUser()

  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if(!userInfo?.onboarded) redirect('/onboarding')

  //get user activity
  const activity = await getUserActivity(userInfo._id)

  return (
    <section>
      <h1 className="head-text mb-10">
        Activity
      </h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/gist/${activity.parentId}`}>
                <article className="activity-card">
                  <Image src={activity.author.image} alt="user-img" width={20} height={20} className="rounded-full object-cover" />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replied "{activity.text}" to your gist.
                  </p>
                </article>
              </Link>
            ))}
          </>
        ): (
          <p className="!text-base-regular text-light-3">
            No activity
          </p>
        )}
      </section>
    </section>
  )
}

export default Page