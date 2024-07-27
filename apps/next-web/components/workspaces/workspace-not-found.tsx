import { MaxWidthWrapper } from "@/components/shared";
import { FileX2 } from "lucide-react";
import Link from "next/link";

export default function WorkspaceNotFound() {
  return (
    <MaxWidthWrapper>
      <div className="my-10 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-muted/50 py-12">
        <div className="rounded-full bg-gray-100 p-3">
          <FileX2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="my-3 text-xl font-semibold">Workspace Not Found</h1>
        <p className="z-10 max-w-sm text-center text-sm text-muted-foreground">
          The workspace you are looking for does not exist. You either typed in
          the wrong URL or don't have access to this workspace.
        </p>
        <Link
          href="/"
          className="z-10 mt-5 rounded-md border border-black bg-black px-10 py-2 text-sm font-medium text-white transition-all duration-75 hover:bg-white hover:text-black"
        >
          Back to home page
        </Link>
      </div>
    </MaxWidthWrapper>
  );
}
