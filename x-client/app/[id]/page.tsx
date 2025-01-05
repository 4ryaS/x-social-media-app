'use client';
import { useParams } from 'next/navigation';
import XLayout from "@/components/Layout/XLayout";
import Image from "next/image";
import type { NextPage } from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Post } from "@/gql/graphql";
import { useCallback, useEffect, useMemo } from 'react';
import { graphql_client } from '@/clients/api';
import { follow_user_mutation, unfollow_user_mutation } from '@/graphql/mutation/user';
import { useQueryClient } from '@tanstack/react-query';

const UserProfilePage: NextPage = () => {
    const { user: current_user } = useCurrentUser();

    const query = useParams();
    // console.log(query);
    const id: string = query?.id as string || ``;

    const { user, refetch } = useGetUserById(id);

    const query_client = useQueryClient();

    useEffect(() => {
        // Re-fetch data when the `id` changes (e.g., when navigating between users)
        refetch();
    }, [id, refetch]);  // Effect runs when the `id` changes

    const is_following = useMemo(() => {
        if (!user) return false;
        return (
            (current_user?.following?.findIndex(
                (some_user) => some_user?.id === user?.id
            ) ?? -1) >= 0
        );
    }, [current_user?.following, user]);

    const handle_follow_user = useCallback(async () => {
        if (!user?.id) return;
        await graphql_client.request(follow_user_mutation, { to: user?.id });
        await query_client.invalidateQueries({ queryKey: ["current-user"] });
        refetch();
    }, [user?.id, query_client, refetch]);

    const handle_unfollow_user = useCallback(async () => {
        if (!user?.id) return;
        await graphql_client.request(unfollow_user_mutation, { to: user?.id });
        await query_client.invalidateQueries({ queryKey: ["current-user"] });
        refetch();
    }, [user?.id, query_client, refetch]);

    if (!user) {

        return (
            <XLayout>
                {/* <h1 className="text-2xl font-bold mt-5 text-center mx-auto">User Not Found</h1> */}
                <h1></h1>
            </XLayout>
        )
    }

    else {
        return (user &&
            <div>
                <XLayout>
                    <div>
                        <nav className="flex items-center gap-3 py-3 px-3">
                            <BsArrowLeftShort className="text-4xl" />
                            <div>
                                <h1 className="text-xl font-bold">{user?.first_name || "User"} {user?.last_name || ""}</h1>
                                <h1 className="text-md font-bold text-slate-500">{user.posts?.length} Posts</h1>
                            </div>
                        </nav>
                        <div className="p-4 border-b border-slate-800">
                            {user && (<Image className="rounded-full" src={user?.profile_img_url || `https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1`} alt="User Image" width={100} height={100} />)}
                            <h1 className="text-2xl font-bold mt-5">{user?.first_name || "User"} {user?.last_name || ""}</h1>
                            <div className='flex justify-between items-center'>
                                <div className="flex gap-4 text-sm mt-2 text-gray-400">
                                    <span>{user.followers?.length} Followers</span>
                                    <span>{user.following?.length} Following</span>
                                </div>
                                {
                                    (current_user?.id !== user?.id) && current_user && (
                                        <>
                                            {/* {
                                                (user?.following?.findIndex(some_user => some_user?.id === current_user?.id) ?? -1) >= 0 ? <button className="bg-white text-black px-3 py-1 rounded-full text">Unfollow</button> : <button className="bg-white text-black px-3 py-1 rounded-full text">Follow</button>
                                            } */}
                                            {is_following ? (
                                                <button onClick={handle_unfollow_user} className="bg-white text-black px-3 py-1 rounded-full text">Unfollow</button>
                                            ) : (<button onClick={handle_follow_user} className="bg-white text-black px-3 py-1 rounded-full text">Follow</button>)}
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <div>
                            {user?.posts?.map(post => <FeedCard data={post as Post} key={post?.id} />)}
                        </div>
                    </div>
                </XLayout>
            </div>
        )
    };
}




export default UserProfilePage;