import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Mic, Send, Square, BookOpen, Lightbulb, Target, HelpCircle, ChevronRight, Plus, Bot, ChevronDown, Sparkles, Brain, GraduationCap, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
// Import three with fallback any typing if types are missing
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as THREE from "three";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const OPENAI_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || "gpt-4o-mini";
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
const ELEVENLABS_VOICE_ID = (import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined) || "21m00Tcm4TlvDq8ikWAM"; // default sample voice
const AVATAR_URL = "https://models.readyplayer.me/68960b2c1447156c3f25a765.glb";

// (kept single implementation below)

function formatMessageContent(content: string): React.ReactNode {
  const lines = content.split(/\r?\n/);
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const h = line.match(/^#{1,6}\s*(.*)$/);
        if (h) {
          return (
            <div key={idx} className="font-bold italic">
              {h[1]}
            </div>
          );
        }

        // Handle LaTeX math expressions with better parsing
        const mathExpressions: Array<{ type: 'inline' | 'block'; content: string; index: number }> = [];

        // Find block math expressions \[...\] or $$...$$
        const blockMathRegex = /(?:\\\[(.*?)\\\]|\$\$(.*?)\$\$)/g;
        let blockMatch;
        while ((blockMatch = blockMathRegex.exec(line)) !== null) {
          const content = blockMatch[1] || blockMatch[2];
          if (content) {
            mathExpressions.push({
              type: 'block',
              content: content.trim(),
              index: blockMatch.index
            });
          }
        }

        // Find inline math expressions \(...\) or $...$
        const inlineMathRegex = /(?:\\\((.*?)\\\)|\$([^$\n]+?)\$)/g;
        let inlineMatch;
        while ((inlineMatch = inlineMathRegex.exec(line)) !== null) {
          const content = inlineMatch[1] || inlineMatch[2];
          if (content) {
            mathExpressions.push({
              type: 'inline',
              content: content.trim(),
              index: inlineMatch.index
            });
          }
        }

        // Sort by index to process in order
        mathExpressions.sort((a, b) => a.index - b.index);

        if (mathExpressions.length === 0) {
          // No math expressions, process as regular text with bold formatting
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <div key={idx}>
              {parts.map((p, i) => {
                const m = p.match(/^\*\*([^*]+)\*\*$/);
                if (m) {
                  return (
                    <span key={i} className="font-bold">
                      {m[1]}
                    </span>
                  );
                }
                return <span key={i}>{p}</span>;
              })}
            </div>
          );
        }

        // Process line with math expressions
        let currentIndex = 0;
        const elements: React.ReactNode[] = [];

        mathExpressions.forEach((expr, exprIndex) => {
          // Add text before math expression
          if (expr.index > currentIndex) {
            const textBefore = line.slice(currentIndex, expr.index);
            const parts = textBefore.split(/(\*\*[^*]+\*\*)/g);
            elements.push(
              <span key={`text-${exprIndex}`}>
                {parts.map((p, i) => {
                  const m = p.match(/^\*\*([^*]+)\*\*$/);
                  if (m) {
                    return (
                      <span key={i} className="font-bold">
                        {m[1]}
                      </span>
                    );
                  }
                  return <span key={i}>{p}</span>;
                })}
              </span>
            );
          }

          // Add math expression with better styling
          elements.push(
            <span
              key={`math-${exprIndex}`}
              className={`font-mono bg-yellow-50 border border-yellow-200 px-2 py-1 rounded text-yellow-800 font-bold ${expr.type === 'block' ? 'block my-2 py-2 text-center' : 'inline'
                }`}
            >
              {expr.content}
            </span>
          );

          // Update current index based on the actual match length
          const matchLength = expr.type === 'block' ?
            (line.includes('\\[') ? 4 : 2) + expr.content.length + (line.includes('\\]') ? 4 : 2) :
            (line.includes('\\(') ? 4 : 2) + expr.content.length + (line.includes('\\)') ? 4 : 2);
          currentIndex = expr.index + matchLength;
        });

        // Add remaining text after last math expression
        if (currentIndex < line.length) {
          const textAfter = line.slice(currentIndex);
          const parts = textAfter.split(/(\*\*[^*]+\*\*)/g);
          elements.push(
            <span key="text-after">
              {parts.map((p, i) => {
                const m = p.match(/^\*\*([^*]+)\*\*$/);
                if (m) {
                  return (
                    <span key={i} className="font-bold">
                      {m[1]}
                    </span>
                  );
                }
                return <span key={i}>{p}</span>;
              })}
            </span>
          );
        }

        return <div key={idx}>{elements}</div>;
      })}
    </div>
  );
}

function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[>_~]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractChoices(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const choices: string[] = [];
  // Strict format: a) ..., b) ..., c) ..., d) ...
  const choiceRegex = /^\s*([a-d])\)\s+(.*)$/i;
  for (const line of lines) {
    const m = line.match(choiceRegex);
    if (m && m[1] && m[2]) {
      choices.push(m[2].trim());
    }
  }
  return choices;
}

// Extract question text (lines before the first choice like: a) ...)
function extractQuestion(text: string): string {
  const lines = text.split(/\r?\n/);
  const choiceRegex = /^\s*([a-d])\)\s+(.*)$/i;
  const questionLines: string[] = [];
  for (const line of lines) {
    if (choiceRegex.test(line)) break;
    if (line.trim()) questionLines.push(line.trim());
  }
  return questionLines.join(" ").trim();
}

function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsProvider, setTtsProvider] = useState<"ElevenLabs" | "WebSpeech" | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const cleanupAudio = () => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch { }
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const speakWithWebSpeech = useCallback((text: string, lang?: string) => {
    if (!("speechSynthesis" in window)) return false;
    try {
      if (utteranceRef.current) window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || "ru-RU";
      u.rate = 1.0;
      u.pitch = 1.0;
      u.volume = 1.0;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      const voices = window.speechSynthesis.getVoices();
      const ru = voices.find((v) => v.lang?.toLowerCase().startsWith("ru"));
      if (ru) u.voice = ru;
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      setTtsProvider("WebSpeech");
      setTtsError(null);
      return true;
    } catch (e) {
      console.error("Speech synthesis error", e);
      setTtsError(String(e));
      return false;
    }
  }, []);

  const speakWithElevenLabs = useCallback(async (text: string, lang?: string) => {
    if (!ELEVENLABS_API_KEY) return false;
    try {
      cleanupAudio();
      setIsSpeaking(true);
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: { stability: 0.3, similarity_boost: 0.6, style: 0.35 },
        }),
      });
      if (!res.ok) {
        const errTxt = await res.text();
        console.error("ElevenLabs TTS error:", res.status, errTxt);
        setIsSpeaking(false);
        setTtsError(`${res.status}: ${errTxt}`);
        return false;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
      setTtsProvider("ElevenLabs");
      setTtsError(null);
      return true;
    } catch (e) {
      console.error("ElevenLabs playback error", e);
      setIsSpeaking(false);
      setTtsError(String(e));
      return false;
    }
  }, []);

  const speak = useCallback(async (text: string, lang?: string) => {
    if (ELEVENLABS_API_KEY) {
      const ok = await speakWithElevenLabs(text, lang);
      if (ok) return;
    }
    speakWithWebSpeech(text, lang);
  }, [speakWithElevenLabs, speakWithWebSpeech]);

  const stop = useCallback(() => {
    try { window.speechSynthesis?.cancel?.(); } catch { }
    cleanupAudio();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop, ttsProvider, ttsError };
}

// Minimal browser SpeechRecognition hook (no external deps)
function useSpeechRecognition(params: { onResult?: (text: string) => void; onEnd?: () => void }) {
  const { onResult, onEnd } = params || {};
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const supported = typeof window !== "undefined" &&
    (Boolean((window as any).webkitSpeechRecognition) || Boolean((window as any).SpeechRecognition));

  const ensureInstance = useCallback(() => {
    if (!supported) return null;
    if (!recognitionRef.current) {
      const SpeechRecognitionClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const rec = new SpeechRecognitionClass();
      rec.onresult = (event: any) => {
        const results = event.results;
        let transcript = "";
        for (let i = event.resultIndex; i < results.length; i++) {
          transcript += results[i][0].transcript;
        }
        if (onResult) onResult(transcript);
      };
      rec.onend = () => {
        setListening(false);
        if (onEnd) onEnd();
      };
      rec.onerror = () => {
        setListening(false);
      };
      recognitionRef.current = rec;
    }
    return recognitionRef.current;
  }, [onEnd, onResult, supported]);

  const listen = useCallback((options?: { lang?: string; interimResults?: boolean; continuous?: boolean }) => {
    const rec = ensureInstance();
    if (!rec) return;
    rec.lang = options?.lang || "ru-RU";
    rec.interimResults = Boolean(options?.interimResults);
    rec.continuous = Boolean(options?.continuous);
    try {
      rec.start();
      setListening(true);
    } catch (_) {
      // ignore double-start errors
    }
  }, [ensureInstance]);

  const stop = useCallback(() => {
    const rec = ensureInstance();
    if (!rec) return;
    try {
      rec.stop();
    } catch (_) {
      // ignore
    }
  }, [ensureInstance]);

  return { listen, listening, stop, supported } as const;
}

type AvatarModelProps = {
  isTalking: boolean;
};

function AvatarModel({ isTalking }: AvatarModelProps) {
  const groupRef = useRef<any>(null);
  const { scene, animations } = useGLTF(AVATAR_URL);
  const { actions, mixer } = useAnimations(animations, groupRef);

  // Track meshes with morph targets for rough lipsync
  const morphMeshesRef = useRef<any[]>([]);
  const jawBoneRef = useRef<any>(null);
  const neckBoneRef = useRef<any>(null);
  const headBoneRef = useRef<any>(null);
  const eyeBonesRef = useRef<any[]>([]);
  // Access camera via state.gl in useFrame once; store ref for reuse
  const cameraRef = useRef<any>(null);
  const framedRef = useRef<boolean>(false);
  // Store initial transforms to avoid cumulative drift
  const baseNeckRotRef = useRef<any>(null);
  const baseHeadRotRef = useRef<any>(null);
  const baseNeckPosRef = useRef<any>(null);
  const baseEyeRotsRef = useRef<Array<{ bone: any; rot: any }>>([]);
  const headWorldRef = useRef<any>(new THREE.Vector3());

  useEffect(() => {
    morphMeshesRef.current = [];
    eyeBonesRef.current = [];
    scene.traverse((obj: any) => {
      const mesh = obj as any;
      if (mesh.isMesh && mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
        morphMeshesRef.current.push(mesh);
      }
      if ((obj as any).isBone && typeof (obj as any).name === "string") {
        const name = (obj as any).name.toLowerCase();
        if (!jawBoneRef.current && (name.includes("jaw") || name.includes("mandible"))) {
          jawBoneRef.current = obj;
        }
        if (!neckBoneRef.current && name.includes("neck")) {
          neckBoneRef.current = obj;
        }
        if (!headBoneRef.current && name.includes("head")) {
          headBoneRef.current = obj;
        }
        if (name.includes("eye")) {
          eyeBonesRef.current.push(obj);
        }
      }
    });
    if (import.meta.env.DEV) {
      const first = morphMeshesRef.current[0];
      const names = first?.morphTargetDictionary ? Object.keys(first.morphTargetDictionary) : [];
      // eslint-disable-next-line no-console
      console.log("[AIChat] Found morph targets:", names);
      // eslint-disable-next-line no-console
      console.log("[AIChat] Jaw bone detected:", Boolean(jawBoneRef.current), jawBoneRef.current?.name);
      console.log("[AIChat] Neck bone detected:", Boolean(neckBoneRef.current), neckBoneRef.current?.name);
      console.log("[AIChat] Head bone detected:", Boolean(headBoneRef.current), headBoneRef.current?.name);
      console.log("[AIChat] Eye bones detected:", eyeBonesRef.current.map(b => b.name));
    }
    // Capture base transforms after detection
    if (neckBoneRef.current && !baseNeckRotRef.current) baseNeckRotRef.current = neckBoneRef.current.rotation.clone();
    if (headBoneRef.current && !baseHeadRotRef.current) baseHeadRotRef.current = headBoneRef.current.rotation.clone();
    if (neckBoneRef.current && !baseNeckPosRef.current) baseNeckPosRef.current = neckBoneRef.current.position.clone();
    baseEyeRotsRef.current = eyeBonesRef.current.map(b => ({ bone: b, rot: b.rotation.clone() }));
  }, [scene]);

  // Camera framing will be applied once in the first frame

  // Attempt to play idle/talking animations if present
  useEffect(() => {
    const idle = actions?.["Idle"] || actions?.["idle"] || actions?.["Armature|Idle"];
    const talk = actions?.["Talking"] || actions?.["talking"] || actions?.["Armature|Talking"];
    if (!idle && !talk) return;

    if (idle) {
      idle.reset().fadeIn(0.2).play();
    }
    return () => {
      idle?.fadeOut(0.2);
      talk?.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    const talk = actions?.["Talking"] || actions?.["talking"] || actions?.["Armature|Talking"];
    const idle = actions?.["Idle"] || actions?.["idle"] || actions?.["Armature|Idle"];
    if (talk && idle) {
      if (isTalking) {
        idle.fadeOut(0.1);
        talk.reset().fadeIn(0.1).play();
      } else {
        talk.fadeOut(0.1);
        idle.reset().fadeIn(0.1).play();
      }
    }
  }, [actions, isTalking]);

  // Simple parametric lipsync if morph targets exist
  useFrame((state) => {
    // One-time auto-frame on first render frame (prevents SSR/window issues)
    if (!framedRef.current) {
      framedRef.current = true;
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      // Target the head area specifically
      const target = new THREE.Vector3();
      if (headBoneRef.current && headBoneRef.current.getWorldPosition) {
        headBoneRef.current.getWorldPosition(target);
      } else {
        // If no head bone, target upper portion of the model
        target.set(center.x, center.y + size.y * 0.3, center.z);
      }
      headWorldRef.current.copy(target);

      // Position camera to show head and shoulders
      const desiredVisibleHeight = size.y * 0.4; // Show more of the upper body
      const cam = state.camera as any;
      const fovRad = THREE.MathUtils.degToRad(cam.fov || 35);
      const dist = desiredVisibleHeight / (2 * Math.tan(fovRad / 2));

      // Position camera slightly above and in front of the head
      cam.position.set(target.x, target.y + size.y * 0.1, target.z + dist * 1.1);
      cam.near = Math.max(0.01, dist * 0.05);
      cam.far = dist * 20 + 10;
      cam.lookAt(target);
      cam.updateProjectionMatrix?.();
      cameraRef.current = cam;
    }
    const t = state.clock.getElapsedTime();
    // Richer lipsync pattern: blend a few frequencies for more natural mouth motion
    const talkBlend =
      0.60 * (0.5 + 0.5 * Math.sin(t * 12)) +
      0.25 * (0.5 + 0.5 * Math.sin(t * 7 + 0.7)) +
      0.15 * (0.5 + 0.5 * Math.sin(t * 20 + 1.3));
    const open = isTalking ? Math.max(0, Math.min(1, talkBlend)) : 0; // 0..1
    for (const mesh of morphMeshesRef.current) {
      const dict = mesh.morphTargetDictionary as Record<string, number> | undefined;
      const infl = mesh.morphTargetInfluences as number[] | undefined;
      if (!dict || !infl) continue;
      // Try common mouth/jaw/viseme blendshape names
      const keys = [
        // ARKit-like
        "jawOpen",
        "mouthOpen",
        "MouthOpen",
        // Visemes
        "viseme_aa",
        "viseme_A",
        "viseme_CH",
        "viseme_O",
        "viseme_U",
        // VRChat naming
        "vrc.v_aa",
        "vrc.v_oh",
        "vrc.v_uu",
      ];
      for (const k of keys) {
        const idx = dict[k];
        if (typeof idx === "number") infl[idx] = open;
      }

      // Blinking (if eyelid morphs exist)
      const blinkKeys = [
        "eyeBlinkLeft",
        "eyeBlinkRight",
        "EyeBlinkLeft",
        "EyeBlinkRight",
        "blink",
        "Blink",
        "vrc.blink",
      ];
      // Fast blink every ~3-6s
      const blinkPeriod = 3 + (Math.sin(t * 0.27) + 1) * 1.5; // 3..6s
      const blinkPhase = (t % blinkPeriod);
      let blinkAmount = 0;
      if (blinkPhase < 0.08) {
        blinkAmount = 1 - (blinkPhase / 0.08); // close quickly
      } else if (blinkPhase < 0.16) {
        blinkAmount = (blinkPhase - 0.08) / 0.12; // open back
        blinkAmount = 1 - blinkAmount;
      }
      blinkAmount = Math.max(0, Math.min(1, blinkAmount));
      for (const k of blinkKeys) {
        const idx = dict[k];
        if (typeof idx === "number") infl[idx] = blinkAmount;
      }
    }
    // Fallback: drive jaw bone rotation when morphs are not available
    if (jawBoneRef.current && morphMeshesRef.current.length === 0) {
      jawBoneRef.current.rotation.x = 0.18 * open;
    }

    // Subtle idle head/neck/eyes motion (more when talking)
    const neckAmp = isTalking ? 0.08 : 0.04;
    const headAmp = isTalking ? 0.06 : 0.03;
    const eyeYaw = (isTalking ? 0.08 : 0.04) * Math.sin(t * 0.8 + 0.3);
    const eyePitch = (isTalking ? 0.06 : 0.03) * Math.sin(t * 0.6 + 0.9);

    if (neckBoneRef.current && baseNeckRotRef.current) {
      neckBoneRef.current.rotation.y = baseNeckRotRef.current.y + neckAmp * Math.sin(t * 0.6);
      neckBoneRef.current.rotation.x = baseNeckRotRef.current.x + neckAmp * 0.6 * Math.sin(t * 0.4 + 1.2);
    }
    if (headBoneRef.current && baseHeadRotRef.current) {
      headBoneRef.current.rotation.y = baseHeadRotRef.current.y + headAmp * Math.sin(t * 0.8 + 0.5);
      headBoneRef.current.rotation.x = baseHeadRotRef.current.x + headAmp * 0.6 * Math.sin(t * 0.5 + 0.2);
      // Subtle head nod while speaking
      if (isTalking) headBoneRef.current.rotation.z = 0.015 * Math.sin(t * 3);
    }
    if (baseEyeRotsRef.current.length > 0) {
      for (const { bone, rot } of baseEyeRotsRef.current) {
        bone.rotation.y = rot.y + eyeYaw;
        bone.rotation.x = rot.x + eyePitch;
      }
    }
    // Subtle vertical breathing motion
    const breath = 0.01 * Math.sin(t * 1.2);
    if (neckBoneRef.current && baseNeckPosRef.current) {
      neckBoneRef.current.position.y = baseNeckPosRef.current.y + breath;
    }
    if (mixer) mixer.update(state.clock.getDelta());
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} position={[0, 0.2, 0]} scale={1.0} />
    </group>
  );
}

async function fetchOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("Не указан ключ OpenAI. Добавьте VITE_OPENAI_API_KEY в .env");
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || "";
}

const StudentAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isSpeaking, speak, stop, ttsProvider, ttsError } = useSpeech();
  const [autoSendOnMicStop, setAutoSendOnMicStop] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [mode, setMode] = useState<"quiz" | "explain" | "examples" | null>(null);
  const inputRef = useRef("");
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    document.title = "ИИ‑чат — Ученик | Ability School";
  }, []);

  const SUBJECTS = useMemo(
    () => [
      "Математика",
      "История",
      "Физика",
      "Химия",
      "Биология",
      "Литература",
      "География",
      "Информатика",
      "Английский язык",
    ],
    []
  );
  const SUBJECT_MODULES = useMemo<Record<string, string[]>>(
    () => ({
      Математика: ["Дроби", "Уравнения", "Геометрия", "Проценты"],
      История: ["Древний мир", "Средние века", "Новая история", "XX век"],
      Физика: ["Механика", "Термодинамика", "Оптика", "Электричество"],
      Химия: ["Атомы и молекулы", "Реакции", "Органика", "Растворы"],
      Биология: ["Клетка", "Гены", "Экология", "Анатомия"],
      Литература: ["Поэзия", "Проза", "Драматургия", "Анализ текста"],
      География: ["Материки", "Климат", "Население", "Ресурсы"],
      Информатика: ["Алгоритмы", "Структуры данных", "Базы данных", "Сети"],
      "Английский язык": ["Грамматика", "Словарный запас", "Чтение", "Разговорная речь"],
    }),
    []
  );

  const handleSendWithContent = useCallback(async (forced: string) => {
    const content = forced.trim();
    if (!content || loading) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      stop();
      const dynamicSystem = [
        "Ты эмпатичный школьный ассистент с глубокими знаниями. Отвечай понятно, дружелюбно и структурированно. При объяснении математики используй простой человеческий язык: пиши дроби как 15 / 3, степени описывай словами '2 в степени 3 = 8', корни как 'квадратный корень из 25 равен 5'. НЕ используй LaTeX, символы ^, \\frac{}, \\sqrt{} и другие математические коды.",
        "Всегда давай практические примеры и связи с реальной жизнью. Объясняй сложные концепции через простые аналогии.",
        "Используй активный голос, короткие предложения и конкретные примеры. Избегай абстрактных формулировок.",
        "Если ученик не понимает, предложи альтернативное объяснение или разбей сложную тему на более простые части.",
        "Приводи примеры из повседневной жизни, которые ученик может легко представить и понять.",
        selectedSubject ? `Сейчас ты выступаешь как эксперт-учитель по предмету: ${selectedSubject}.` : "",
        selectedModule ? `Тема урока: ${selectedModule}.` : "",
        mode === "explain"
          ? "Объясняй пошагово и очень кратко: давай только один небольшой пункт (микротему) за раз, потом жди команды 'Далее'. Не перегружай ответ. При объяснении математики используй простой человеческий язык: пиши дроби как 15 / 3, степени описывай словами '2 в степени 3 = 8', корни как 'квадратный корень из 25 равен 5'. НЕ используй LaTeX, символы ^, \\frac{}, \\sqrt{} и другие математические коды."
          : "",
        mode === "quiz"
          ? "Проводим мини‑тест. Задавай по ОДНОМУ вопросу за раз, с РОВНО 4 вариантами ответа в формате: a) ..., b) ..., c) ..., d) ... . Жди выбор. После выбора — дай краткий разбор и задай следующий вопрос. Не давай сразу все вопросы. При объяснении математики используй простой человеческий язык: пиши дроби как 15 / 3, степени описывай словами '2 в степени 3 = 8', корни как 'квадратный корень из 25 равен 5'. НЕ используй LaTeX, символы ^, \\frac{}, \\sqrt{} и другие математические коды."
          : "",
        mode === "examples"
          ? "Дай только ОДИН понятный пример за раз, потом жди команды 'Еще пример'. Не давай сразу много примеров. При объяснении математики используй простой человеческий язык: пиши дроби как 15 / 3, степени описывай словами '2 в степени 3 = 8', корни как 'квадратный корень из 25 равен 5'. НЕ используй LaTeX, символы ^, \\frac{}, \\sqrt{} и другие математические коды."
          : "",
      ]
        .filter(Boolean)
        .join(" ");
      const history = [
        { role: "system", content: dynamicSystem },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ];
      const replyRaw = await fetchOpenAI(history);
      const reply = replyRaw || "";
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMsg]);
      if (reply) speak(stripMarkdownForSpeech(reply));

      // Auto-scroll to bottom after new message
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, mode, selectedModule, selectedSubject, speak, stop]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || loading) return;
    await handleSendWithContent(content);
  }, [handleSendWithContent, input, loading]);

  // Speech recognition (microphone)
  // Continuous dictation without auto-stop until the user clicks again
  const { listen, listening, stop: stopListening, supported: sttSupported } = useSpeechRecognition({
    onResult: (result: string) => {
      // Append incremental results to preserve pauses and full utterance
      // Use transcript as-is to avoid duplication artifacts from interim results
      setInput(result);
    },
    onEnd: () => {
      // If user did not click stop (rare auto end), try to restart for uninterrupted dictation
      if (listening) {
        listen({ lang: "ru-RU", interimResults: true, continuous: true });
      } else if (autoSendOnMicStop && inputRef.current.trim()) {
        setTimeout(() => handleSend(), 50);
      }
    },
  });

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) return; // allow multiline in textarea if changed later
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const [subjectsOpen, setSubjectsOpen] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ИИ‑Помощник
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Персональный ассистент для изучения школьных предметов с голосовым взаимодействием и 3D аватаром
          </p>
        </div>

        {/* Main Layout - Chat Left (70%), 3D Avatar Right (30%) */}
        <div className="flex gap-6 h-[800px]">
          {/* Chat Section - Left Side (70%) */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Умный чат</h2>
              </div>

              {/* Subject Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Выберите предмет:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedSubject === s ? "secondary" : "ghost"}
                      onClick={() => {
                        setSelectedSubject(s);
                        setSelectedModule(null);
                      }}
                      className={`transition-all duration-200 ${selectedSubject === s
                        ? "bg-white/20 text-white border-white/30"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {s}
                    </Button>
                  ))}
                </div>

                {/* Module Selection */}
                {selectedSubject && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Тема урока:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_MODULES[selectedSubject]?.map((m) => (
                        <Button
                          key={m}
                          size="sm"
                          variant={selectedModule === m ? "secondary" : "ghost"}
                          onClick={() => setSelectedModule(m)}
                          className={`transition-all duration-200 ${selectedModule === m
                            ? "bg-white/20 text-white border-white/30"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                        >
                          {m}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 h-[500px] overflow-hidden flex flex-col">
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
              >
                {ttsError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 backdrop-blur-sm animate-in slide-in-from-top-2">
                    <span className="font-semibold">Ошибка TTS:</span> {ttsError}
                  </div>
                )}

                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                        <Bot className="w-12 h-12 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Добро пожаловать в ИИ‑чат!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Выберите предмет и тему, затем задайте вопрос. Ассистент ответит голосом и текстом.
                    </p>
                  </div>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {m.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-200 ${m.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gray-50 border border-gray-200"
                        }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {formatMessageContent(m.content)}
                      </div>
                    </div>
                    {m.role === "user" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">Я</span>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200/50">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={mode === "explain" ? "default" : "outline"}
                    className={`transition-all duration-200 ${mode === "explain"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      : "hover:bg-blue-50 hover:border-blue-300 text-gray-800"
                      }`}
                    onClick={() => {
                      setMode("explain");
                      const subj = selectedSubject || "любой предмет";
                      const topic = selectedModule ? ` по теме «${selectedModule}»` : "";
                      setInput(`Объясни с нуля${topic} в формате шагов. Дай только первый маленький пункт, затем подожди 'Далее'.`);
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Объясни тему
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === "examples" ? "default" : "outline"}
                    className={`transition-all duration-200 ${mode === "examples"
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      : "hover:bg-green-50 hover:border-green-300 text-gray-800"
                      }`}
                    onClick={() => {
                      setMode("examples");
                      const subj = selectedSubject || "предмет";
                      const topic = selectedModule ? ` по теме «${selectedModule}»` : "";
                      setInput(`Дай один понятный пример ${subj}${topic}.`);
                    }}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Дай примеры
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === "quiz" ? "default" : "outline"}
                    className={`transition-all duration-200 ${mode === "quiz"
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                      : "hover:bg-purple-50 hover:border-purple-300 text-gray-800"
                      }`}
                    onClick={() => {
                      setMode("quiz");
                      const subj = selectedSubject || "предмет";
                      const topic = selectedModule ? ` по теме «${selectedModule}»` : "";
                      setInput(`Запусти мини‑тест по ${subj}${topic}. Дай только первый вопрос с 4 вариантами ответа, затем жди мой выбор.`);
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Мини‑тест
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 text-gray-800"
                    onClick={() => setInput("Поясни предыдущий ответ проще, на конкретном примере и короче.")}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Не понял
                  </Button>

                  {/* Mode-specific buttons */}
                  {mode === "explain" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200"
                      onClick={() => handleSendWithContent("Далее")}
                    >
                      Далее
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                  {mode === "examples" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200"
                      onClick={() => handleSendWithContent("Еще пример")}
                    >
                      Еще пример
                      <Plus className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Quiz Choices */}
              {(() => {
                const last = [...messages].reverse().find((m) => m.role === "assistant");
                const lastContent = last?.content || "";
                const question = extractQuestion(lastContent);
                const opts = extractChoices(lastContent);
                if (opts.length >= 2) {
                  return (
                    <div className="mt-4 p-4 bg-yellow-50/80 rounded-xl border border-yellow-200/50 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300">
                      {question && (
                        <div className="text-sm font-semibold text-yellow-900 mb-3">
                          {question}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {opts.map((opt, idx) => (
                          <Button
                            key={`${opt}-${idx}`}
                            size="sm"
                            variant="outline"
                            className="bg-white hover:bg-yellow-50 border-yellow-300 text-yellow-800 hover:text-yellow-900 transition-all duration-200 hover:scale-105"
                            onClick={() => handleSendWithContent(`Ответ: ${opt}`)}
                          >
                            {String.fromCharCode(97 + idx)}) {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Input Section */}
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="flex-1 border-0 bg-gray-50 px-4 py-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                    placeholder="Спросите что‑нибудь…"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>

                  {/* Voice Controls */}
                  {sttSupported && (
                    <button
                      onClick={() => {
                        if (!listening) {
                          stop();
                          listen({ lang: "ru-RU", interimResults: true, continuous: true });
                        } else {
                          stopListening();
                        }
                      }}
                      className={`px-4 py-3 rounded-lg border transition-all duration-200 hover:scale-105 ${listening
                        ? "bg-red-600 text-white border-red-600 shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                        }`}
                      title={listening ? "Остановить запись" : "Говорить в микрофон"}
                    >
                      <span className="relative inline-flex items-center justify-center">
                        <span className={`rounded-full ${listening ? "bg-red-500" : "bg-gray-400"} w-3 h-3 mr-2`}></span>
                        <span className={`absolute inline-flex h-5 w-5 rounded-full ${listening ? "animate-ping bg-red-400" : ""}`}></span>
                      </span>
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={stop}
                    className="px-4 py-3 rounded-lg border bg-gray-100 hover:bg-gray-200 border-gray-300 transition-all duration-200 hover:scale-105"
                    title="Стоп озвучка"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </div>

                {/* Auto-send checkbox */}
                {sttSupported && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoSend"
                      checked={autoSendOnMicStop}
                      onChange={(e) => setAutoSendOnMicStop(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="autoSend" className="text-sm text-gray-600">
                      Авто‑отправка после записи
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3D Avatar Section - Right Side (30%) */}
          <div className="w-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden relative group">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="h-full relative z-10">
              <Canvas camera={{ fov: 35 }}>
                <color attach="background" args={["transparent"] as any} />
                <hemisphereLight intensity={0.6} groundColor={new THREE.Color("#777")} />
                <directionalLight position={[1.5, 3.5, 2]} intensity={1.2} />
                <AvatarModel isTalking={isSpeaking} />
              </Canvas>

              {/* Avatar Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-105">
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'pulse-glow' : ''}`}>
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">ИИ‑Ассистент</h3>
                  <p className="text-sm text-gray-600">
                    {isSpeaking ? "Говорит..." : "Готов помочь"}
                  </p>
                  {ttsProvider && (
                    <div className="mt-2 text-xs text-gray-500">
                      TTS: {ttsProvider}
                    </div>
                  )}

                  {/* Status indicator */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    <span className="text-xs text-gray-500">
                      {isSpeaking ? 'Активен' : 'Онлайн'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={stop}
                  className="p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full border border-gray-200/50 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                  title="Остановить озвучку"
                >
                  <Square className="w-4 h-4 text-gray-600" />
                </button>
                {sttSupported && (
                  <button
                    onClick={() => {
                      if (!listening) {
                        stop();
                        listen({ lang: "ru-RU", interimResults: true, continuous: true });
                      } else {
                        stopListening();
                      }
                    }}
                    className={`p-2 backdrop-blur-sm rounded-full border shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl ${listening
                      ? "bg-red-500/80 text-white border-red-500/50"
                      : "bg-white/80 hover:bg-white border-gray-200/50"
                      }`}
                    title={listening ? "Остановить запись" : "Говорить в микрофон"}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {!OPENAI_API_KEY && (
            <p className="text-red-500 mb-2">
              ⚠️ Внимание: не найден VITE_OPENAI_API_KEY. Добавьте ключ в `.env` файл.
            </p>
          )}
          {!sttSupported && (
            <p className="text-gray-500">
              🎤 Голосовой ввод не поддерживается в вашем браузере. Рекомендуется Chrome.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

useGLTF.preload(AVATAR_URL);

export default StudentAIChat;
