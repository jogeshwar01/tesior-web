import { LoadingSpinner } from "@/components/shared/icons";

export default function LayoutLoader() {
  return (
    <div className="flex h-[calc(100vh-16px)] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
