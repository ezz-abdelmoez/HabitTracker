import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Flame } from "lucide-react";

export function MainNav() {
  return (
    <nav aria-label="التنقل الرئيسي" className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-foreground">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 text-white shadow-md">
            <Flame size={20} strokeWidth={2.5} />
          </span>
          <span className="bg-gradient-to-tr from-primary via-emerald-600 to-primary bg-clip-text text-transparent">{siteConfig.name}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex" dir="rtl">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">{item.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
