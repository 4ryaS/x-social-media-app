'use client';
import { useParams } from 'next/navigation';
import XLayout from "@/components/Layout/XLayout";
import Image from "next/image";
import type { NextPage } from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import { useGetUserById } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Post } from "@/gql/graphql";

const UserProfilePage: NextPage = () => {
    // const { user } = useCurrentUser();
    
    const query = useParams();
    // console.log(query);
    const id: string = query?.id as string || ``;

    const { user } = useGetUserById(id);

    if (!user) {
        
        return  (
            <XLayout>
                <h1 className="text-2xl font-bold mt-5 text-center mx-auto">User Not Found</h1>
            </XLayout>
        )
    }


    return ( user &&
        <div>
            <XLayout>
                <div>
                    <nav className="flex items-center gap-3 py-3 px-3">
                        <BsArrowLeftShort className="text-4xl"/>
                        <div>
                            <h1 className="text-xl font-bold">{user?.first_name || "User"} {user?.last_name || ""}</h1>
                            <h1 className="text-md font-bold text-slate-500">{user.posts?.length} Posts</h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                       {user && (<Image className="rounded-full" src={user?.profile_img_url || `https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1`} alt="User Image" width={100} height={100}/>)}
                       <h1 className="text-2xl font-bold mt-5">{user?.first_name || "User"} {user?.last_name || ""}</h1>
                    </div>
                    <div>
                        {user?.posts?.map(post => <FeedCard data={post as Post} key={post?.id}/>)}
                    </div>
                </div>
            </XLayout>
        </div>
    )
};


export default UserProfilePage;