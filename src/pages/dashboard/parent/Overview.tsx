import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
  FileText,
  TrendingUp,
  CheckCircle,
  Award,
  Trophy,
  Star,
  GraduationCap,
  School,
  Home,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Download,
  Share2,
  Edit,
  Trash2,
  Bell,
  BellOff,
  Settings2,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share,
  Bookmark,
  Flag,
  User,
  UserCheck,
  UserX,
  Activity,
  Zap,
  TrendingDown,
  Minus,
  X,
  Check,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Gift,
  Crown,
  Medal,
  Ribbon,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  Coins,
  PiggyBank,
  Building,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  HeartOff,
  HeartPulse,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Bluetooth,
  BluetoothOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Mic2,
  VideoOff,
  Camera,
  CameraOff,
  Image,
  ImageOff,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet
} from "lucide-react";

interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar: string;
  overallProgress: number;
  attendance: number;
  averageGrade: number;
  subjects: Subject[];
  recentActivities: Activity[];
  achievements: Achievement[];
  upcomingEvents: Event[];
  teachers: Teacher[];
  notifications: Notification[];
}

interface Subject {
  name: string;
  progress: number;
  grade: string;
  teacher: string;
  lastActivity: string;
}

interface Activity {
  id: string;
  type: 'homework' | 'test' | 'achievement' | 'attendance' | 'grade';
  title: string;
  description: string;
  timestamp: string;
  subject?: string;
  grade?: string;
  teacher?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  points: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'parent_meeting' | 'school_event' | 'exam' | 'holiday';
  location?: string;
  description?: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  avatar: string;
  availability: string;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const ParentOverview = () => {
  useEffect(() => {
    document.title = "Обзор — Родитель | Ability School";
  }, []);

  const [selectedChild, setSelectedChild] = useState<string>("1");
  const [showNotifications, setShowNotifications] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  const children: Child[] = [
    {
      id: "1",
      name: "Анна Петрова",
      grade: "7А класс",
      school: "СОШ №15",
      avatar: "АП",
      overallProgress: 87,
      attendance: 94,
      averageGrade: 4.3,
      subjects: [
        { name: "Математика", progress: 92, grade: "5", teacher: "Иванова М.А.", lastActivity: "2 часа назад" },
        { name: "Русский язык", progress: 85, grade: "4", teacher: "Петрова Е.В.", lastActivity: "1 день назад" },
        { name: "История", progress: 78, grade: "4", teacher: "Сидоров А.И.", lastActivity: "3 дня назад" },
        { name: "Физика", progress: 90, grade: "5", teacher: "Козлова Л.М.", lastActivity: "5 часов назад" },
        { name: "Английский язык", progress: 88, grade: "5", teacher: "Волкова Н.С.", lastActivity: "1 день назад" }
      ],
      recentActivities: [
        { id: "1", type: 'achievement', title: "Отличник недели", description: "Получена награда за высокие результаты", timestamp: "2 часа назад", subject: "Общее" },
        { id: "2", type: 'grade', title: "Контрольная работа", description: "Получена оценка 5 по математике", timestamp: "1 день назад", subject: "Математика", grade: "5" },
        { id: "3", type: 'homework', title: "Домашнее задание", description: "Сдано задание по физике", timestamp: "2 дня назад", subject: "Физика" },
        { id: "4", type: 'test', title: "Тест по истории", description: "Написана контрольная работа", timestamp: "3 дня назад", subject: "История", grade: "4" },
        { id: "5", type: 'attendance', title: "Посещаемость", description: "Отличная посещаемость в этом месяце", timestamp: "1 неделя назад" }
      ],
      achievements: [
        { id: "1", title: "Отличник недели", description: "За высокие результаты в учебе", icon: "🏆", date: "2024-01-15", points: 100 },
        { id: "2", title: "Математический гений", description: "За отличные результаты по математике", icon: "🧮", date: "2024-01-10", points: 75 },
        { id: "3", title: "Активный участник", description: "За активное участие в школьной жизни", icon: "⭐", date: "2024-01-05", points: 50 }
      ],
      upcomingEvents: [
        { id: "1", title: "Родительское собрание", date: "2024-01-20", time: "18:00", type: 'parent_meeting', location: "Кабинет 201", description: "Обсуждение успеваемости" },
        { id: "2", title: "Школьная олимпиада", date: "2024-01-25", time: "10:00", type: 'school_event', location: "Актовый зал", description: "Математическая олимпиада" },
        { id: "3", title: "Контрольная работа", date: "2024-01-22", time: "09:00", type: 'exam', location: "Кабинет 203", description: "Контрольная по физике" }
      ],
      teachers: [
        { id: "1", name: "Иванова Мария Александровна", subject: "Математика", email: "ivanova@school.ru", phone: "+7 (999) 123-45-67", avatar: "ИМ", availability: "Пн-Пт 09:00-17:00" },
        { id: "2", name: "Петрова Елена Владимировна", subject: "Русский язык", email: "petrova@school.ru", phone: "+7 (999) 234-56-78", avatar: "ПЕ", availability: "Пн-Пт 08:00-16:00" },
        { id: "3", name: "Сидоров Андрей Иванович", subject: "История", email: "sidorov@school.ru", phone: "+7 (999) 345-67-89", avatar: "СА", availability: "Вт-Сб 10:00-18:00" }
      ],
      notifications: [
        { id: "1", type: 'success', title: "Отличная работа!", message: "Анна получила 5 за контрольную по математике", timestamp: "2 часа назад", read: false },
        { id: "2", type: 'info', title: "Новое домашнее задание", message: "Задано домашнее задание по физике", timestamp: "1 день назад", read: true },
        { id: "3", type: 'warning', title: "Пропуск урока", message: "Анна пропустила урок английского языка", timestamp: "2 дня назад", read: true },
        { id: "4", type: 'info', title: "Родительское собрание", message: "Напоминание о родительском собрании 20 января", timestamp: "3 дня назад", read: true }
      ]
    }
  ];

  const selectedChildData = children.find(child => child.id === selectedChild);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'parent_meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'school_event': return 'bg-green-100 text-green-800 border-green-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'holiday': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'parent_meeting': return <Users className="w-4 h-4" />;
      case 'school_event': return <Award className="w-4 h-4" />;
      case 'exam': return <FileText className="w-4 h-4" />;
      case 'holiday': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'homework': return <BookOpen className="w-4 h-4" />;
      case 'test': return <FileText className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'attendance': return <CheckCircle className="w-4 h-4" />;
      case 'grade': return <Star className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Обзор успеваемости</h1>
          <p className="text-muted-foreground mt-1">Мониторинг прогресса и достижений вашего ребенка</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings2 className="w-4 h-4 mr-2" />
            Настройки
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Child Selector */}
      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">{selectedChildData?.avatar}</span>
          </div>
          <div>
            <h3 className="font-semibold">{selectedChildData?.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedChildData?.grade} • {selectedChildData?.school}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Связаться с учителем
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Записаться на встречу
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Общий прогресс</p>
              <p className="text-2xl font-bold text-blue-900">{selectedChildData?.overallProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <Progress value={selectedChildData?.overallProgress || 0} className="h-2 mt-2" />
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Посещаемость</p>
              <p className="text-2xl font-bold text-green-900">{selectedChildData?.attendance}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <Progress value={selectedChildData?.attendance || 0} className="h-2 mt-2" />
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Средняя оценка</p>
              <p className="text-2xl font-bold text-purple-900">{selectedChildData?.averageGrade}</p>
            </div>
            <Star className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Достижения</p>
              <p className="text-2xl font-bold text-orange-900">{selectedChildData?.achievements.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Прогресс по предметам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedChildData?.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{subject.name}</h4>
                        <Badge variant="outline">{subject.grade}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Учитель: {subject.teacher}</span>
                        <span>Последняя активность: {subject.lastActivity}</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Последние события
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedChildData?.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {activity.subject && (
                          <Badge variant="outline" className="text-xs">{activity.subject}</Badge>
                        )}
                        {activity.grade && (
                          <Badge className="text-xs">{activity.grade}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Ближайшие события
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedChildData?.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                        {event.type === 'parent_meeting' ? 'Родительское собрание' :
                          event.type === 'school_event' ? 'Школьное мероприятие' :
                            event.type === 'exam' ? 'Экзамен' : 'Праздник'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.date} в {event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teachers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Учителя
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedChildData?.teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{teacher.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{teacher.name}</h4>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                    <p className="text-xs text-muted-foreground">{teacher.availability}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Mail className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Уведомления
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedChildData?.notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}>
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>
                  {!notification.read && (
                    <Badge className="bg-blue-600 text-white">Новое</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default ParentOverview;
