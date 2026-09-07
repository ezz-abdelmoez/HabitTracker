import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main id="main-content" className={cn("mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12", className)}>{children}</main>;
}
