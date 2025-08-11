import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Plus,
  Settings,
  MessageSquare,
  Video,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Zap,
  Sparkles,
  Users,
  BarChart3,
  Play,
  Save,
  Share2,
  Download,
  Edit,
  Trash2
} from "lucide-react";

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  status: 'draft' | 'ready' | 'in-progress' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  objectives: string[];
  materials: string[];
  activities: string[];
  aiGenerated: boolean;
  createdAt: string;
  lastModified: string;
}

const TeacherAIPlanner = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = "ИИ‑планировщик — Учитель | Ability School";
  }, []);

  const lessonPlans: LessonPlan[] = [
    {
      id: "1",
      title: "Введение в алгебру",
      subject: "Математика",
      grade: "7 класс",
      duration: "45 минут",
      status: 'ready',
      difficulty: 'medium',
      objectives: [
        "Понять основные понятия алгебры",
        "Научиться решать простые уравнения",
        "Применять алгебраические методы"
      ],
      materials: [
        "Интерактивная доска",
        "Рабочие листы",
        "Калькуляторы"
      ],
      activities: [
        "Объяснение теории (15 мин)",
        "Практические примеры (20 мин)",
        "Самостоятельная работа (10 мин)"
      ],
      aiGenerated: true,
      createdAt: "2024-01-15",
      lastModified: "2 часа назад"
    },
    {
      id: "2",
      title: "История Древнего Рима",
      subject: "История",
      grade: "6 класс",
      duration: "60 минут",
      status: 'in-progress',
      difficulty: 'easy',
      objectives: [
        "Изучить основные события римской истории",
        "Понять влияние Рима на современность",
        "Развить навыки анализа исторических источников"
      ],
      materials: [
        "Презентация",
        "Карты",
        "Исторические документы"
      ],
      activities: [
        "Лекция с презентацией (25 мин)",
        "Работа с картами (15 мин)",
        "Обсуждение в группах (20 мин)"
      ],
      aiGenerated: true,
      createdAt: "2024-01-14",
      lastModified: "1 день назад"
    },
    {
      id: "3",
      title: "Химические реакции",
      subject: "Химия",
      grade: "8 класс",
      duration: "90 минут",
      status: 'draft',
      difficulty: 'hard',
      objectives: [
        "Изучить типы химических реакций",
        "Провести лабораторные опыты",
        "Написать уравнения реакций"
      ],
      materials: [
        "Лабораторное оборудование",
        "Химические реактивы",
        "Техника безопасности"
      ],
      activities: [
        "Теоретическая часть (30 мин)",
        "Лабораторная работа (45 мин)",
        "Анализ результатов (15 мин)"
      ],
      aiGenerated: false,
      createdAt: "2024-01-13",
      lastModified: "3 дня назад"
    },
    {
      id: "4",
      title: "Литературный анализ",
      subject: "Литература",
      grade: "9 класс",
      duration: "45 минут",
      status: 'completed',
      difficulty: 'medium',
      objectives: [
        "Анализировать литературные произведения",
        "Развивать критическое мышление",
        "Выражать собственное мнение"
      ],
      materials: [
        "Тексты произведений",
        "Аналитические схемы",
        "Мультимедиа материалы"
      ],
      activities: [
        "Чтение и анализ (20 мин)",
        "Обсуждение в группах (15 мин)",
        "Презентация выводов (10 мин)"
      ],
      aiGenerated: true,
      createdAt: "2024-01-12",
      lastModified: "1 неделя назад"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPlans = lessonPlans.length;
  const aiGeneratedPlans = lessonPlans.filter(p => p.aiGenerated).length;
  const completedPlans = lessonPlans.filter(p => p.status === 'completed').length;
  const avgObjectives = lessonPlans.reduce((sum, p) => sum + p.objectives.length, 0) / lessonPlans.length;

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">ИИ‑планировщик уроков</h1>
          <p className="text-muted-foreground mt-1">Создавайте интерактивные планы уроков с помощью ИИ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'Список' : 'Сетка'}
          </Button>
          <Button size="sm" onClick={handleGeneratePlan} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Создать план
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Всего планов</p>
              <p className="text-2xl font-bold text-blue-900">{totalPlans}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">ИИ‑сгенерированные</p>
              <p className="text-2xl font-bold text-purple-900">{aiGeneratedPlans}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Завершённые</p>
              <p className="text-2xl font-bold text-green-900">{completedPlans}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Средние цели</p>
              <p className="text-2xl font-bold text-orange-900">{avgObjectives.toFixed(1)}</p>
            </div>
            <Target className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* AI Generation Panel */}
      <div className="p-6 rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Быстрая генерация плана</h3>
              <p className="text-sm text-muted-foreground">ИИ создаст план урока за несколько секунд</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Настройки ИИ
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto p-4 flex flex-col items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            <span>Стандартный план</span>
          </Button>
          <Button className="h-auto p-4 flex flex-col items-center gap-2">
            <Zap className="w-6 h-6" />
            <span>Интерактивный урок</span>
          </Button>
          <Button className="h-auto p-4 flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Групповая работа</span>
          </Button>
        </div>
      </div>

      {/* Lesson Plans Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {lessonPlans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
              }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{plan.title}</h3>
                <p className="text-muted-foreground">{plan.subject} • {plan.grade}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={`${getStatusColor(plan.status)}`}>
                  {getStatusIcon(plan.status)}
                  <span className="ml-1 capitalize">{plan.status}</span>
                </Badge>
                <Badge className={`${getDifficultyColor(plan.difficulty)}`}>
                  {plan.difficulty}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                {plan.duration}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Target className="w-4 h-4 mr-2" />
                {plan.objectives.length} целей
              </div>
              {plan.aiGenerated && (
                <div className="flex items-center text-sm text-purple-600">
                  <Brain className="w-4 h-4 mr-2" />
                  ИИ‑сгенерированный
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Цели урока:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {plan.objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {objective}
                    </li>
                  ))}
                  {plan.objectives.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      +{plan.objectives.length - 2} ещё
                    </li>
                  )}
                </ul>
              </div>

              <div className="text-xs text-muted-foreground">
                Изменён: {plan.lastModified}
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button size="sm" variant="outline" className="flex-1">
                <Play className="w-4 h-4 mr-1" />
                Запустить
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Редактировать
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {selectedPlan && (
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-lg font-semibold mb-4">
            Действия для "{lessonPlans.find(p => p.id === selectedPlan)?.title}"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Video className="w-6 h-6" />
              <span>Начать урок</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="w-6 h-6" />
              <span>Экспорт PDF</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Share2 className="w-6 h-6" />
              <span>Поделиться</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="destructive">
              <Trash2 className="w-6 h-6" />
              <span>Удалить</span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeacherAIPlanner;
