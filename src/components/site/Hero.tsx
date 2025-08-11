import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Bot, GraduationCap, MessageSquare } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Aurora gradient background */}
      <div className="absolute -z-10 inset-0 opacity-40 bg-gradient-primary blur-3xl" aria-hidden />
      <motion.div
        className="absolute -z-10 top-[-10%] left-[-10%] w-80 h-80 rounded-full bg-blue-400/25 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
      />
      <motion.div
        className="absolute -z-10 bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-purple-400/25 blur-3xl"
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.4, 0.25, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: [0.42, 0, 0.58, 1], delay: 0.8 }}
      />

      <div className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center animate-enter">
          {/* Gradient border glow wrapper */}
          <div className="relative mx-auto">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl opacity-30 blur-xl" />
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-400/30 text-blue-700 text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Учимся с ИИ
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight">
                <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Ability School</span>
                <span className="block text-gray-900 mt-1">Ваша виртуальная школа будущего</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Учитесь, общайтесь и развивайтесь с помощью искусственного интеллекта. Виртуальные классы, домашние задания и поддержка для учеников, родителей и учителей.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register"><Button variant="hero" size="lg" className="px-8">Зарегистрироваться</Button></Link>
                <Link to="/login"><Button variant="outline" size="lg" className="px-8 bg-white hover:bg-white border-gray-300 hover:border-gray-400 text-gray-800 hover:text-gray-900">Войти</Button></Link>
              </div>

              {/* Feature chips */}
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="rounded-xl border bg-white/70 px-3 py-2 text-gray-800 inline-flex items-center gap-2 justify-center">
                  <Bot className="w-4 h-4 text-blue-600" /> ИИ‑ассистент
                </div>
                <div className="rounded-xl border bg-white/70 px-3 py-2 text-gray-800 inline-flex items-center gap-2 justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" /> Голос и субтитры
                </div>
                <div className="rounded-xl border bg-white/70 px-3 py-2 text-gray-800 inline-flex items-center gap-2 justify-center">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Виртуальные классы
                </div>
                <div className="rounded-xl border bg-white/70 px-3 py-2 text-gray-800 inline-flex items-center gap-2 justify-center">
                  <Sparkles className="w-4 h-4 text-pink-600" /> Без VR, с ноутбука
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
