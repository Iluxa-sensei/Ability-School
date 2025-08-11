import { useEffect, useState } from "react";
import { Heart, Brain, Smile, Frown, Calendar, TrendingUp, MessageSquare, BookOpen, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentAIPsychologist = () => {
  useEffect(() => {
    document.title = "AI‑психолог — Ученик | Ability School";
  }, []);

  const [currentMood, setCurrentMood] = useState("happy");
  const [moodHistory] = useState([
    { date: "Пн", mood: "happy", value: 8 },
    { date: "Вт", mood: "neutral", value: 6 },
    { date: "Ср", mood: "sad", value: 4 },
    { date: "Чт", mood: "happy", value: 9 },
    { date: "Пт", mood: "happy", value: 7 },
    { date: "Сб", mood: "neutral", value: 5 },
    { date: "Вс", mood: "happy", value: 8 }
  ]);

  const activities = [
    { name: "Медитация", duration: "10 мин", completed: true, icon: "🧘" },
    { name: "Дыхательные упражнения", duration: "5 мин", completed: true, icon: "🫁" },
    { name: "Прогулка", duration: "30 мин", completed: false, icon: "🚶" },
    { name: "Чтение", duration: "20 мин", completed: false, icon: "📖" }
  ];

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "neutral": return "😐";
      case "sad": return "😔";
      default: return "😊";
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy": return "text-green-600";
      case "neutral": return "text-yellow-600";
      case "sad": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">AI‑психолог</h1>
          <p className="text-muted-foreground mt-1">Поддержка благополучия и эмоционального здоровья</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Чат с психологом
        </Button>
      </div>

      {/* Current Mood */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-blue-600" />
            Как вы себя чувствуете сегодня?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {["happy", "neutral", "sad"].map((mood) => (
              <Button
                key={mood}
                variant={currentMood === mood ? "default" : "outline"}
                onClick={() => setCurrentMood(mood)}
                className={`flex flex-col items-center gap-2 p-4 h-auto ${
                  currentMood === mood ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
              >
                <span className="text-2xl">{getMoodIcon(mood)}</span>
                <span className="text-xs">
                  {mood === "happy" ? "Хорошо" : mood === "neutral" ? "Нормально" : "Плохо"}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Настроение за неделю
          </h3>
          <div className="space-y-3">
            {moodHistory.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{day.date}</span>
                <div className="flex-1">
                  <Progress value={day.value * 10} className="h-2" />
                </div>
                <span className={`text-lg ${getMoodColor(day.mood)}`}>
                  {getMoodIcon(day.mood)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Activities */}
      <div className="p-6 rounded-xl border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" />
          Рекомендуемые активности
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-4 rounded-lg border bg-white/50">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium">{activity.name}</h4>
                <p className="text-sm text-muted-foreground">{activity.duration}</p>
              </div>
              <Button
                size="sm"
                variant={activity.completed ? "outline" : "default"}
                className={activity.completed ? "text-green-600 border-green-200" : ""}
              >
                {activity.completed ? "✓ Выполнено" : "Начать"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Среднее настроение</p>
              <p className="text-xl font-bold">7.2/10</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дней подряд</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Цели выполнено</p>
              <p className="text-xl font-bold">8/10</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Сессий с ИИ</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-gradient-to-br from-pink-50 to-pink-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-600" />
            Дневник настроения
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Записывайте свои мысли и эмоции
          </p>
          <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
            Написать запись
          </Button>
        </div>
        
        <div className="p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-indigo-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Техники релаксации
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Упражнения для снятия стресса
          </p>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            Начать упражнение
          </Button>
        </div>
        
        <div className="p-6 rounded-xl border bg-gradient-to-br from-teal-50 to-teal-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-teal-600" />
            Рекомендации
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Персональные советы от ИИ
          </p>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            Получить совет
          </Button>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="p-6 rounded-xl border bg-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-600" />
          Последние инсайты
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm">
              <span className="font-semibold">Заметка:</span> Вы лучше всего себя чувствуете после физической активности. 
              Попробуйте добавить 15 минут упражнений в день.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm">
              <span className="font-semibold">Прогресс:</span> Ваше настроение улучшилось на 20% за последнюю неделю. 
              Продолжайте практиковать техники релаксации.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentAIPsychologist;
