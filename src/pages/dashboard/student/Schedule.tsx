import { useEffect } from "react";
import { Calendar, Clock, BookOpen, Users, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StudentSchedule = () => {
  useEffect(() => {
    document.title = "Расписание — Ученик | Ability School";
  }, []);

  const scheduleData = [
    {
      time: "09:00",
      subject: "Математика",
      teacher: "Анна Петрова",
      type: "Виртуальный класс",
      room: "3D-класс",
      duration: "45 мин",
      status: "upcoming"
    },
    {
      time: "11:00", 
      subject: "Английский язык",
      teacher: "Мария Иванова",
      type: "Онлайн",
      room: "Zoom",
      duration: "45 мин",
      status: "current"
    },
    {
      time: "14:00",
      subject: "Информатика", 
      teacher: "Дмитрий Сидоров",
      type: "Практика",
      room: "Лаборатория",
      duration: "60 мин",
      status: "upcoming"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "bg-green-100 text-green-800 border-green-200";
      case "upcoming": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current": return "🟢";
      case "upcoming": return "⏰";
      default: return "⚪";
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Расписание уроков</h1>
          <p className="text-muted-foreground mt-1">Сегодня, 15 декабря 2024</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Календарь
        </Button>
      </div>

      <div className="grid gap-4">
        {scheduleData.map((lesson, index) => (
          <div key={index} className={`p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-200 ${getStatusColor(lesson.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center bg-white/80 rounded-lg p-3 min-w-[60px]">
                  <Clock className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-sm font-semibold">{lesson.time}</span>
                  <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-lg">{lesson.subject}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getStatusIcon(lesson.status)} {lesson.status === "current" ? "Сейчас" : "Скоро"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>{lesson.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.type === "Виртуальный класс" ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      <span>{lesson.type} • {lesson.room}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {lesson.status === "current" && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Присоединиться
                  </Button>
                )}
                {lesson.status === "upcoming" && (
                  <Button size="sm" variant="outline">
                    Напомнить
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Завтра
          </h3>
          <p className="text-sm text-muted-foreground">3 урока: Физика, История, Литература</p>
        </div>
        
        <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            Прогресс недели
          </h3>
          <p className="text-sm text-muted-foreground">15 из 20 уроков завершено</p>
        </div>
      </div>
    </section>
  );
};

export default StudentSchedule;
