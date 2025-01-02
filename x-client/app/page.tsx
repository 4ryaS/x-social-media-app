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
import axios from "axios";
import toast from "react-hot-toast";
import { graphql_client } from "@/clients/api";
import { get_signed_url_for_post_query } from "@/graphql/query/post";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { user } = useCurrentUser();
  const { posts = [] } = useGetAllPosts();
  const { mutate } = useCreatePost();
  // console.log(user);

  const [content, set_content] = useState('');
  const [image_url, set_image_url] = useState('');

  const handle_input_change_file = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;

      const { get_signed_url_for_post } = await graphql_client.request(get_signed_url_for_post_query, {
        image_name: file.name,
        image_type: file.type,
      });

      if (get_signed_url_for_post) {
        toast.loading("Uploading...", { id: "2" });
        await axios.put(get_signed_url_for_post, file, {
          headers: {
            "Content-Type": file.type
          },
        });
        toast.success("Uploaded!", { id: "2" });
        const url = new URL(get_signed_url_for_post);
        const file_path = `${url.origin}${url.pathname}`;
        set_image_url(file_path);
      }
    }
  }, []);

  const handle_select_image = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    const handler_fn = handle_input_change_file(input);

    input.addEventListener("change", handler_fn);

    input.click();
  }, [handle_input_change_file]);

  const handle_create_post = useCallback(() => {
    mutate({
      content,
      image_url
    });
    set_content('');
    set_image_url('');
  }, [content, mutate, image_url]);


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
                  {
                    image_url && <Image src={image_url} alt="post-image" width={300} height={300} />
                  }
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
