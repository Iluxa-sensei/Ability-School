import { useEffect } from "react";
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, FileText, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentHomework = () => {
  useEffect(() => {
    document.title = "Домашние задания — Ученик | Ability School";
  }, []);

  const homeworkData = [
    {
      id: 1,
      subject: "Математика",
      title: "Решение задач 12–18",
      description: "Алгебраические уравнения и неравенства",
      dueDate: "Завтра",
      priority: "high",
      status: "pending",
      progress: 60,
      teacher: "Анна Петрова",
      attachments: 2
    },
    {
      id: 2,
      subject: "Английский язык",
      title: "Эссе на 150 слов",
      description: "Тема: 'Мой идеальный день'",
      dueDate: "Пятница",
      priority: "medium",
      status: "completed",
      progress: 100,
      teacher: "Мария Иванова",
      attachments: 1
    },
    {
      id: 3,
      subject: "Информатика",
      title: "Проект «Калькулятор»",
      description: "Создание простого калькулятора на Python",
      dueDate: "Понедельник",
      priority: "high",
      status: "pending",
      progress: 30,
      teacher: "Дмитрий Сидоров",
      attachments: 3
    },
    {
      id: 4,
      subject: "История",
      title: "Реферат по Древнему Риму",
      description: "Культура и быт римлян",
      dueDate: "Через неделю",
      priority: "low",
      status: "pending",
      progress: 0,
      teacher: "Елена Козлова",
      attachments: 0
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending": return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Домашние задания</h1>
          <p className="text-muted-foreground mt-1">Управляйте своими заданиями и сроками</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Новое задание
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего заданий</p>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Завершено</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Срочные</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">В работе</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {homeworkData.map((homework) => (
          <div key={homework.id} className="p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex flex-col items-center bg-white/80 rounded-lg p-3 min-w-[60px]">
                  <BookOpen className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs font-semibold">{homework.subject}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{homework.title}</h3>
                    <Badge className={`text-xs ${getPriorityColor(homework.priority)}`}>
                      {getPriorityIcon(homework.priority)} {homework.priority === "high" ? "Высокий" : homework.priority === "medium" ? "Средний" : "Низкий"}
                    </Badge>
                    {homework.status === "completed" && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                        ✓ Завершено
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{homework.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Срок: {homework.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{homework.attachments} файлов</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Учитель: {homework.teacher}</span>
                    </div>
                  </div>
                  
                  {homework.status !== "completed" && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Прогресс</span>
                        <span>{homework.progress}%</span>
                      </div>
                      <Progress value={homework.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {homework.status === "completed" ? (
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Просмотр
                  </Button>
                ) : (
                  <>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Send className="w-4 h-4 mr-1" />
                      Сдать
                    </Button>
                    <Button size="sm" variant="outline">
                      Редактировать
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Ближайшие сроки
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Математика</span>
              <span className="font-semibold text-red-600">Завтра</span>
            </div>
            <div className="flex justify-between">
              <span>Информатика</span>
              <span className="font-semibold text-orange-600">Понедельник</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Прогресс недели
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Завершено</span>
              <span className="font-semibold">1 из 4</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentHomework;
