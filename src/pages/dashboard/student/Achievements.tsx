import { useEffect } from "react";
import { Trophy, Star, Target, TrendingUp, Award, Zap, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentAchievements = () => {
  useEffect(() => {
    document.title = "Достижения — Ученик | Ability School";
  }, []);

  const achievements = [
    {
      id: 1,
      title: "Мастер дробей",
      description: "Решил 50 задач с дробями",
      icon: "🏆",
      category: "Математика",
      progress: 100,
      points: 50,
      date: "2 дня назад"
    },
    {
      id: 2,
      title: "Читатель месяца",
      description: "Прочитал 10 книг за месяц",
      icon: "📚",
      category: "Литература",
      progress: 100,
      points: 100,
      date: "1 неделю назад"
    },
    {
      id: 3,
      title: "Программист-новичок",
      description: "Создал первый проект на Python",
      icon: "💻",
      category: "Информатика",
      progress: 100,
      points: 75,
      date: "3 дня назад"
    },
    {
      id: 4,
      title: "Полиглот",
      description: "Изучил 100 английских слов",
      icon: "🌍",
      category: "Английский язык",
      progress: 80,
      points: 40,
      date: "В процессе"
    }
  ];

  const stats = [
    { label: "Общие баллы", value: "365", icon: Star, color: "text-yellow-600" },
    { label: "Достижения", value: "12", icon: Trophy, color: "text-blue-600" },
    { label: "Уровень", value: "8", icon: TrendingUp, color: "text-green-600" },
    { label: "Рейтинг", value: "3/25", icon: Target, color: "text-purple-600" }
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Достижения и баллы</h1>
          <p className="text-muted-foreground mt-1">Отслеживайте свой прогресс и достижения</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          Все достижения
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Прогресс недели
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Математика</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Английский</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Информатика</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-600" />
            Последние активности
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Решил 5 задач по математике</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Прочитал главу по истории</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Завершил проект по программированию</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          Ваши достижения
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      +{achievement.points} баллов
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-muted-foreground">{achievement.category}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{achievement.date}</span>
                  </div>
                  
                  {achievement.progress < 100 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Прогресс</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Goals */}
      <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-600" />
          Следующие цели
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-sm">Мастер алгебры</h4>
            <p className="text-xs text-muted-foreground">Решить 30 уравнений</p>
            <Progress value={60} className="h-1 mt-2" />
          </div>
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <div className="text-2xl mb-2">📖</div>
            <h4 className="font-semibold text-sm">Книжный червь</h4>
            <p className="text-xs text-muted-foreground">Прочитать 5 книг</p>
            <Progress value={40} className="h-1 mt-2" />
          </div>
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <div className="text-2xl mb-2">💻</div>
            <h4 className="font-semibold text-sm">Кодер</h4>
            <p className="text-xs text-muted-foreground">Создать 3 проекта</p>
            <Progress value={80} className="h-1 mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentAchievements;
