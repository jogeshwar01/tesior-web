"use client";

import Image from "next/image";
import { Tabs } from "@/components/custom/tabs";

export default function DemoTabs() {
  const tabs = [
    {
      title: "Tasks",
      value: "tasks",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-white bg-gradient-to-br from-custom-black-100 via-accent-1 to-custom-black-100">
          <p>Create Tasks in a Project</p>
          <TabContent image="https://github.com/user-attachments/assets/163e5632-9de0-4ff8-990e-78443f714ddc" />
        </div>
      ),
    },
    {
      title: "Transfers",
      value: "transfers",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-white bg-gradient-to-br from-custom-black-100 via-accent-1 to-custom-black-100">
          <p>Send/Receive Transfers</p>
          <TabContent image="https://github.com/user-attachments/assets/596fb421-58dd-478a-ac58-2ff528ca8e6f" />
        </div>
      ),
    },
    {
      title: "Tesior Wallet",
      value: "tesior-wallet",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-white bg-gradient-to-br from-custom-black-100 via-accent-1 to-custom-black-100">
          <p>Tesior Wallet - Withdraw/Deposit Solana</p>
          <TabContent image="https://github.com/user-attachments/assets/0f768f3b-8c8b-4d56-b748-8394a9fed8f0" />
        </div>
      ),
    },
    {
      title: "Manage People",
      value: "manage-people",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-white bg-gradient-to-br from-custom-black-100 via-accent-1 to-custom-black-100">
          <p>Manage people in your project</p>
          <TabContent image="https://github.com/user-attachments/assets/bc5d98ef-9b57-4158-84b6-50d42921acc0" />
        </div>
      ),
    },
    {
      title: "Github Bounties",
      value: "github-bounties",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-white bg-gradient-to-br from-custom-black-100 via-accent-1 to-custom-black-100">
          <p>Reward Contributors through Github Comments</p>
          <TabContent image="https://github.com/user-attachments/assets/584eed95-3e99-476d-9a71-8899adac6a45" />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}

const TabContent = ({ image }: { image: string }) => {
  return (
    <Image
      src={image}
      quality={90}
      priority
      alt="tab image"
      width="1000"
      height="1000"
      className="object-contain h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
