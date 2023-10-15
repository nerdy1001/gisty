'use client'

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  userType: string;
}

const UserCard = ({ id, name, username, imgUrl, userType}: UserCardProps) => {
    const router = useRouter()
  return (
    <article className="user-card">
        <div className="user-card_avatar">
            <Image src={imgUrl} alt="user-img" height={48} width={48} className="rounded-full" />
            {/* text-ellipsis shortens text that overflows with ... */}
            <div className="flex-1 text-ellipsis">
                <h4 className="text-base-semibold text-light-1">
                    {name}
                </h4>
                <p className="text-small-medium text-gray-1">
                    @{username}
                </p>
            </div>
        </div>
        <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
            View
        </Button>
    </article>
  )
}

export default UserCard