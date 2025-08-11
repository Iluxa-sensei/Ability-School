import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
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
  Users,
  BarChart3,
  Play,
  Save,
  Share2,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Star,
  Award,
  Timer,
  Send,
  Filter,
  Search
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  description: string;
  dueDate: string;
  status: 'draft' | 'published' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  type: 'homework' | 'test' | 'project' | 'quiz';
  submissions: number;
  totalStudents: number;
  avgGrade: number;
  attachments: string[];
  instructions: string[];
  createdAt: string;
  lastModified: string;
}

const TeacherAssignments = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    document.title = "Задания — Учитель | Ability School";
  }, []);

  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Решение квадратных уравнений",
      subject: "Математика",
      class: "8А",
      description: "Изучение методов решения квадратных уравнений через дискриминант и теорему Виета",
      dueDate: "2024-01-20",
      status: 'published',
      priority: 'high',
      type: 'homework',
      submissions: 24,
      totalStudents: 28,
      avgGrade: 4.2,
      attachments: ["worksheet.pdf", "examples.docx"],
      instructions: [
        "Решите 10 уравнений из учебника",
        "Приведите полное решение",
        "Сдайте до 20 января"
      ],
      createdAt: "2024-01-15",
      lastModified: "2 часа назад"
    },
    {
      id: "2",
      title: "Контрольная по истории",
      subject: "История",
      class: "7Б",
      description: "Проверка знаний по теме 'Древний Рим'",
      dueDate: "2024-01-18",
      status: 'in-progress',
      priority: 'medium',
      type: 'test',
      submissions: 18,
      totalStudents: 26,
      avgGrade: 3.8,
      attachments: ["test_questions.pdf"],
      instructions: [
        "Время выполнения: 45 минут",
        "Использование материалов запрещено",
        "Ответы записывать разборчиво"
      ],
      createdAt: "2024-01-14",
      lastModified: "1 день назад"
    },
    {
      id: "3",
      title: "Проект по химии",
      subject: "Химия",
      class: "9А",
      description: "Исследовательский проект 'Химические реакции в быту'",
      dueDate: "2024-01-25",
      status: 'draft',
      priority: 'medium',
      type: 'project',
      submissions: 0,
      totalStudents: 25,
      avgGrade: 0,
      attachments: ["project_guidelines.pdf", "safety_rules.docx"],
      instructions: [
        "Выберите тему исследования",
        "Проведите эксперимент",
        "Оформите отчет в виде презентации"
      ],
      createdAt: "2024-01-13",
      lastModified: "3 дня назад"
    },
    {
      id: "4",
      title: "Тест по литературе",
      subject: "Литература",
      class: "6А",
      description: "Проверка понимания произведения 'Война и мир'",
      dueDate: "2024-01-22",
      status: 'completed',
      priority: 'low',
      type: 'quiz',
      submissions: 30,
      totalStudents: 30,
      avgGrade: 4.5,
      attachments: ["literature_test.pdf"],
      instructions: [
        "Время выполнения: 30 минут",
        "Ответы на вопросы по тексту",
        "Анализ персонажей"
      ],
      createdAt: "2024-01-12",
      lastModified: "1 неделя назад"
    },
    {
      id: "5",
      title: "Домашнее задание по физике",
      subject: "Физика",
      class: "8Б",
      description: "Решение задач по механике",
      dueDate: "2024-01-19",
      status: 'published',
      priority: 'high',
      type: 'homework',
      submissions: 15,
      totalStudents: 27,
      avgGrade: 3.9,
      attachments: ["physics_problems.pdf", "formulas.docx"],
      instructions: [
        "Решите задачи №1-15",
        "Приведите расчеты",
        "Сдайте в электронном виде"
      ],
      createdAt: "2024-01-16",
      lastModified: "4 часа назад"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return <BookOpen className="w-4 h-4" />;
      case 'test': return <FileText className="w-4 h-4" />;
      case 'project': return <Target className="w-4 h-4" />;
      case 'quiz': return <CheckSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const totalAssignments = assignments.length;
  const publishedAssignments = assignments.filter(a => a.status === 'published').length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const avgGrade = assignments.reduce((sum, a) => sum + a.avgGrade, 0) / assignments.length;

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Задания</h1>
          <p className="text-muted-foreground mt-1">Создание и управление заданиями для учеников</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'Список' : 'Сетка'}
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Новое задание
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Всего заданий</p>
              <p className="text-2xl font-bold text-blue-900">{totalAssignments}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Опубликованные</p>
              <p className="text-2xl font-bold text-green-900">{publishedAssignments}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Завершённые</p>
              <p className="text-2xl font-bold text-purple-900">{completedAssignments}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Средняя оценка</p>
              <p className="text-2xl font-bold text-orange-900">{avgGrade.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск заданий..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            Все
          </Button>
          <Button
            variant={filterStatus === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('published')}
          >
            Опубликованные
          </Button>
          <Button
            variant={filterStatus === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('draft')}
          >
            Черновики
          </Button>
        </div>
      </div>

      {/* Assignments Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className={`p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer ${selectedAssignment === assignment.id ? 'ring-2 ring-primary' : ''
              }`}
            onClick={() => setSelectedAssignment(assignment.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{assignment.title}</h3>
                <p className="text-muted-foreground">{assignment.subject} • {assignment.class}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={`${getStatusColor(assignment.status)}`}>
                  {getStatusIcon(assignment.status)}
                  <span className="ml-1 capitalize">{assignment.status}</span>
                </Badge>
                <Badge className={`${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                {getTypeIcon(assignment.type)}
                <span className="ml-2 capitalize">{assignment.type}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Срок: {assignment.dueDate}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                {assignment.submissions}/{assignment.totalStudents} сдано
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс сдачи</span>
                  <span className="font-medium">{Math.round((assignment.submissions / assignment.totalStudents) * 100)}%</span>
                </div>
                <Progress value={(assignment.submissions / assignment.totalStudents) * 100} className="h-2" />
              </div>

              {assignment.avgGrade > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Средняя оценка:</span>
                  <span className="font-semibold">{assignment.avgGrade}</span>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Изменён: {assignment.lastModified}
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                Просмотр
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
      {selectedAssignment && (
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="text-lg font-semibold mb-4">
            Действия для "{assignments.find(a => a.id === selectedAssignment)?.title}"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Eye className="w-6 h-6" />
              <span>Просмотр работ</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Send className="w-6 h-6" />
              <span>Отправить напоминание</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="w-6 h-6" />
              <span>Экспорт результатов</span>
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

export default TeacherAssignments;
