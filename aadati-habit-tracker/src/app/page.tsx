import Link from "next/link";
import { ArrowLeft, Flame, ShieldCheck, Gauge, CalendarDays } from "lucide-react";
import { fixtureCategories } from "@/lib/fixtures/categories";
import { fixtureHabits } from "@/lib/fixtures/habits";
import { fixtureHomeContent } from "@/lib/fixtures/home-content";
import { PageContainer } from "@/components/shared/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const hero = fixtureHomeContent.hero;
  const principles = fixtureHomeContent.principles;
  const features = fixtureHomeContent.features;
  return (
    <PageContainer className="space-y-16 md:space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-emerald-50 to-amber-50 px-8 py-16 md:px-16 md:py-24">
        <div className="absolute -start-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-12 -end-12 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-6 text-center md:text-start">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {hero.title}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">{hero.subtitle}</p>
          <div className="flex gap-3 pt-4 justify-center md:justify-start">
            <Link href="/today" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition">
              <Flame size={18} /> {hero.primaryCta}
            </Link>
            <Link href="/habits" className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-base font-semibold hover:bg-muted transition">
              {hero.secondaryCta} <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section>
        <h2 className="text-2xl font-extrabold mb-8">المبادئ اللي بتبنّي عليها عاداتي</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <Card key={p.id} className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-card to-card/60 hover:-translate-y-0.5 transition-transform">
              <CardContent className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-emerald-500 text-white shadow">
                  <span className="text-lg font-extrabold">{p.title[0]}</span>
                </div>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6">إيه اللي بيميّز عاداتي</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.id} className="border shadow-sm bg-gradient-to-br from-white/80 to-white/40">
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-bold">{f.id}</Badge>
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick categories */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6">التصنيفات</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fixtureCategories.map((c) => (
            <Link key={c.id} href={`/categories`} className="group block rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow ${c.color === "sky" ? "bg-sky-500" : c.color === "emerald" ? "bg-emerald-500" : c.color === "violet" ? "bg-violet-500" : "bg-amber-500"}`}>{c.title[0]}</span>
                <h3 className="text-base font-extrabold">{c.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{c.description}</p>
              <p className="text-xs font-semibold text-primary">{fixtureHabits.filter((h) => h.categoryId === c.id).length} عادة</p>
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
