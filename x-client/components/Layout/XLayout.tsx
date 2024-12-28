import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo } from "react";
import {
    BiBell,
    BiBookmark,
    BiEnvelope,
    BiHash,
    BiHomeCircle,
    BiUser,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphql_client } from "@/clients/api";
import { useQueryClient } from "@tanstack/react-query";
import { verify_user_google_token } from "@/graphql/query/user";
import Link from "next/link";

interface XLayoutProps {
    children: React.ReactNode;
}

interface XSideBarButton {
    title: string;
    icon: React.ReactNode;
    link: string;
}



const XLayout: React.FC<XLayoutProps> = (props) => {
    const { user } = useCurrentUser();
    const query_client = useQueryClient();

    const SideBarMenuItems: XSideBarButton[] = useMemo(() =>  [
        {
            title: "Home",
            icon: <BiHomeCircle />,
            link: '/',
        },
        {
            title: "Explore",
            icon: <BiHash />,
            link: '/',
        },
        {
            title: "Notifications",
            icon: <BiBell />,
            link: '/',
        },
        {
            title: "Messages",
            icon: <BiEnvelope />,
            link: '/',
        },
        {
            title: "Bookmarks",
            icon: <BiBookmark />,
            link: '/',
        },
        {
            title: "Profile",
            icon: <BiUser />,
            link: `/${user?.id}`,
        },
        {
            title: "More",
            icon: <SlOptions />,
            link: '/',
        },
    ], [user?.id]);

    const handler_google_login = useCallback(
        async (credentials: CredentialResponse) => {
            const google_token = credentials.credential;
            if (!google_token) {
                return toast.error(`Google Token Not Found`);
            }

            try {
                const { verify_google_token } = await graphql_client.request(
                    verify_user_google_token,
                    { token: google_token }
                );
                toast.success("Verified Successfully");
                console.log(verify_google_token);

                if (verify_google_token) {
                    window.localStorage.setItem("x_token", verify_google_token);
                }

                await query_client.invalidateQueries({ queryKey: ["current-user"] });
            } catch (error) {
                console.error("Error verifying Google token:", error);
                // toast.error(`Failed to verify Google token: ${error.message || "Unknown error"}`);
            }
        },
        [query_client]
    );

    return (
        <div>
            <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
                <div className="col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
                    <div>
                    <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
                        <FaXTwitter />
                    </div>
                    <div className="mt-4 text-xl pr-4">
                        <ul>
                            {SideBarMenuItems.map((item) => (
                                <li
                                    key={item.title}
                                >
                                    <Link className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-5 py-2 w-fit cursor-pointer" href={item.link}>
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="hidden sm:inline">{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5 px-2">
                            <button className="hidden sm:block bg-[#1d9bf0] font-semibold text-lg rounded-full w-full py-2 px-4">
                                Post
                            </button>
                            <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg rounded-full w-full py-2 px-4">
                                <FaXTwitter/>
                            </button>
                        </div>
                    </div>
                    </div>
                    {user && (
                        <div className="left-11 absolute bottom-36 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
                            {user && user.profile_img_url && (
                                <Image
                                    className="rounded-full"
                                    src={user?.profile_img_url}
                                    alt="user-image"
                                    height={50}
                                    width={50}
                                />
                            )}
                            <div className="hidden sm:block">
                                <h3>
                                    {user?.first_name} {user?.last_name}
                                </h3>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] border-gray-600">
                    {props.children}
                </div>
                <div className="col-span-0 sm:col-span-3 p-5">
                    {!user && (
                        <div className="p-5 bg-slate-700 rounded-lg">
                            <h1 className="my-2 text-xl">New to X?</h1>
                            <GoogleLogin onSuccess={handler_google_login} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default XLayout;
