import { PageContainer } from "@/components/shared/page-container";
import { fixtureHabits } from "@/lib/fixtures/habits";
import { fixtureCategories } from "@/lib/fixtures/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, ShieldCheck, Clock, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-extrabold mb-8">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-md">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200"><ShieldCheck size={22} /></div>
            <div>
              <p className="text-3xl font-extrabold">{fixtureHabits.length}</p>
              <p className="text-xs text-muted-foreground">عدد العادات النشطة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white shadow-md">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200"><Flame size={22} /></div>
            <div>
              <p className="text-3xl font-extrabold">{fixtureCategories.length}</p>
              <p className="text-xs text-muted-foreground">تصنيفات</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-white shadow-md">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-2xl bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-200"><Zap size={22} /></div>
            <div>
              <p className="text-3xl font-extrabold">{fixtureHabits.reduce((s, h) => s + (h.schedule?.targetPerWeek ?? 1), 0)}</p>
              <p className="text-xs text-muted-foreground">جلسة مستهدفة/أسبوع</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="py-5">
            <h3 className="font-extrabold mb-4">أقوى السلاسل</h3>
            <div className="space-y-3">
              {fixtureHabits.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                  <span className="font-semibold">{h.title}</span>
                  <span className="font-mono text-xs">{3 + Math.floor(Math.random() * 15)} يوم</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <h3 className="font-extrabold mb-4">توزيع التصنيفات</h3>
            <div className="space-y-3">
              {fixtureCategories.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                  <span className="font-semibold">{c.title}</span>
                  <span className="font-mono text-xs">{fixtureHabits.filter((h) => h.categoryId === c.id).length} عادة</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
