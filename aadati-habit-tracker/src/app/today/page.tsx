import { PageContainer } from "@/components/shared/page-container";
import { fixtureHabits } from "@/lib/fixtures/habits";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, Clock, Flame } from "lucide-react";

export default function TodayPage() {
  const today = new Date().toISOString().slice(0, 10);
  // Demo: compute simple status based on fixture seed
  const items = fixtureHabits.map((h) => {
    const scheduled = h.schedule.mode === "daily" || (h.schedule.mode === "fixedDays" ? (h.schedule.days ?? []).includes(new Date(today).getUTCDay()) : true);
    const completed = Math.random() > 0.35;
    return {
      ...h,
      scheduled,
      completed,
      status: completed ? (scheduled ? "completed" : "planned") : (scheduled ? "pending" : (h.schedule.mode === "fixedDays" ? "at-risk" : "rest")),
      streak: 5 + Math.floor(Math.random() * 20),
    };
  });
  const completed = items.filter((i) => i.completed).length;
  const scheduledCount = items.filter((i) => i.scheduled).length;

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold">النهاردة</h1>
          <Badge variant="outline" className="text-sm">{today}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="flex items-center gap-4 py-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200"><ShieldCheck size={22} /></span>
              <div>
                <p className="text-3xl font-extrabold">{completed}</p>
                <p className="text-sm text-muted-foreground">من <span className="font-bold">{scheduledCount}</span> عادات متاحة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="flex items-center gap-4 py-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200"><Zap size={22} /></span>
              <div>
                <p className="text-sm text-muted-foreground">أقصر سلسلة</p>
                <p className="text-2xl font-extrabold">{Math.min(...items.map((i) => i.streak))} يوم</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-white">
            <CardContent className="flex items-center gap-4 py-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-200"><Clock size={22} /></span>
              <div>
                <p className="text-sm text-muted-foreground">أطول سلسلة</p>
                <p className="text-2xl font-extrabold">{Math.max(...items.map((i) => i.streak))} يوم</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {items.map((h) => (
            <Card key={h.id} className={`relative overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5 ${h.completed ? "border-emerald-200 ring-1 ring-emerald-200" : ""}`}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base">{h.title}</h3>
                  <Badge className={h.completed ? "bg-emerald-500 text-white" : h.status === "pending" ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"}>
                    {h.completed ? "تم" : h.status === "pending" ? "في الانتظار" : h.status === "rest" ? "راحة" : h.status === "at-risk" ? "في خطر" : "مخطط"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{h.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Flame size={14} /> {h.streak} يوم</span>
                  <span>{h.schedule.mode === "daily" ? "يوميًا" : h.schedule.mode === "fixedDays" ? `${(h.schedule.days ?? []).length} أيام` : `${h.schedule.targetPerWeek} مرات`}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
