import { PageContainer } from "@/components/shared/page-container";
import { fixtureHabits } from "@/lib/fixtures/habits";
import { fixtureCategories } from "@/lib/fixtures/categories";
import { fixtureResources } from "@/lib/fixtures/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HabitDetailPage({ params }: { params: { slug: string } }) {
  const habit = fixtureHabits.find((h) => h.slug === params.slug);
  if (!habit) return <PageContainer><h1>العادة غير موجودة</h1></PageContainer>;
  const cat = fixtureCategories.find((c) => c.id === habit.categoryId);
  const resources = fixtureResources.filter((r) => r.habitId === habit.id);
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{cat?.title ?? ""}</span>
          <span>•</span>
          <span>{habit.slug}</span>
        </div>
        <h1 className="text-4xl font-extrabold">{habit.title}</h1>
        <p className="text-muted-foreground text-lg">{habit.description}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{habit.type}</Badge>
          <Badge variant="outline">{habit.status}</Badge>
          <Badge variant="outline">{habit.schedule.mode}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="py-5 space-y-2">
              <h3 className="font-extrabold">الهدف</h3>
              <p className="text-sm text-muted-foreground">كل جلسة بتقربك من مستوى جديد في مسارك المهني والتعليمي.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5 space-y-2">
              <h3 className="font-extrabold">الخطة</h3>
              <p className="text-sm text-muted-foreground">ابدأ بـ 15 دقيقة تركيز. راجع المهام المتبقية من الجلسة السابقة.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5 space-y-2">
              <h3 className="font-extrabold">الموارد</h3>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {resources.map((r) => (
                  <li key={r.id}>• {r.title}</li>
                ))}
                {resources.length === 0 && <li>لا توجد موارد بعد</li>}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="py-5 space-y-3">
            <h3 className="font-extrabold">سيناريوهات المحفز — الاستجابة</h3>
            <div className="space-y-2">
              <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
                <span className="font-bold">لو شعرت بكسل من السوشيال</span>
                <span className="text-muted-foreground block">إذن امشي 5 دقايق بدون موبايل، ارجع وافتح الملف.</span>
              </div>
              <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
                <span className="font-bold">لو الوقت ضايع ومش عارف تبدأ منين</span>
                <span className="text-muted-foreground block">إذن افتح أقرب ملف واقرأ صفحة واحدة بس.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
