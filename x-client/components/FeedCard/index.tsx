import React from "react";
import Image from "next/image";
import { BiHeart, BiMessageRounded, BiRepost, BiUpload} from "react-icons/bi";

const FeedCard: React.FC = () => {
    return (
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                    <Image src="https://avatars.githubusercontent.com/u/172256773?v=4" alt="User Image" height={50} width={50}/>
                </div>
                <div className="col-span-11">
                    <h5>4ryaS</h5>
                    <p>
                        Web3 is the decentralized internet, powered by blockchain technology. It enables peer-to-peer transactions, ownership of digital assets, and decentralized applications (dApps) without relying on traditional intermediaries. Think of it as the next evolution of the internet, where users have control over their data and digital identity. #Web3 #Blockchain #Decentralization
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