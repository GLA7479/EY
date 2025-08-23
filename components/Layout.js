// components/Layout.js
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import { Footer } from "./Header";
import FullscreenButton from "./FullscreenButton";

export default function Layout({ children, video }) {
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  const isGameHub = router.pathname === "/game";          // דף מרכז משחקים
  const isSubGame  = router.pathname.startsWith("/mleo-"); // דפי משחק/הרשמה
  const showButtons = isSubGame; // רק אחרי דף /game

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/game");
    }
  };

  const TOP_OFFSET = 76; // אפשר לשנות להוריד/להעלות

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {video && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          src={video}
        />
      )}
      {video && <div className="absolute inset-0 bg-black/50 -z-10" />}

      <Header />

      {/* Back + Full רק בדפי המשחקים (mleo-*) */}
      {showButtons && (
        <>
          <button
            onClick={handleBack}
            aria-label="Back"
            style={{ top: `calc(env(safe-area-inset-top, 0px) + ${TOP_OFFSET}px)` }}
            className="fixed left-4 z-[9999] rounded-xl bg-black/60 text-white px-4 py-2
                       border border-white/20 backdrop-blur shadow active:scale-95"
          >
            ← Back
          </button>

          <FullscreenButton label="Full" topOffset={TOP_OFFSET} />
        </>
      )}

      {/* שים לב: אם תרצה גובה מלא – הוסף fullscreen-page לדפים הרלוונטיים */}
      <main className="relative z-10 pt-[65px]">{children}</main>

      {/* CTA מוצג בכל העמודים חוץ מהאב והמשחקים */}
      {!isGameHub && !isSubGame && (
        <a
          href="/presale"
          className="fixed bottom-4 left-4 bg-yellow-500 hover:bg-yellow-600
                     text-black px-4 py-2 rounded-full text-sm font-bold
                     shadow-lg transition z-50"
        >
          🚀 Join Presale
        </a>
      )}

      <Footer />
    </div>
  );
}
