import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Settings,
  MessageSquare,
  Video,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  UserPlus,
  BarChart3
} from "lucide-react";

interface ClassData {
  id: string;
  name: string;
  students: number;
  subject: string;
  schedule: string;
  room: string;
  progress: number;
  status: 'active' | 'completed' | 'upcoming';
  lastActivity: string;
  attendance: number;
  avgGrade: number;
}

const TeacherClasses = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    document.title = "Классы — Учитель | Ability School";
  }, []);

  const classesData: ClassData[] = [
    {
      id: "5a",
      name: "5А",
      students: 28,
      subject: "Математика",
      schedule: "Пн, Ср, Пт 09:00-10:30",
      room: "Кабинет 201",
      progress: 75,
      status: 'active',
      lastActivity: "2 часа назад",
      attendance: 92,
      avgGrade: 4.2
    },
    {
      id: "6b",
      name: "6Б",
      students: 26,
      subject: "Математика",
      schedule: "Вт, Чт 10:45-12:15",
      room: "Кабинет 203",
      progress: 60,
      status: 'active',
      lastActivity: "1 день назад",
      attendance: 88,
      avgGrade: 3.9
    },
    {
      id: "7a",
      name: "7А",
      students: 24,
      subject: "Алгебра",
      schedule: "Пн, Ср 13:30-15:00",
      room: "Кабинет 205",
      progress: 45,
      status: 'active',
      lastActivity: "3 дня назад",
      attendance: 95,
      avgGrade: 4.1
    },
    {
      id: "8b",
      name: "8Б",
      students: 22,
      subject: "Геометрия",
      schedule: "Вт, Чт 15:15-16:45",
      room: "Кабинет 207",
      progress: 30,
      status: 'upcoming',
      lastActivity: "1 неделя назад",
      attendance: 90,
      avgGrade: 3.8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'upcoming': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalStudents = classesData.reduce((sum, cls) => sum + cls.students, 0);
  const avgProgress = classesData.reduce((sum, cls) => sum + cls.progress, 0) / classesData.length;
  const avgAttendance = classesData.reduce((sum, cls) => sum + cls.attendance, 0) / classesData.length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Мои классы</h1>
          <p className="text-muted-foreground mt-1">Управление классами и отслеживание прогресса</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'Список' : 'Сетка'}
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Новый класс
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Всего классов</p>
              <p className="text-2xl font-bold text-blue-900">{classesData.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Всего учеников</p>
              <p className="text-2xl font-bold text-green-900">{totalStudents}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Средний прогресс</p>
              <p className="text-2xl font-bold text-purple-900">{avgProgress.toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Посещаемость</p>
              <p className="text-2xl font-bold text-orange-900">{avgAttendance.toFixed(0)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Classes Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {classesData.map((cls) => (
          <div
            key={cls.id}
            className={`p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer ${selectedClass === cls.id ? 'ring-2 ring-primary' : ''
              }`}
            onClick={() => setSelectedClass(cls.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{cls.name}</h3>
                <p className="text-muted-foreground">{cls.subject}</p>
              </div>
              <Badge className={`${getStatusColor(cls.status)}`}>
                {getStatusIcon(cls.status)}
                <span className="ml-1 capitalize">{cls.status}</span>
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                {cls.students} учеников
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {cls.schedule}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {cls.room}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс курса</span>
                  <span className="font-medium">{cls.progress}%</span>
                </div>
                <Progress value={cls.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Посещаемость</p>
                  <p className="font-semibold">{cls.attendance}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Средняя оценка</p>
                  <p className="font-semibold">{cls.avgGrade}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Последняя активность: {cls.lastActivity}
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button size="sm" variant="outline" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                Чат
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Video className="w-4 h-4 mr-1" />
                Урок
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {selectedClass && (
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-lg font-semibold mb-4">Быстрые действия для {classesData.find(c => c.id === selectedClass)?.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span>Создать задание</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Video className="w-6 h-6" />
              <span>Начать урок</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <UserPlus className="w-6 h-6" />
              <span>Добавить ученика</span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeacherClasses;
