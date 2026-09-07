import { PageContainer } from "@/components/shared/page-container";
import { fixtureHabits } from "@/lib/fixtures/habits";
import { fixtureCategories } from "@/lib/fixtures/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HabitsPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-extrabold mb-8">كل العادات</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {fixtureHabits.map((h) => {
          const cat = fixtureCategories.find((c) => c.id === h.categoryId);
          return (
            <Link key={h.id} href={`/habits/${h.slug}`} className="block group">
              <Card className="h-full border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{cat?.title ?? ""}</Badge>
                    <Badge variant="outline" className="text-xs">{h.type}</Badge>
                  </div>
                  <h3 className="font-extrabold text-lg">{h.title}</h3>
                  <p className="text-xs text-muted-foreground">{h.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                    <span>سلسلة: {3 + Math.floor(Math.random() * 15)} يوم</span>
                    <span>أسبوع: {40 + Math.floor(Math.random() * 40)}%</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
