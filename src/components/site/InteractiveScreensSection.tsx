import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Users, Hand, PenTool, Mic, Camera, Bot, BookOpen, Lightbulb, Target, Brain, Download, Play, TrendingUp, CheckCircle, Star, Trophy, Calendar } from "lucide-react";
import screenVirtualClass from "@/assets/screenshot-virtual-class.jpg";
import screenAIChat from "@/assets/screenshot-ai-chat.jpg";
import screenParentDashboard from "@/assets/screenshot-parent-dashboard.jpg";
import heroAbility from "@/assets/hero-ability.jpg";

const cards = [
    {
        title: "Виртуальный 3D‑класс",
        image: screenVirtualClass,
        features: [
            { icon: Video, label: "Видеозанятия" },
            { icon: Users, label: "Чат и участники" },
            { icon: Hand, label: "Поднятие руки" },
            { icon: PenTool, label: "Совместная доска" },
            { icon: Mic, label: "Микрофон" },
            { icon: Camera, label: "Камера" },
        ],
        description: "Виртуальный класс с видео, чатом, поднятием руки и интерактивной доской. Управляйте камерой и микрофоном, работайте вместе!",
    },
    {
        title: "ИИ‑чат",
        image: screenAIChat,
        features: [
            { icon: Bot, label: "ИИ‑ассистент" },
            { icon: Mic, label: "Голосовой ввод" },
            { icon: BookOpen, label: "Объяснения" },
            { icon: Lightbulb, label: "Примеры" },
            { icon: Target, label: "Мини‑тесты" },
        ],
        description: "Голосовой и текстовый чат с ИИ‑ассистентом, объяснения, примеры, мини‑тесты и 3D‑аватар!",
    },
    {
        title: "ИИ‑планировщик уроков",
        image: heroAbility, // Можно заменить на отдельный скриншот, если появится
        features: [
            { icon: Brain, label: "ИИ‑генерация" },
            { icon: BookOpen, label: "Планы и материалы" },
            { icon: Target, label: "Цели урока" },
            { icon: Download, label: "Экспорт" },
            { icon: Play, label: "Запуск урока" },
        ],
        description: "Создавайте интерактивные планы уроков с помощью ИИ: цели, материалы, активности, экспорт в PDF.",
    },
    {
        title: "Обзор успеваемости",
        image: screenParentDashboard,
        features: [
            { icon: TrendingUp, label: "Прогресс" },
            { icon: CheckCircle, label: "Посещаемость" },
            { icon: Star, label: "Оценки" },
            { icon: Trophy, label: "Достижения" },
            { icon: Calendar, label: "События" },
        ],
        description: "Аналитика успеваемости: прогресс, посещаемость, оценки, достижения и важные события ребёнка.",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: 0.15 * i, duration: 0.7, type: "spring" },
    }),
};

export default function InteractiveScreensSection() {
    return (
        <section id="screens" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container">
                <header className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Ключевые возможности платформы
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Оцените интерактивность и инновации Ability School — наведите на карточку!
                    </p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {cards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            className="group relative rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border-0 overflow-hidden hover:scale-[1.03] hover:shadow-3xl transition-all duration-500 cursor-pointer"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            custom={i}
                            variants={cardVariants}
                            whileHover={{ scale: 1.04, boxShadow: "0 8px 40px 0 rgba(80,80,200,0.15)" }}
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-64 object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-700"
                                    style={{ boxShadow: "0 4px 32px 0 rgba(80,80,200,0.10)" }}
                                />
                            </div>
                            <CardContent className="p-8 pt-6 flex flex-col items-center">
                                <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {card.title}
                                </h3>
                                <p className="text-base text-muted-foreground text-center mb-4 min-h-[56px]">
                                    {card.description}
                                </p>
                                <div className="flex flex-wrap justify-center gap-3 mb-2">
                                    {card.features.map((f, idx) => (
                                        <span key={f.label} className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm text-sm font-medium group-hover:scale-110 transition-transform">
                                            <f.icon className="w-4 h-4 mr-1" />
                                            {f.label}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
