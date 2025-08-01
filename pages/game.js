import Layout from "../components/Layout";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Games() {
  const games = [
    {
      title: "Mleo Runner",
      description: "🏃‍♂️ Run with Lio and collect points!",
      link: "/mleo-runner",
      icon: "🏃‍♂️",
      available: true,
    },
    {
      title: "Mleo Flyer",
      description: "🪂 Fly with Lio and collect coins!",
      link: "/mleo-flyer",
      icon: "🪂",
      available: true,
    },
    {
      title: "Mleo Catcher",
      description: "🎯 Catch coins and diamonds while avoiding bombs!",
      link: "/mleo-catcher",
      icon: "🎯",
      available: true,
    },
  ];

  return (
    <Layout page="games">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/gallery-bg.mp4" type="video/mp4" />
      </video>

      <motion.main
        className="relative min-h-screen flex flex-col items-center p-6 text-white overflow-hidden pt-[70px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 -z-10"></div>

        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold mb-3 flex items-center gap-3 text-center drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          🎮
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            LIOSH Games
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 max-w-2xl text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Play and enjoy our exclusive Lio-themed games! Collect points, fly high, and have fun with the real Shiba Inu hero.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
          {games.map((game, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/70 p-6 rounded-2xl shadow-lg border border-yellow-400/40 text-center hover:scale-105 transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl mb-3">{game.icon}</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">{game.title}</h2>
              <p className="text-gray-300 mb-4">{game.description}</p>
              {game.available ? (
                <Link href={game.link}>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold transition">
                    Play Now
                  </button>
                </Link>
              ) : (
                <button className="bg-gray-600 text-gray-300 px-5 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>
                  Coming Soon
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.main>
    </Layout>
  );
}
