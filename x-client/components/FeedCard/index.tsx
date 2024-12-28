import React from "react";
import Image from "next/image";
import { BiHeart, BiMessageRounded, BiRepost, BiUpload} from "react-icons/bi";
import { Post } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
    data: Post
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const { data } = props;
    return (
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                    {data.author?.profile_img_url && (<Image className="rounded-full" src={data.author.profile_img_url} alt="User Image" height={50} width={50}/>)}
                </div>
                <div className="col-span-11">
                    <Link href={`${data.author?.id}`}>{data.author?.first_name} {data.author?.last_name}</Link>
                    <p>
                        {data.content}
                    </p>
                    <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <BiRepost />
                        </div>
                        <div>
                            <BiHeart />
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