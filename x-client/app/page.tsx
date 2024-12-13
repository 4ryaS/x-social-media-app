'use client';
import React, { useCallback } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiHomeCircle, BiHash, BiBell, BiEnvelope, BiBookmark, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { Inter } from "next/font/google";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FeedCard from "@/components/FeedCard";

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

  const handler_google_login = useCallback((credentials: CredentialResponse) => {}, []);
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
          <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-xl">New to X?</h1>
            <GoogleLogin onSuccess={(credentials) => console.log(credentials)} />
          </div>
        </div>
      </div>
    </div>
  );
}
