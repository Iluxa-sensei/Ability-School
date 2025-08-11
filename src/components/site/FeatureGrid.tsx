import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, Bot, BookOpenCheck, MessageCircle, HeartHandshake, Mic } from "lucide-react";

const features = [
  { icon: CalendarCheck2, title: "Виртуальные классы и расписание", text: "Удобные занятия онлайн и личное расписание." },
  { icon: Bot, title: "Уроки с ИИ‑ассистентом", text: "Подсказки, объяснения и адаптивное обучение." },
  { icon: BookOpenCheck, title: "Домашние задания", text: "Задания, автоматическая проверка и обратная связь." },
  { icon: HeartHandshake, title: "Поддержка родителей", text: "Прогресс ребёнка и рекомендации по развитию." },
  { icon: MessageCircle, title: "Чат с ИИ", text: "Быстрые ответы на вопросы 24/7." },
  { icon: Mic, title: "Доступность", text: "Тексты, субтитры и голосовые функции." },
];

const FeatureGrid = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container">
        <header className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold">Что вы получаете</h2>
          <p className="text-muted-foreground mt-2">Технологичная платформа для вовлечённого, безопасного и эффективного обучения.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="animate-enter">
              <CardHeader>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <f.icon className="size-5" />
                </div>
                <CardTitle className="mt-2 text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.text}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
