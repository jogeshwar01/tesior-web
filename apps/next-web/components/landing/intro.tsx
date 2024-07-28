import { Spotlight } from "@/components/custom/spotlight";
import { Github, Twitter } from "@/components/shared/icons";

export default function Intro() {
  return (
    <div className="z-10 w-full max-w-xl mt-24 px-5 xl:px-0 bg-grid-white/[0.03] ">
      <Spotlight
        className="-top-40 left-0 md:left-40 md:-top-20"
        fill="white"
      />
      <a
        href="https://x.com/jogeshwar01"
        target="_blank"
        rel="noreferrer"
        className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-gray-200 px-7 py-2 transition-colors hover:bg-gray-300"
      >
        <Twitter className="h-5 w-5 text-[#a0a0a0]" />
        <p className="text-sm font-semibold text-[#000000]">
          Introducing Tesior
        </p>
      </a>
      <h1
        className="animate-fade-up text-white bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        Open Source Web3 Bounties
      </h1>
      <p
        className="mt-6 animate-fade-up text-center text-accent-6 opacity-0 [text-wrap:balance] md:text-xl"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        Empower Your Project with Crypto Rewards. Tesior enables project
        maintainers to distribute bounties efficiently to contributors.
      </p>
      <div
        className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-accent-3 bg-black px-5 py-2 text-sm text-white shadow-md transition-colors hover:border-white"
          href="https://github.com/jogeshwar01/tesior-web"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>
            <span className="hidden sm:inline-block">Star on</span> GitHub
          </p>
        </a>
      </div>
    </div>
  );
}
