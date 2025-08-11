import { useEffect, useState, useRef, useCallback } from "react";
import {
  Video,
  Users,
  MessageSquare,
  Hand,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  Settings,
  BookOpen,
  PenTool,
  Monitor,
  Clock,
  Target,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  ScreenShare,
  StopCircle,
  Timer,
  Award,
  Lightbulb,
  Zap,
  Send,
  Smile,
  Paperclip,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Mic2,
  VideoOff,
  MonitorOff,
  Share2,
  Settings2,
  Bell,
  BellOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  isHandRaised: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  participation: number;
  lastActivity: string;
}

interface LessonActivity {
  id: string;
  type: 'question' | 'exercise' | 'discussion' | 'break';
  title: string;
  duration: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
}

const TeacherClassroom = () => {
  useEffect(() => {
    document.title = "Урок — Учитель | Ability School";
  }, []);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lessonStatus, setLessonStatus] = useState<'preparing' | 'active' | 'paused' | 'ended'>('active');
  const [selectedView, setSelectedView] = useState<'main' | 'students' | 'materials' | 'analytics'>('main');
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; message: string; timestamp: string; type: 'text' | 'system' }>>([
    { id: "1", sender: "Система", message: "Урок начался", timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), type: 'system' }
  ]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPrivateChat, setIsPrivateChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenOff, setIsScreenOff] = useState(false);
  const [isBellOn, setIsBellOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenRafRef = useRef<number | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [hasScreenShare, setHasScreenShare] = useState(false);

  const students: Student[] = [
    {
      id: "1",
      name: "Иван Сидоров",
      status: 'online',
      isHandRaised: true,
      isSpeaking: false,
      isMuted: false,
      isVideoOn: true,
      participation: 85,
      lastActivity: "2 мин назад"
    },
    {
      id: "2",
      name: "Мария Козлова",
      status: 'online',
      isHandRaised: false,
      isSpeaking: true,
      isMuted: false,
      isVideoOn: true,
      participation: 92,
      lastActivity: "1 мин назад"
    },
    {
      id: "3",
      name: "Алексей Петров",
      status: 'away',
      isHandRaised: false,
      isSpeaking: false,
      isMuted: true,
      isVideoOn: false,
      participation: 45,
      lastActivity: "5 мин назад"
    },
    {
      id: "4",
      name: "Елена Смирнова",
      status: 'online',
      isHandRaised: false,
      isSpeaking: false,
      isMuted: false,
      isVideoOn: true,
      participation: 78,
      lastActivity: "30 сек назад"
    },
    {
      id: "5",
      name: "Дмитрий Волков",
      status: 'offline',
      isHandRaised: false,
      isSpeaking: false,
      isMuted: true,
      isVideoOn: false,
      participation: 0,
      lastActivity: "10 мин назад"
    }
  ];

  const [lessonActivities, setLessonActivities] = useState<LessonActivity[]>([
    { id: "1", type: 'question', title: "Проверка домашнего задания", duration: 10, status: 'completed', participants: 4 },
    { id: "2", type: 'exercise', title: "Решение уравнений", duration: 20, status: 'active', participants: 5 },
    { id: "3", type: 'discussion', title: "Обсуждение методов решения", duration: 15, status: 'upcoming', participants: 0 },
    { id: "4", type: 'break', title: "Короткий перерыв", duration: 5, status: 'upcoming', participants: 0 }
  ]);

  // Quick actions to add lesson activities dynamically
  const addActivity = useCallback((type: LessonActivity['type'], title: string, duration = 5) => {
    const newActivity: LessonActivity = {
      id: Date.now().toString(),
      type,
      title,
      duration,
      status: 'active',
      participants: 0
    };
    setLessonActivities(prev => [newActivity, ...prev]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800 border-green-200";
      case "away": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "active": return "bg-blue-100 text-blue-800 border-blue-200";
      case "upcoming": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question": return <Target className="w-4 h-4" />;
      case "exercise": return <PenTool className="w-4 h-4" />;
      case "discussion": return <MessageSquare className="w-4 h-4" />;
      case "break": return <Timer className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const onlineStudents = students.filter(s => s.status === 'online').length;
  const totalStudents = students.length;
  const handRaisedCount = students.filter(s => s.isHandRaised).length;
  const speakingCount = students.filter(s => s.isSpeaking).length;

  // Real camera and microphone functionality
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        const videoEl = videoRef.current;
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = () => {
          videoEl.muted = true;
          videoEl.play().catch(console.error);
        };
      }
      stream.getVideoTracks().forEach(t => t.onended = () => setHasCamera(false));
      setHasCamera(true);
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch { }
      videoRef.current.srcObject = null;
      // cleanup handler
      (videoRef.current as HTMLVideoElement).onloadedmetadata = null as any;
    }
    setHasCamera(false);
    setIsCameraOn(false);
  }, []);

  const toggleMicrophone = useCallback(async () => {
    if (!isMicOn) {
      try {
        if (!streamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
        } else {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getAudioTracks().forEach(track => {
            streamRef.current!.addTrack(track);
          });
        }
        setIsMicOn(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => track.stop());
      }
      setIsMicOn(false);
    }
  }, [isMicOn]);

  const toggleScreenSharing = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);

        // Show screen share in canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          const video = document.createElement('video');
          video.srcObject = screenStream;
          video.onloadedmetadata = () => {
            if (canvasRef.current && ctx) {
              canvasRef.current.width = video.videoWidth;
              canvasRef.current.height = video.videoHeight;

              const drawFrame = () => {
                if (!canvasRef.current || !ctx) return;
                if (video.readyState >= 2) {
                  ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
                screenRafRef.current = requestAnimationFrame(drawFrame);
              };
              drawFrame();
            }
          };
          video.play().catch(console.error);

          screenStream.getVideoTracks().forEach(t => {
            t.onended = () => {
              if (screenRafRef.current) cancelAnimationFrame(screenRafRef.current);
              if (canvasRef.current) {
                const c = canvasRef.current;
                const cctx = c.getContext('2d');
                cctx?.clearRect(0, 0, c.width, c.height);
              }
              setIsScreenSharing(false);
              setHasScreenShare(false);
              screenStreamRef.current?.getTracks().forEach(track => track.stop());
              screenStreamRef.current = null;
            };
          });
          setHasScreenShare(true);
        }
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      if (screenRafRef.current) cancelAnimationFrame(screenRafRef.current);
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      if (canvasRef.current) {
        const c = canvasRef.current;
        const cctx = c.getContext('2d');
        cctx?.clearRect(0, 0, c.width, c.height);
      }
      setIsScreenSharing(false);
      setHasScreenShare(false);
    }
  }, [isScreenSharing]);

  const sendChatMessage = useCallback(() => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "Вы (Учитель)",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        type: 'text' as const
      };
      setChatMessages(prev => [
        ...prev,
        newMessage
      ]);
      setChatMessage("");
    }
  }, [chatMessage]);

  // Auto-start camera to avoid blue screen when video tag is mounted
  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const muteStudent = useCallback((studentId: string) => {
    console.log('Muting student:', studentId);
    // In a real app, this would send a command to mute the student
  }, []);

  const removeStudent = useCallback((studentId: string) => {
    console.log('Removing student:', studentId);
    // In a real app, this would remove the student from the class
  }, []);

  const callStudent = useCallback((studentId: string) => {
    console.log('Calling student:', studentId);
    // In a real app, this would call the student to answer
  }, []);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Урок: Алгебраические уравнения</h1>
          <p className="text-muted-foreground mt-1">7А класс • 25 минут • 5 учеников</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={lessonStatus === 'active' ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
            {lessonStatus === 'active' ? '🟢 Активный урок' : '🟡 Пауза'}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            15:30 - 16:15
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Ученики онлайн</p>
              <p className="text-2xl font-bold text-blue-900">{onlineStudents}/{totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Поднятые руки</p>
              <p className="text-2xl font-bold text-green-900">{handRaisedCount}</p>
            </div>
            <Hand className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Говорят сейчас</p>
              <p className="text-2xl font-bold text-purple-900">{speakingCount}</p>
            </div>
            <Mic className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Время урока</p>
              <p className="text-2xl font-bold text-orange-900">25 мин</p>
            </div>
            <Timer className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Main Classroom Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border p-6 min-h-[500px]">
            <div className="absolute inset-0 bg-black/5 rounded-xl"></div>

            {/* Video Stream */}
            <div className="relative z-10 h-[500px]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover rounded-lg absolute inset-0 transition-opacity duration-200 ${hasCamera ? 'opacity-100' : 'opacity-0'}`}
                style={{ display: 'block' }}
              />

              <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover rounded-lg absolute inset-0 transition-opacity duration-200 ${hasScreenShare ? 'opacity-100' : 'opacity-0'}`}
                style={{ display: 'block' }}
              />

              {!hasCamera && !hasScreenShare && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Video className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3">Учительский интерфейс</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      Управляйте уроком, отслеживайте активность учеников и используйте интерактивные инструменты
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Урок активен</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{onlineStudents} учеников онлайн</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teacher Control Panel */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl border">
                <Button
                  size="sm"
                  variant={isMicOn ? "default" : "outline"}
                  onClick={toggleMicrophone}
                  className={isMicOn ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isCameraOn ? "default" : "outline"}
                  onClick={isCameraOn ? stopCamera : startCamera}
                  className={isCameraOn ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isScreenSharing ? "default" : "outline"}
                  onClick={toggleScreenSharing}
                  className={isScreenSharing ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <ScreenShare className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={isRecording ? "default" : "outline"}
                  onClick={() => setIsRecording(!isRecording)}
                  className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {isRecording ? <StopCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* View Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              size="sm"
              variant={selectedView === 'main' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('main')}
              className="flex-1"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Обзор
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'students' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('students')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-1" />
              Ученики
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'materials' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('materials')}
              className="flex-1"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Материалы
            </Button>
            <Button
              size="sm"
              variant={selectedView === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('analytics')}
              className="flex-1"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Аналитика
            </Button>
          </div>

          {/* Content based on selected view */}
          {selectedView === 'main' && (
            <>
              {/* Lesson Progress */}
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Прогресс урока
                </h3>
                <div className="space-y-3">
                  {lessonActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{activity.title}</span>
                          <Badge className={`text-xs ${getActivityStatusColor(activity.status)}`}>
                            {activity.status === 'completed' ? 'Завершено' :
                              activity.status === 'active' ? 'Активно' : 'Ожидает'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{activity.duration} мин</span>
                          <Users className="w-3 h-3" />
                          <span>{activity.participants} участников</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Быстрые действия
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => addActivity('question', 'Новый вопрос')}>
                    <Target className="w-3 h-3 mr-1" />
                    Вопрос
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => addActivity('exercise', 'Новое упражнение')}>
                    <PenTool className="w-3 h-3 mr-1" />
                    Упражнение
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => addActivity('discussion', 'Новое обсуждение')}>
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Обсуждение
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => addActivity('break', 'Перерыв', 5)}>
                    <Timer className="w-3 h-3 mr-1" />
                    Перерыв
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedView === 'students' && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Ученики ({students.length})
              </h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${student.status === 'online' ? 'bg-green-500' :
                        student.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{student.name}</span>
                        {student.isHandRaised && <Hand className="w-4 h-4 text-yellow-600" />}
                        {student.isSpeaking && <Mic className="w-4 h-4 text-green-600" />}
                        {student.isMuted && <VolumeX className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Активность: {student.participation}%</span>
                        <span>•</span>
                        <span>{student.lastActivity}</span>
                      </div>
                      <Progress value={student.participation} className="h-1 mt-1" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => callStudent(student.id)}
                        title="Вызвать ученика"
                      >
                        <UserCheck className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => muteStudent(student.id)}
                        title="Заглушить микрофон"
                      >
                        <Mic2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => removeStudent(student.id)}
                        title="Удалить из класса"
                      >
                        <UserX className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'materials' && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                Материалы урока
              </h3>
              <div className="space-y-3">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Презентация "Алгебраические уравнения"
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <PenTool className="w-4 h-4 mr-2" />
                  Интерактивная доска
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Тест по теме
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Дополнительные материалы
                </Button>
              </div>
              <Button size="sm" className="w-full mt-3">
                <Plus className="w-4 h-4 mr-2" />
                Добавить материал
              </Button>
            </div>
          )}

          {selectedView === 'analytics' && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Аналитика урока
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Общая активность</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Участие в обсуждении</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Выполнение заданий</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Время урока:</span>
                      <span>25 мин</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Активных учеников:</span>
                      <span>{onlineStudents}/{totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Поднятых рук:</span>
                      <span>{handRaisedCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              Чат класса
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`text-xs ${msg.type === 'system' ? 'text-muted-foreground italic text-center' : 'text-foreground'}`}>
                  {msg.type === 'system' ? (
                    <span>{msg.message}</span>
                  ) : (
                    <>
                      <span className="font-semibold">{msg.sender}:</span> {msg.message}
                      <span className="text-muted-foreground ml-2">{msg.timestamp}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm" onClick={sendChatMessage} className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Controls */}
      <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant={lessonStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setLessonStatus(lessonStatus === 'active' ? 'paused' : 'active')}
            className={lessonStatus === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {lessonStatus === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {lessonStatus === 'active' ? 'Пауза' : 'Продолжить'}
          </Button>
          <Button variant="outline">
            <Timer className="w-4 h-4 mr-2" />
            Перерыв
          </Button>
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Вопрос
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Award className="w-4 h-4 mr-2" />
            Оценки
          </Button>
          <Button variant="destructive">
            <X className="w-4 h-4 mr-2" />
            Завершить урок
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TeacherClassroom;
