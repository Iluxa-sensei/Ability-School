import Hero from "@/components/site/Hero";
import FeatureGrid from "@/components/site/FeatureGrid";
import InteractiveScreensSection from "@/components/site/InteractiveScreensSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Brain,
  Trophy,
  Clock,
  Star,
  ArrowRight,
  Play,
  BookOpen,
  Target,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Heart,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Rocket,
  Award,
  Bookmark
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const revealVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' as const } },
};

const floatingVariants = {
  float: {
    y: [-10, 10, -10] as number[],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
    },
  },
} as const;

// Кастомный хук для анимации чисел
function useCountUp(to: number, duration = 1200, format?: (n: number) => string) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    let start: number | null = null;
    function animate(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * to));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
      else setValue(to);
    }
    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [to, duration]);
  if (format) return format(value);
  return value;
}

const Index = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);
  const y3 = useTransform(scrollY, [0, 300], [0, -30]);

  useEffect(() => {
    document.title = "Ability School — виртуальная школа будущего";
  }, []);

  // Анимация чисел
  const students = useCountUp(10000, 1200, n => n >= 10000 ? '10K+' : n.toLocaleString());
  const success = useCountUp(95, 1200, n => n + '%');
  const rating = useCountUp(49, 1200, n => (n / 10).toFixed(1));

  return (
    <main className="relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl pointer-events-none"
        animate={floatingVariants.float}
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl pointer-events-none"
        animate={floatingVariants.float}
        transition={{ delay: 1 }}
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl pointer-events-none"
        animate={floatingVariants.float}
        transition={{ delay: 2 }}
      />

      <Hero />

      {/* Inline login/register anchors for smooth scroll from hero */}
      <section id="register" className="sr-only" aria-hidden>
        <Link to="/register" />
      </section>
      <section id="login" className="sr-only" aria-hidden>
        <Link to="/login" />
      </section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        <div className="container grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors">
                  <Brain className="w-3 h-3 mr-1" />
                  ИИ-платформа
                </Badge>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                О проекте
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ability School — это EdTech‑платформа, где ИИ помогает учиться и преподавать.
                Виртуальные классы, задания с обратной связью и безопасная коммуникация между всеми участниками.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border hover:bg-white/70 transition-all duration-200 cursor-pointer"
              >
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Для учеников: занятия, задания, достижения</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border hover:bg-white/70 transition-all duration-200 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Для учителей: планирование, аналитика, инструменты</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border hover:bg-white/70 transition-all duration-200 cursor-pointer"
              >
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium">Для родителей: контроль, отчеты, связь</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border hover:bg-white/70 transition-all duration-200 cursor-pointer"
              >
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Безопасность и конфиденциальность</span>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-600">Статус: Активно</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Технологии платформы</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ИИ-алгоритмы</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Безопасность</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Производительность</span>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        id="stats"
        className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-purple-50 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Платформа в цифрах
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Достижения платформы
            </h2>
            <p className="text-lg text-muted-foreground">
              Наша платформа помогает тысячам учеников достигать успехов в обучении
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: students, label: "Активных учеников", color: "from-blue-500 to-blue-600" },
              { icon: Trophy, value: success, label: "Успеваемость", color: "from-green-500 to-green-600" },
              { icon: Clock, value: "24/7", label: "Доступность", color: "from-purple-500 to-purple-600" },
              { icon: Star, value: rating, label: "Рейтинг платформы", color: "from-yellow-500 to-yellow-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        id="technology"
        className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200 mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Технологии
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Передовые технологии
            </h2>
            <p className="text-lg text-muted-foreground">
              Мы используем самые современные технологии для создания лучшего образовательного опыта
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Искусственный интеллект",
                description: "Персонализированное обучение, адаптивные тесты и умные рекомендации",
                features: ["Машинное обучение", "NLP", "Аналитика данных"]
              },
              {
                icon: Shield,
                title: "Безопасность",
                description: "Защита данных, шифрование и безопасная коммуникация",
                features: ["SSL/TLS", "2FA", "GDPR"]
              },
              {
                icon: Globe,
                title: "Облачные технологии",
                description: "Доступность с любого устройства, синхронизация и резервное копирование",
                features: ["AWS", "Микросервисы", "CDN"]
              }
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <tech.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{tech.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{tech.description}</p>
                    <div className="space-y-2">
                      {tech.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        id="benefits"
        className="py-16 md:py-24 bg-gradient-to-br from-pink-50 to-red-50 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 mb-4">
              <Lightbulb className="w-3 h-3 mr-1" />
              Преимущества
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-muted-foreground">
              Уникальные возможности, которые делают обучение эффективным и увлекательным
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Персонализация",
                description: "Адаптивное обучение под индивидуальные потребности каждого ученика"
              },
              {
                icon: BookOpen,
                title: "Интерактивность",
                description: "Увлекательные задания, игры и виртуальные эксперименты"
              },
              {
                icon: MessageSquare,
                title: "Обратная связь",
                description: "Мгновенная оценка и детальные комментарии по каждому заданию"
              },
              {
                icon: Smartphone,
                title: "Мобильность",
                description: "Доступ к обучению с любого устройства в любое время"
              },
              {
                icon: Monitor,
                title: "Аналитика",
                description: "Подробные отчеты о прогрессе и рекомендации по улучшению"
              },
              {
                icon: Rocket,
                title: "Инновации",
                description: "Постоянное обновление и внедрение новых технологий"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 cursor-pointer">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Screens Section */}
      <InteractiveScreensSection />

      {/* CTA Section */}
      <motion.section
        id="cta"
        className="py-16 md:py-24 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              <Award className="w-3 h-3 mr-1" />
              Начать обучение
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
              Готовы к обучению будущего?
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Присоединяйтесь к тысячам учеников, которые уже используют Ability School для достижения своих образовательных целей
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/register">
                  <Button className="h-14 px-8 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Rocket className="w-5 h-5 mr-2" />
                    Начать бесплатно
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="outline" className="h-14 px-8 text-lg border-2 border-gray-300 hover:border-gray-400 text-gray-800 hover:text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Узнать больше
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Бесплатно навсегда</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Без скрытых платежей</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Мгновенная регистрация</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
};

export default Index;
