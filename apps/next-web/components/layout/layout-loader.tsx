import { LoadingSpinner } from "@/components/custom/loading";

export default function LayoutLoader() {
  return (
    <div className="flex h-[calc(100vh-16px)] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
