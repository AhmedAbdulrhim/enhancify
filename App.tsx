import React, { useState, useCallback } from 'react';
import { ErrorIcon } from './components/icons/ErrorIcon';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-800 rounded-2xl border-2 border-red-500/50 w-full max-w-4xl aspect-video">
        <ErrorIcon className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-red-400">تم حظر الطلب</p>
        <p className="text-sm text-gray-400 mt-2">{message}</p>
    </div>
);


const App: React.FC = () => {
  const [tiktokUrl, setTiktokUrl] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isValidTikTok = useCallback((value: string) => {
    try {
      const u = new URL(value);
      return /tiktok\.com$/.test(u.hostname);
    } catch {
      return false;
    }
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDownloadUrl(null);
    if (!isValidTikTok(tiktokUrl)) {
      setError('رابط تيك توك غير صالح');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tiktokUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'فشل الطلب');
      setDownloadUrl(data.downloadUrl);
      setMetaTitle(data?.meta?.desc || null);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  }, [tiktokUrl, isValidTikTok]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col items-center p-6">
      <header className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
          تحميل فيديوهات تيك توك
        </h1>
        <p className="mt-3 text-gray-300">بدون علامة مائية. الصق الرابط ثم حمّل مباشرة.</p>
      </header>
      <main className="w-full max-w-3xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            dir="ltr"
            type="url"
            required
            placeholder="https://www.tiktok.com/@user/video/123..."
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
            className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 disabled:opacity-60"
          >
            {isLoading ? 'جارٍ المعالجة...' : 'تنزيل'}
          </button>
        </form>
        {error && (
          <div className="mt-6">
            <ErrorDisplay message={error} />
          </div>
        )}
        {!error && downloadUrl && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl p-4">
            {metaTitle && <p className="text-gray-300 mb-3">{metaTitle}</p>}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-cyan-600 hover:bg-cyan-500"
            >
              تحميل الفيديو
            </a>
          </div>
        )}
      </main>
      <footer className="w-full text-center p-4 mt-12 text-gray-500 text-sm">
        <p>استخدم الخدمة بطريقة قانونية واحترم حقوق النشر.</p>
      </footer>
    </div>
  );
};

export default App;