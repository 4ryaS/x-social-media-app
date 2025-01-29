import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiMessageRounded, BiRepost, BiUpload } from "react-icons/bi";
import { Post } from "@/gql/graphql";
import Link from "next/link";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useCurrentUser, useDeleteRepost, useLikePost, useRepostPost, useUnlikePost } from "@/hooks/user";

interface FeedCardProps {
    data: Post
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const { data } = props;
    const { user } = useCurrentUser();
    const { mutate: like_post } = useLikePost();
    const { mutate: unlike_post } = useUnlikePost();
    const { mutate: repost_post } = useRepostPost();
    const { mutate: delete_repost } = useDeleteRepost();
    const [liked, set_liked] = useState<boolean>();
    const [reposted, set_reposted] = useState<boolean>();
    const [likes_count, set_likes_count] = useState(data.likes ? data.likes.length : 0);

    useEffect(() => {
        if (user) {
            // Check if the user has liked the post
            // console.log(data.likes);    
            const user_has_liked = data.likes?.some(like => like?.user_id === user.id && like.post_id === data.id);
            // console.log(user_has_liked);
            // console.log(user.id);
            set_liked(user_has_liked);
        }
    }, [user, data.likes, data.id]);

    useEffect(() => {
        const user_has_reposted = data.reposts?.some((repost) => repost?.author.id === user?.id && repost?.post.id === data.id);
        // console.log(data.reposts);
        set_reposted(user_has_reposted);
    }, [user, data.reposts, data.id, set_reposted, data]);


    const handle_like = useCallback(() => {
        if (!user) return;
        if (liked) {
            unlike_post(data.id);
            set_liked(false);
            set_likes_count(likes_count - 1);
        }
        else {
            like_post(data.id)
            set_liked(true);
            set_likes_count(likes_count + 1);
        }
    }, [user, liked, unlike_post, data.id, likes_count, like_post]);

    const handle_repost = useCallback(() => {
        if (!user) return;
        if (reposted) {
            delete_repost(data.id);
            set_reposted(false);
        }
        else {
            repost_post(data.id);
            set_reposted(true);
        }
    }, [data.id, delete_repost, repost_post, reposted, user]);


    return (
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                    {data.author?.profile_img_url && (<Image className="rounded-full" src={data.author.profile_img_url} alt="User Image" height={50} width={50} />)}
                </div>
                <div className="col-span-11">
                    <Link href={`${data.author?.id}`}>{data.author?.first_name} {data.author?.last_name}</Link>
                    <p>
                        {data.content}
                    </p>
                    {
                        data.image_url && <Image src={data.image_url} alt="Image" width={300} height={300} />
                    }
                    <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            {reposted ? (<BiRepost onClick={handle_repost}
                                style={{
                                    cursor: "pointer",
                                    color: "#11fa88",
                                    transition: "color 0.3s ease",
                                }}
                            />) : (<BiRepost onClick={handle_repost}
                                style={{
                                    cursor: "pointer",
                                    color: "gray",
                                    transition: "color 0.3s ease",
                                }}
                            />)}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {/* Conditionally render the appropriate icon based on the 'liked' state */}
                                {liked ? (
                                    <AiFillHeart
                                        onClick={handle_like}
                                        style={{
                                            cursor: 'pointer',
                                            color: 'red', // Red when liked
                                            transition: 'color 0.4s ease',
                                            marginRight: '8px', // Space between the heart icon and the like count
                                        }}
                                    />
                                ) : (
                                    <AiOutlineHeart
                                        onClick={handle_like}
                                        style={{
                                            cursor: 'pointer',
                                            marginRight: '8px', // Space between the heart icon and the like count
                                        }}
                                    />
                                )}
                                <p className="text-sm" style={{ margin: 0 }}>
                                    {likes_count}
                                </p>
                            </div>
                        </div>

                        <div>
                            <BiUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedCard;