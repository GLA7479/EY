// components/Layout.js
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import { Footer } from "./Header";
import FullscreenButton from "./FullscreenButton";
import SettingsButton from "./SettingsButton"; // ← חדש

export default function Layout({ children, video }) {
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  const isGameHub = router.pathname === "/game";           // דף מרכז משחקים
  const isSubGame  = router.pathname.startsWith("/mleo-"); // דפי משחק/הרשמה
  const showButtons = isSubGame;                            // רק אחרי דף /game

  // Back: קודם יוצאים מ-Fullscreen ואז ניווט אחורה/חזרה ל-/game
  const handleBack = async () => {
    try {
      const inFs =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement;

      if (inFs) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        await new Promise(r => setTimeout(r, 80));
      }
    } catch {}

    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/game");
    }
  };

  // שינוי ערך זה יעלה/יוריד את שלושת הכפתורים יחד
  const TOP_OFFSET = 76;

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

      {/* Back + Full + Settings רק בדפי המשחקים (mleo-*) */}
      {showButtons && (
        <>
          {/* Back (שמאל) */}
          <button
            onClick={handleBack}
            aria-label="Back"
            style={{ top: `calc(env(safe-area-inset-top, 0px) + ${TOP_OFFSET}px)` }}
            className="fixed left-4 z-[9999] rounded-xl bg-black/60 text-white px-4 py-2
                       border border-white/20 backdrop-blur shadow active:scale-95"
          >
            ← Back
          </button>

          {/* Fullscreen (ימין) */}
          <FullscreenButton
            labelFull="Full"
            labelExit="Exit"
            topOffset={TOP_OFFSET}
          />

          {/* Settings (ימין, ליד Full) */}
          <SettingsButton topOffset={TOP_OFFSET} />
        </>
      )}

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
