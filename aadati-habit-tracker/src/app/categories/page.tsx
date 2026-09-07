import { PageContainer } from "@/components/shared/page-container";
import { fixtureCategories } from "@/lib/fixtures/categories";
import { fixtureHabits } from "@/lib/fixtures/habits";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoriesPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-extrabold mb-8">التصنيفات</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fixtureCategories.map((c) => {
          const habits = fixtureHabits.filter((h) => h.categoryId === c.id);
          return (
            <Card key={c.id} className="border shadow-sm hover:shadow-lg transition">
              <CardContent className="space-y-3">
                <h3 className="font-extrabold text-xl">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <div className="text-xs text-muted-foreground pt-3 border-t">
                  {habits.length} عادة · {habits.reduce((s, h) => s + (h.schedule?.minutesTarget ?? 0) * (h.schedule?.targetPerWeek ?? 1), 0) / 7} دقايق/يوم تقريبًا
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {habits.map((h) => (
                    <li key={h.id}>• {h.title}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
