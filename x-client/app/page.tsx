'use client';
import React, { useCallback, useState } from "react";
import { Inter } from "next/font/google";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useCreatePost, useGetAllPosts } from "@/hooks/post";
import { Post } from "@/gql/graphql";
import XLayout from "@/components/Layout/XLayout";
import { BiImageAlt } from "react-icons/bi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { user } = useCurrentUser();
  const { posts = [] } = useGetAllPosts();
  const { mutate } = useCreatePost();
  // console.log(user);

  const [content, set_content] = useState('');

  const handle_select_image = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  }, []);

  const handle_create_post = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);


  return (
    <div className={inter.className}>
      <XLayout>
        {user && (
          <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  {user?.profile_img_url && (
                    <Image
                      className="rounded-full"
                      src={`${user?.profile_img_url}`}
                      alt="User Image"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={(e) => set_content(e.target.value)}
                    className="border w-full bg-transparent px-2 py-1 border-b border-slate-700"
                    placeholder="What's new?"
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt
                      onClick={handle_select_image}
                      className="text-xl"
                    />
                    <button
                      onClick={handle_create_post}
                      className="bg-[#1d9bf0] font-semibold text-sm rounded-full w py-1 px-4"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {posts?.map((post) =>
          post ? <FeedCard key={post?.id} data={post as Post} /> : null
        )}
      </XLayout>
    </div>
  );
}
