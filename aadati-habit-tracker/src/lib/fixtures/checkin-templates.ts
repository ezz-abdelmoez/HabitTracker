export const fixtureTemplates = [
  // German A1 (count) — skills multi
  { habitId: "h-de", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "skills", kind: "multi" as const, label: "المهارات اللي تدربت عليها", required: false,
      options: [{id:"reading",text:"قراءة"},{id:"listening",text:"استماع"},{id:"speaking",text:"كلام"},{id:"writing",text:"كتابة"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق", required: true, min: 5, max: 180, presets: [15,30,45,60,90], default: 45 },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظة سريعة (اختياري)", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه المهارة اللي حسيت فيها تحسن النهاردة؟" },
  // English B1→B2
  { habitId: "h-en", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "skills", kind: "multi" as const, label: "المهارات", required: false,
      options: [{id:"reading",text:"قراءة"},{id:"listening",text:"استماع"},{id:"speaking",text:"كلام"},{id:"writing",text:"كتابة"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق", required: true, min: 5, max: 180, presets: [15,30,45,60,90], default: 50 },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظة", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه اللي كان أسهل النهاردة؟" },
  // HappyShare (duration)
  { habitId: "h-happy", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق العمل", required: true, min: 15, max: 240, presets: [30,60,90,120], default: 120 },
    { id: "energy", kind: "rating" as const, label: "طاقة العمل", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه الميزة اللي خلصتها النهاردة؟" },
  // Bakalory (duration)
  { habitId: "h-bak", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق", required: true, min: 15, max: 200, presets: [30,60,90], default: 90 },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات المشروع", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه الخطوة الجاية في المشروع؟" },
  // Hawai'i ICT (duration, fixed days Tue/Thu)
  { habitId: "h-hawai", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق", required: true, min: 15, max: 180, presets: [30,45,75], default: 75 },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات الدورة", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه المفهوم اللي فهمته من الدرس؟" },
  // Portfolio (duration)
  { habitId: "h-portfolio", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق", required: true, min: 10, max: 120, presets: [15,30,60], default: 60 },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه المنصة اللي شغلت عليها النهاردة؟" },
  // Job search (duration)
  { habitId: "h-jobs", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "minutes", kind: "number" as const, label: "دقايق البحث", required: true, min: 5, max: 120, presets: [15,30], default: 30 },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات", required: false, maxLength: 500 },
  ], reflectionPrompt: "أرسلت كام طلب النهاردة؟" },
  // Tuesday planning (binary, fixed Tue)
  { habitId: "h-tuesday", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "energy", kind: "rating" as const, label: "طاقة التخطيط", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات التخطيط", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه الهدف الأهم الأسبوع ده؟" },
  // Flow & recovery (binary, 2x/week flexible)
  { habitId: "h-flow", fields: [
    { id: "status", kind: "status" as const, label: "الحالة", required: true,
      options: [{id:"done",text:"تم"},{id:"partial",text:"نصفها"},{id:"skipped",text:"تخطّي"}] },
    { id: "energy", kind: "rating" as const, label: "طاقة", required: false, min: 1, max: 5 },
    { id: "note", kind: "text" as const, label: "ملاحظات", required: false, maxLength: 500 },
  ], reflectionPrompt: "إيه اللي خلّاك تدخل حالة التدفق؟" },
];
