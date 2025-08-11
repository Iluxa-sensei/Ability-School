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
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Participant {
  id: string;
  name: string;
  role: string;
  status: 'speaking' | 'listening' | 'away';
  isHandRaised: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  avatar: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

const StudentClassroom = () => {
  useEffect(() => {
    document.title = "Виртуальный класс — Ученик | Ability School";
  }, []);

  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPrivateChat, setIsPrivateChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showTools, setShowTools] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenRafRef = useRef<number | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [hasScreenShare, setHasScreenShare] = useState(false);

  const participants: Participant[] = [
    {
      id: "1",
      name: "Анна Петрова",
      role: "Учитель",
      status: "speaking",
      isHandRaised: false,
      isMuted: false,
      isVideoOn: true,
      avatar: "АП"
    },
    {
      id: "2",
      name: "Иван Сидоров",
      role: "Ученик",
      status: "listening",
      isHandRaised: true,
      isMuted: false,
      isVideoOn: true,
      avatar: "ИС"
    },
    {
      id: "3",
      name: "Мария Козлова",
      role: "Ученик",
      status: "listening",
      isHandRaised: false,
      isMuted: true,
      isVideoOn: false,
      avatar: "МК"
    },
    {
      id: "4",
      name: "Вы",
      role: "Ученик",
      status: "listening",
      isHandRaised: false,
      isMuted: !isMicOn,
      isVideoOn: isCameraOn,
      avatar: "ВЫ"
    }
  ];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Анна Петрова", message: "Добро пожаловать на урок!", timestamp: "15:30", type: 'text' },
    { id: "2", sender: "Иван Сидоров", message: "Здравствуйте!", timestamp: "15:31", type: 'text' },
    { id: "3", sender: "Система", message: "Мария Козлова присоединилась к уроку", timestamp: "15:32", type: 'system' },
    { id: "4", sender: "Анна Петрова", message: "Сегодня мы изучаем алгебраические уравнения", timestamp: "15:33", type: 'text' },
    { id: "5", sender: "Иван Сидоров", message: "Можно задать вопрос?", timestamp: "15:34", type: 'text' },
    { id: "6", sender: "Анна Петрова", message: "Конечно! Поднимите руку", timestamp: "15:35", type: 'text' }
  ]);

  // Real camera and microphone functionality
  const startCamera = useCallback(async () => {
    try {
      // Stop previous camera stream if any
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
        // Play after metadata is loaded to avoid blank/blue frame
        videoEl.onloadedmetadata = () => {
          videoEl.muted = true;
          videoEl.play().catch(console.error);
        };
      }
      // Track lifecycle and update visibility flag
      stream.getVideoTracks().forEach(track => {
        track.onended = () => setHasCamera(false);
      });
      setHasCamera(true);
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  // Auto-start camera on mount to prevent blue screen when isCameraOn=true
  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          // Auto stop when user ends share from browser UI
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
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "Вы",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage("");
    }
  }, [chatMessage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "speaking": return "bg-green-100 text-green-800 border-green-200";
      case "listening": return "bg-blue-100 text-blue-800 border-blue-200";
      case "away": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "speaking": return <Mic className="w-3 h-3" />;
      case "listening": return <Volume2 className="w-3 h-3" />;
      case "away": return <Clock className="w-3 h-3" />;
      default: return <Volume2 className="w-3 h-3" />;
    }
  };

  const onlineParticipants = participants.filter(p => p.status !== 'away').length;
  const handRaisedCount = participants.filter(p => p.isHandRaised).length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Виртуальный 3D‑класс</h1>
          <p className="text-muted-foreground mt-1">Математика • Алгебраические уравнения</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            🟢 Онлайн
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            15:30
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {onlineParticipants} участников
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Участники онлайн</p>
              <p className="text-2xl font-bold text-blue-900">{onlineParticipants}</p>
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
              <p className="text-sm font-medium text-purple-700">Ваша камера</p>
              <p className="text-2xl font-bold text-purple-900">{isCameraOn ? 'Вкл' : 'Выкл'}</p>
            </div>
            <Camera className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Ваш микрофон</p>
              <p className="text-2xl font-bold text-orange-900">{isMicOn ? 'Вкл' : 'Выкл'}</p>
            </div>
            <Mic className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Main Classroom Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Area */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border p-6 min-h-[500px]">
            <div className="absolute inset-0 bg-black/5 rounded-xl pointer-events-none z-0"></div>

            {/* Video Stream */}
            <div className="relative z-10 h-[500px]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover rounded-lg absolute inset-0 transition-opacity duration-200 ${hasCamera ? 'opacity-100' : 'opacity-0'} `}
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
                    <h3 className="font-semibold text-xl mb-3">3D Виртуальный класс</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      Поддерживаются чат, поднятие руки и совместные доски
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Подключение к классу...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{onlineParticipants} участников онлайн</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Panel */}
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
                  variant={isHandRaised ? "default" : "outline"}
                  onClick={() => setIsHandRaised(!isHandRaised)}
                  className={isHandRaised ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                >
                  <Hand className="w-4 h-4" />
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
          {/* Toggle Buttons */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              size="sm"
              variant={showParticipants ? 'default' : 'ghost'}
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-1" />
              Участники
            </Button>
            <Button
              size="sm"
              variant={showChat ? 'default' : 'ghost'}
              onClick={() => setShowChat(!showChat)}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Чат
            </Button>
            <Button
              size="sm"
              variant={showTools ? 'default' : 'ghost'}
              onClick={() => setShowTools(!showTools)}
              className="flex-1"
            >
              <PenTool className="w-4 h-4 mr-1" />
              Инструменты
            </Button>
          </div>

          {/* Participants */}
          {showParticipants && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Участники ({participants.length})
              </h3>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {participant.avatar}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${participant.status === 'speaking' ? 'bg-green-500' :
                        participant.status === 'listening' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{participant.name}</span>
                        {participant.isHandRaised && <Hand className="w-3 h-3 text-yellow-600" />}
                        {participant.isMuted && <VolumeX className="w-3 h-3 text-red-600" />}
                        {!participant.isVideoOn && <EyeOff className="w-3 h-3 text-gray-600" />}
                        {getStatusIcon(participant.status)}
                      </div>
                      <span className="text-xs text-muted-foreground">{participant.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          {showChat && (
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  Чат
                </h3>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsPrivateChat(!isPrivateChat)}
                    className="h-6 w-6 p-0"
                  >
                    {isPrivateChat ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`text-xs ${msg.type === 'system' ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                    {msg.type === 'system' ? (
                      <span className="text-center block">{msg.message}</span>
                    ) : (
                      <>
                        <span className="font-semibold">{msg.sender}:</span> {msg.message}
                        <span className="text-muted-foreground ml-2">{msg.timestamp}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
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
          )}

          {/* Tools */}
          {showTools && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-purple-600" />
                Инструменты
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setSelectedTool('materials')}
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Материалы
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setSelectedTool('board')}
                >
                  <PenTool className="w-3 h-3 mr-1" />
                  Доска
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setSelectedTool('test')}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Тест
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setSelectedTool('notes')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Заметки
                </Button>
              </div>

              {selectedTool && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">
                      {selectedTool === 'materials' && 'Материалы урока'}
                      {selectedTool === 'board' && 'Интерактивная доска'}
                      {selectedTool === 'test' && 'Тест по теме'}
                      {selectedTool === 'notes' && 'Ваши заметки'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedTool(null)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedTool === 'materials' && 'Презентация, документы, видео'}
                    {selectedTool === 'board' && 'Рисуйте, пишите, делитесь'}
                    {selectedTool === 'test' && 'Проверьте свои знания'}
                    {selectedTool === 'notes' && 'Записывайте важное'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lesson Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Тема урока
          </h3>
          <p className="text-sm">Алгебраические уравнения и неравенства</p>
        </div>

        <div className="p-4 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            Учитель
          </h3>
          <p className="text-sm">Анна Петрова</p>
        </div>

        <div className="p-4 rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-600" />
            Статус
          </h3>
          <p className="text-sm">Активный урок • 25 минут</p>
        </div>
      </div>
    </section>
  );
};

export default StudentClassroom;
