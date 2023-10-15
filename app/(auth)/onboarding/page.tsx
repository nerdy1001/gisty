import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {

    const user = await currentUser()
    if (!user) return null; // to avoid typescript warnings

    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded) redirect("/");

    const userData = {
        id: user?.id,
        objectId: userInfo?.id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image: userInfo?.image || user?.imageUrl
    }
    return (
        <main className="mx-auto flex md:max-w-3xl max-w-screen-sm flex-col justify-start md:px-10 px-5 md:py-20 py-10">
            <h1 className="head-text">
                Welcome to Gisty
            </h1>
            <p className="mt-3 text-base-regular text-light-2">
                Finish setting up your account
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    )
}