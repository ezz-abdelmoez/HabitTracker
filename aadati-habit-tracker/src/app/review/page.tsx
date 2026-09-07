import { PageContainer } from "@/components/shared/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { fixtureHabits } from "@/lib/fixtures/habits";

export default function ReviewPage() {
  const weekStart = "2026-09-07"; // Monday for demo
  return (
    <PageContainer>
      <h1 className="text-3xl font-extrabold mb-2">مراجعة الأسبوع</h1>
      <p className="text-muted-foreground mb-6">من {weekStart} إلى {new Date(new Date(weekStart).getTime() + 6 * 86400000).toISOString().slice(0,10)}</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-right py-2 px-3 font-bold">العادة</th>
              {["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map((d) => (
                <th key={d} className="text-center py-2 px-2 font-bold min-w-[3.5rem]">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fixtureHabits.map((h) => (
              <tr key={h.id} className="border-b hover:bg-muted/40">
                <td className="py-2 px-3 font-semibold whitespace-nowrap">{h.title}</td>
                {Array.from({ length: 7 }).map((_, i) => {
                  const done = Math.random() > 0.4 ? true : false;
                  return (
                    <td key={i} className="text-center py-2 px-1">
                      <span className={`inline-block h-6 w-6 rounded-md ${done ? "bg-emerald-400" : Math.random() > 0.6 ? "bg-amber-300" : "bg-muted"}`} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">مجموع الدقايق</p>
            <p className="text-2xl font-extrabold">1,840 دق</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">النسبة المكتملة</p>
            <p className="text-2xl font-extrabold">67%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">مؤشر السقف</p>
            <p className="text-2xl font-extrabold">1,840 / 3,000</p>
            <p className="text-xs text-muted-foreground">أقل من السقف ✅</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
