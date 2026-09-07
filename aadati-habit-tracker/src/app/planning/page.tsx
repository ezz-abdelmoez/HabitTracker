import { PageContainer } from "@/components/shared/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { fixtureHomeContent } from "@/lib/fixtures/home-content";

export default function PlanningPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-extrabold mb-2">تخطيط الثلاثاء المسائي</h1>
      <p className="text-muted-foreground mb-8">الأهداف → المهام → السيناريوهات المُبرمجة → التعافي</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-extrabold">الأهداف الأسبوعية</h2>
            <ul className="space-y-2 text-sm">
              <li className="rounded-lg bg-emerald-50 px-3 py-2">أكمل أسبوع ألمانية كامل</li>
              <li className="rounded-lg bg-amber-50 px-3 py-2">أخلص 3 جلسات HappyShare</li>
              <li className="rounded-lg bg-violet-50 px-3 py-2">أرسل طلبين لوظيفة جديدة</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-extrabold">السيناريوهات المُبرمجة</h2>
            <div className="space-y-3">
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-semibold">لو شعرت بكسل من السوشيال</p>
                <p className="text-muted-foreground">إذن امشي 5 دقايق بدون موبايل، ارجع وافتح الملف.</p>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-semibold">لو الوقت ضايع ومش عارف تبدأ منين</p>
                <p className="text-muted-foreground">إذن افتح أقرب ملف في مجلد العادة واقرأ صفحة واحدة بس.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-extrabold">نموذج التخطيط الأسبوعي</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 border">
                <h4 className="font-bold mb-2">الأحد — الأربعاء</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• جلسة ألمانية (45 دق)</li>
                  <li>• مراجعة مشروع البكالوريا (90 دق)</li>
                  <li>• بحث عن وظائف (30 دق)</li>
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-4 border">
                <h4 className="font-bold mb-2">الخميس — السبت</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• دورة السحابة (75 دق — الثلاثاء)</li>
                  <li>• تحسين المحفظة (60 دق)</li>
                  <li>• تخطيط الثلاثاء (45 دق)</li>
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-violet-50 to-white p-4 border">
                <h4 className="font-bold mb-2">تعافي واستراحة</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• استراحة نشطة كل 25 دقيقة</li>
                  <li>• يوم راحة كامل (الجمعة)</li>
                  <li>• مراجعة الأسبوع مساء السبت</li>
                </ul>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-primary/10 to-emerald-50 p-5 border-l-4 border-primary">
              <p className="text-sm font-medium">النية الأسبوعية:</p>
              <p className="text-sm text-muted-foreground">"أبدأ بأصغر خطوة، وأثق إن السلسلة هترجع لو ما كسرتش يوم."</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
