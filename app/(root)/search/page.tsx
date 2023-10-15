import UserCard from "@/components/cards/UserCard"
import GistTab from "@/components/shared/GistTab"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { redirect } from "next/navigation"

const Page = async () => {

    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')

    // fetch all users
    const searchResults = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    })
  return (
    <section>
        <h1 className="head-text mb-10">
            Search
        </h1>
        {/* search bar */}
        <div className="mt-14 flex flex-col gap-9">
            {searchResults.users.length === 0 ? (
                <p className="no-result">
                    No users found
                </p>
            ): (
                <>
                    {searchResults.users.map((user) => (
                        <UserCard
                            key={user.id}
                            id={user.id}
                            name={user.name}
                            username={user.username}
                            imgUrl={user.image}
                            userType='User'  
                        />
                    ))}
                </>
            )}
        </div>
    </section>
  )
}

export default Page