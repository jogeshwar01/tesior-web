import NavLink from "@/components/layout/settings-nav-link";
import { MaxWidthWrapper } from "@/components/shared";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SettingsLayout({
  tabs,
  tabContainerClassName,
  children,
}: {
  tabs: {
    name: string;
    segment: string | null;
  }[];
  tabContainerClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-16px)]">
      <MaxWidthWrapper className="grid items-start gap-8 py-10 lg:grid-cols-5">
        <div
          className={cn(
            "flex flex-wrap gap-1 lg:sticky lg:grid",
            tabContainerClassName,
          )}
        >
          {tabs.map(({ name, segment }) => (
            <NavLink segment={segment}>
              {name}
            </NavLink>
          ))}
        </div>
        <div className="grid gap-5 lg:col-span-4">{children}</div>
      </MaxWidthWrapper>
    </div>
  );
}
