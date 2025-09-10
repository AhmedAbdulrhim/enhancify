## تحميل فيديوهات تيك توك – بدون علامة مائية

واجهة بسيطة للصق رابط فيديو تيك توك ثم الحصول على رابط تنزيل مباشر (بدون علامة مائية) عبر مزود قابل للتبديل (افتراضي: RapidAPI).

### التشغيل محليًا

1) تثبيت الاعتمادات:
```bash
npm install
```

2) إعداد مفاتيح البيئة:
```bash
cp .env.example .env
# ضع قيمة RAPIDAPI_KEY
```

3) تشغيل الواجهة والـ API معًا:
```bash
npm run dev
```

- الواجهة الأمامية: `http://localhost:5173`
- API: `http://localhost:3001`

### Endpoint

- POST `/api/tiktok` مع جسم: `{ url: string }`
- استجابة ناجحة: `{ downloadUrl: string, meta?: { cover?: string, desc?: string } }`

استخدم الخدمة بما يتوافق مع القوانين وحقوق النشر.
