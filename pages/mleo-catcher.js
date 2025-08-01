import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";

export default function MleoCatcher() {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const leoRef = useRef(null);
  const itemsRef = useRef([]);
  const currentScoreRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("mleoCatcherHighScore") || 0;
      setHighScore(Number(savedHighScore));

      const stored = JSON.parse(localStorage.getItem("mleoCatcherLeaderboard") || "[]");
      setLeaderboard(stored);
    }
  }, []);

  const updateLeaderboard = (name, score) => {
    let stored = JSON.parse(localStorage.getItem("mleoCatcherLeaderboard") || "[]");
    const playerIndex = stored.findIndex((p) => p.name === name);
    if (playerIndex >= 0) {
      if (score > stored[playerIndex].score) stored[playerIndex].score = score;
    } else {
      stored.push({ name, score });
    }
    stored = stored.sort((a, b) => b.score - a.score).slice(0, 20);
    localStorage.setItem("mleoCatcherLeaderboard", JSON.stringify(stored));
    setLeaderboard(stored);
  };

  function initGame() {
    const canvas = canvasRef.current;
    leoRef.current = { x: canvas.width / 2 - 50, y: canvas.height - 120, width: 90, height: 100, dx: 0 };
    itemsRef.current = [];
    currentScoreRef.current = 0;
    setScore(0);
    setGameOver(false);
  }

  function spawnItem() {
    const types = ["coin", "diamond", "bomb"];
    const type = types[Math.floor(Math.random() * types.length)];
    itemsRef.current.push({ x: Math.random() * (canvasRef.current.width - 40), y: -40, size: 40, type });
  }

  function checkCollision(a, b) {
    return a.x < b.x + b.size && a.x + a.width > b.x && a.y < b.y + b.size && a.y + a.height > b.y;
  }

  function updateGame() {
    if (!runningRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const leoSprite = new window.Image();
    leoSprite.src = "/images/dog-spritesheet.png";

    const coinImg = new window.Image();
    coinImg.src = "/images/leo-logo.png";

    const diamondImg = new window.Image();
    diamondImg.src = "/images/diamond.png";

    const bombImg = new window.Image();
    bombImg.src = "/images/obstacle.png";

    const bgImg = new window.Image();
    bgImg.src = "/images/game-day.png";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgImg.complete) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const leo = leoRef.current;
    leo.x += leo.dx;
    if (leo.x < 0) leo.x = 0;
    if (leo.x + leo.width > canvas.width) leo.x = canvas.width - leo.width;

    if (leoSprite.complete) {
      const sw = leoSprite.width / 4;
      const sh = leoSprite.height;
      ctx.drawImage(leoSprite, 0, 0, sw, sh, leo.x, leo.y, leo.width, leo.height);
    }

    itemsRef.current.forEach((item, i) => {
      item.y += 3;
      if (item.type === "coin" && coinImg.complete) ctx.drawImage(coinImg, item.x, item.y, item.size, item.size);
      if (item.type === "diamond" && diamondImg.complete) ctx.drawImage(diamondImg, item.x, item.y, item.size, item.size);
      if (item.type === "bomb" && bombImg.complete) ctx.drawImage(bombImg, item.x, item.y, item.size, item.size);

      if (checkCollision(leo, item)) {
        if (item.type === "coin") currentScoreRef.current++;
        if (item.type === "diamond") currentScoreRef.current += 5;
        if (item.type === "bomb") {
          runningRef.current = false;
          setGameOver(true);
          updateLeaderboard(playerName, currentScoreRef.current);
        }
        itemsRef.current.splice(i, 1);
        setScore(currentScoreRef.current);
      } else if (item.y > canvas.height) {
        itemsRef.current.splice(i, 1);
      }
    });

    if (Math.random() < 0.05) spawnItem();

    requestAnimationFrame(updateGame);
  }

  function startGame() {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const wrapper = document.getElementById("game-wrapper");
    if (isMobile && wrapper?.requestFullscreen) wrapper.requestFullscreen().catch(() => {});
    else if (isMobile && wrapper?.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();

    initGame();
    runningRef.current = true;
    updateGame();
  }

  const moveLeft = () => {
    if (leoRef.current) leoRef.current.dx = -5;
  };
  const moveRight = () => {
    if (leoRef.current) leoRef.current.dx = 5;
  };
  const stopMove = () => {
    if (leoRef.current) leoRef.current.dx = 0;
  };

  useEffect(() => {
    if (!gameRunning) return;

    function handleKey(e) {
      if (!leoRef.current) return;
      if (e.code === "ArrowLeft") moveLeft();
      if (e.code === "ArrowRight") moveRight();
    }

    function handleKeyUp(e) {
      if (!leoRef.current) return;
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") stopMove();
    }

    document.addEventListener("keydown", handleKey);
    document.addEventListener("keyup", handleKeyUp);
    startGame();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("keyup", handleKeyUp);
      runningRef.current = false;
    };
  }, [gameRunning]);

  return (
    <Layout>
      <div id="game-wrapper" className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
        {showIntro && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-[999] text-center p-6">
            <Image src="/images/leo-intro.png" alt="Leo" width={220} height={220} className="mb-6 animate-bounce" />
            <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">🎯 LIO Catcher</h1>
            <p className="text-base sm:text-lg text-gray-200 mb-4">Move Leo to catch coins and avoid bombs!</p>

            <input type="text" placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="mb-4 px-4 py-2 rounded text-black w-64 text-center" />

            <button
              onClick={() => {
                if (!playerName.trim()) return;
                updateLeaderboard(playerName, 0);
                setShowIntro(false);
                setGameRunning(true);
              }}
              disabled={!playerName.trim()}
              className={`px-8 py-4 font-bold rounded-lg text-xl shadow-lg transition animate-pulse ${playerName.trim() ? "bg-yellow-400 text-black hover:scale-105" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
            >
              ▶ Start Game
            </button>
          </div>
        )}

        {!showIntro && (
          <>
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-lg text-lg font-bold z-[999] top-10">
              Score: {score} | High Score: {highScore}
            </div>
            <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2 bg-black/60 px-3 py-1 rounded-md text-base font-bold z-[999] bottom-36">
              Score: {score} | High Score: {highScore}
            </div>

            <div className="relative w-full max-w-[95vw] sm:max-w-[960px]">
              <canvas ref={canvasRef} width={960} height={480} className="border-4 border-yellow-400 rounded-lg w-full aspect-[2/1] max-h-[80vh]" />

              {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-[999]">
                  <h2 className="text-4xl sm:text-5xl font-bold text-red-500 mb-4">GAME OVER</h2>
                  <button
                    className="px-6 py-3 bg-yellow-400 text-black font-bold rounded text-base sm:text-lg"
                    onClick={() => {
                      setGameRunning(false);
                      setTimeout(() => setGameRunning(true), 50);
                    }}
                  >
                    Start Again
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
                setGameRunning(false);
                setGameOver(false);
                setShowIntro(true);
              }}
              className="fixed top-16 right-4 px-6 py-4 bg-yellow-400 text-black font-bold rounded-lg text-lg sm:text-xl z-[999]"
            >
              Exit
            </button>

            {gameRunning && (
              <>
                <button
                  onTouchStart={moveLeft}
                  onTouchEnd={stopMove}
                  className="fixed bottom-8 left-4 px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg text-lg"
                >
                  ◀ Left
                </button>
                <button
                  onTouchStart={moveRight}
                  onTouchEnd={stopMove}
                  className="fixed bottom-8 right-4 px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg text-lg"
                >
                  Right ▶
                </button>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
