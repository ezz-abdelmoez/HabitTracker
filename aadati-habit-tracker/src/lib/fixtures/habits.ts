
export const fixtureHabits = [
  // Languages
  { id: "h-de", slug: "german-a1", categoryId: "cat-lang", order: 1, title: "الألمانية A1",
    titleEn: "German A1", description: "قراءة وكتابة واستماع وكلام — من الصفر للمستوى A1.", type: "count" as const,
    status: "active" as const, tags: ["لغة","A1"], schedule: { mode: "daily" as const, targetPerWeek: 7 },
    startDate: "2025-01-06", resourceIds: ["r-de-plan"], seedProfile: { doneProbability: 0.82, partialProbability: 0.08, avgMinutes: 45 } },
  { id: "h-en", slug: "english-b1-b2", categoryId: "cat-lang", order: 2, title: "الإنجليزية B1 → B2",
    titleEn: "English B1 → B2", description: "قراءة وكتابة واستماع وكلام — رفع المستوى من B1 لـ B2.", type: "count" as const,
    status: "active" as const, tags: ["لغة","B1","B2"], schedule: { mode: "daily" as const, targetPerWeek: 7 },
    startDate: "2025-01-06", resourceIds: ["r-en-plan"], seedProfile: { doneProbability: 0.78, partialProbability: 0.10, avgMinutes: 50 } },

  // Development
  { id: "h-happy", slug: "happy-share", categoryId: "cat-dev", order: 3, title: "تطبيق HappyShare",
    titleEn: "HappyShare Web App", description: "تطوير تطبيق الويب الخاص بي — واجهة ومميزات مبدئية.", type: "duration" as const,
    status: "active" as const, tags: ["ويب","منتج"], schedule: { mode: "perWeek" as const, targetPerWeek: 4, minutesTarget: 120 },
    startDate: "2025-03-10", resourceIds: ["r-happy-plan"], seedProfile: { doneProbability: 0.70, partialProbability: 0.12, avgMinutes: 100 } },
  { id: "h-bak", slug: "bakalory", categoryId: "cat-dev", order: 4, title: "مشروع البكالوريا (ويب)",
    titleEn: "Baccalaureate Web Project", description: "موقع ويب لمشروع البكالوريا — تصميم وتطوير ونشر.", type: "duration" as const,
    status: "active" as const, tags: ["ويب","بكالوريا"], schedule: { mode: "perWeek" as const, targetPerWeek: 3, minutesTarget: 90 },
    startDate: "2025-02-15", resourceIds: ["r-bak-plan"], seedProfile: { doneProbability: 0.68, partialProbability: 0.15, avgMinutes: 85 } },

  // Career
  { id: "h-hawai", slug: "hawaii-ict-cloud", categoryId: "cat-career", order: 5, title: "دورة السحابة — Hawai'i ICT",
    titleEn: "Hawai'i ICT Cloud Course", description: "دراسة دورة السحابة من Hawai'i ICT لمسابقة المهارات التقنية.", type: "duration" as const,
    status: "active" as const, tags: ["سحابة","دورة"], schedule: { mode: "fixedDays" as const, targetPerWeek: 2, days: [1,4], minutesTarget: 75 },
    startDate: "2025-04-01", resourceIds: ["r-hawai-plan"], seedProfile: { doneProbability: 0.72, partialProbability: 0.10, avgMinutes: 70 } },
  { id: "h-portfolio", slug: "portfolio-improvement", categoryId: "cat-career", order: 6, title: "تحسين المحفظة المهنية",
    titleEn: "Portfolio Improvement", description: "تحسين الملف الشخصي على Upwork وFreelancer ومستقل وNavizly ومنصات أخرى.", type: "duration" as const,
    status: "active" as const, tags: ["محفظة","عروض عمل"], schedule: { mode: "perWeek" as const, targetPerWeek: 2, minutesTarget: 60 },
    startDate: "2025-01-20", resourceIds: ["r-portfolio"], seedProfile: { doneProbability: 0.65, partialProbability: 0.20, avgMinutes: 55 } },
  { id: "h-jobs", slug: "job-search", categoryId: "cat-career", order: 7, title: "البحث عن وظائف",
    titleEn: "Job Search", description: "البحث اليومي عن وظائف عبر Wuzzuf وLinkedIn وIndeed وGlassdoor ومنصات أخرى.", type: "duration" as const,
    status: "active" as const, tags: ["وظيفة","بحث"], schedule: { mode: "perWeek" as const, targetPerWeek: 3, minutesTarget: 30 },
    startDate: "2025-01-06", resourceIds: ["r-jobs"], seedProfile: { doneProbability: 0.60, partialProbability: 0.18, avgMinutes: 25 } },

  // System
  { id: "h-tuesday", slug: "tuesday-planning", categoryId: "cat-system", order: 8, title: "تخطيط الثلاثاء المسائي",
    titleEn: "Tuesday Evening Planning", description: "كتابة الأهداف والمهام الأسبوعية والسيناريوهات المُبرمجة والتعافي.", type: "binary" as const,
    status: "active" as const, tags: ["تخطيط","نظام"], schedule: { mode: "fixedDays" as const, targetPerWeek: 1, days: [2], minutesTarget: 45 },
    startDate: "2025-01-06", resourceIds: ["r-tuesday"], seedProfile: { doneProbability: 0.85, partialProbability: 0.05, avgMinutes: 40 } },
  { id: "h-flow", slug: "flow-recovery", categoryId: "cat-system", order: 9, title: "تدفق وتعافي",
    titleEn: "Flow & Recovery", description: "مطابقة التدفق مع المهام + تحسين التعافي للعودة بسرعة.", type: "binary" as const,
    status: "active" as const, tags: ["تدفق","تعافي"], schedule: { mode: "perWeek" as const, targetPerWeek: 2, minutesTarget: 30 },
    startDate: "2025-01-06", resourceIds: ["r-flow"], seedProfile: { doneProbability: 0.75, partialProbability: 0.12, avgMinutes: 30 } },
];
