'use client';
import React, { useCallback } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiHomeCircle, BiHash, BiBell, BiEnvelope, BiBookmark, BiUser, BiImageAlt } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { Inter } from "next/font/google";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FeedCard from "@/components/FeedCard";
import toast from "react-hot-toast";
import { graphql_client } from "@/clients/api";
import { verify_user_google_token } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query"; 
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

interface XSideBarButton {
  title: string,
  icon: React.ReactNode,
}

const SideBarMenuItems: XSideBarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />
  },
  {
    title: "Explore",
    icon: <BiHash />
  },
  {
    title: "Notifications",
    icon: <BiBell />,
  },
  {
    title: "Messages",
    icon: <BiEnvelope />
  },
  {
    title: "Bookmarks",
    icon: <BiBookmark />
  },
  {
    title: "Profile",
    icon: <BiUser />
  },
  {
    title: "More",
    icon: <SlOptions />
  }
];

export default function Home() {

  const { user } = useCurrentUser();
  const query_client = useQueryClient();
  // console.log(user);

  const handle_select_image = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  }, []);
  
  const handler_google_login = useCallback(async (credentials: CredentialResponse) => {
    const google_token = credentials.credential;
    if (!google_token) {
      return toast.error(`Google Token Not Found`);
    }
    
    try {
      const { verify_google_token } = await graphql_client.request(verify_user_google_token, {token: google_token});
      toast.success("Verified Successfully");
      console.log(verify_google_token);
  
      if (verify_google_token) {
        window.localStorage.setItem("x_token", verify_google_token);
      }
  
      await query_client.invalidateQueries({ queryKey: ['current-user'] })
    } catch (error) {
      console.error("Error verifying Google token:", error);
      // toast.error(`Failed to verify Google token: ${error.message || "Unknown error"}`);
    }
  }, [query_client]);
  return (
    <div className={inter.className}>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1 relative">
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <FaXTwitter />
          </div>
          <div className="mt-4 text-xl pr-4">
            <ul>
              {SideBarMenuItems.map((item) => (
                <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-5 py-2 w-fit cursor-pointer" key={item.title}>
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.title}</span>
                  </li>
                ))}
            </ul>
            <div className="mt-5 px-2">
              <button className="bg-[#1d9bf0] font-semibold text-lg rounded-full w-full py-2 px-4">Post</button>
            </div>
          </div>
          {user && (<div className="absolute bottom-36 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
            {user && user.profile_img_url && <Image className="rounded-full" src={user?.profile_img_url} alt="user-image" height={50} width={50} />}
            <div>
              <h3>{user?.first_name} {user?.last_name}</h3>
            </div>
          </div>)}
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600">
          {user && (<div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                {user?.profile_img_url && (<Image className="rounded-full" src={`${user?.profile_img_url}`} alt="User Image" height={50} width={50}/>)}
                </div>
                <div className="col-span-11">
                  <textarea className="border w-full bg-transparent px-2 py-1 border-b border-slate-700" placeholder="What's new?" rows={3}></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt onClick={handle_select_image} className="text-xl" />
                    <button className="bg-[#1d9bf0] font-semibold text-sm rounded-full w py-1 px-4">Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
          <FeedCard></FeedCard>
          <FeedCard></FeedCard>
          <FeedCard></FeedCard>
        </div>
        <div className="col-span-3 p-5">
          {!user && (<div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-xl">New to X?</h1>
            <GoogleLogin onSuccess={handler_google_login} />
          </div>)}
        </div>
      </div>
    </div>
  );
}
