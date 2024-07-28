import { ReactNode } from "react";

export default function Card({
  title,
  description,
  demo,
  large,
}: {
  title: string;
  description: string;
  demo: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`relative col-span-1 h-96 overflow-hidden rounded-md border border-accent-3 bg-custom-black-100 shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex h-60 items-center justify-center">{demo}</div>
      <div className="mx-auto max-w-md text-center">
        <h2 className="bg-gradient-to-br text-white bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
          {title}
        </h2>
        <div className="prose-sm mt-3 leading-normal text-muted-foreground [text-wrap:balance] md:prose">
          {description}
        </div>
      </div>
    </div>
  );
}
