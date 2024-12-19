'use client';
import React, { useCallback } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiHomeCircle, BiHash, BiBell, BiEnvelope, BiBookmark, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { Inter } from "next/font/google";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FeedCard from "@/components/FeedCard";
import toast from "react-hot-toast";
import { graphql_client } from "@/clients/api";
import { verify_user_google_token } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query"; 

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
  // console.log(user);

  const query_client = useQueryClient();

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
        <div className="col-span-3 pt-1">
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
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600">
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
