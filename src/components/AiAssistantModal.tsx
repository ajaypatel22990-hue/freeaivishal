import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, X, Loader2, Volume2, VolumeX, Mic, MicOff, Radio, Play, Pause, Headphones, Check } from 'lucide-react';
import { useToast } from './Toast';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; text: string }>>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: 'नमस्ते! मैं फ्री एआई विशाल कंपनी का आधिकारिक वॉइस चैट सहायक (Vishal Voice Copilot) हूँ। माइक दबाकर बोलें या किसी भी उत्तर के नीचे स्पीकर आइकन दबाकर आवाज़ सुनें!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load and refresh speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, [isOpen]);

  const speakText = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('आपके ब्राउज़र में वॉइस स्पीच (Text-to-Speech) उपलब्ध नहीं है।', 'info');
      return;
    }

    // If currently speaking this specific message, pause/stop it
    if (isSpeaking && activeSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Strip markdown asterisks, hashes, backticks for clean speech
      const cleanText = text
        .replace(/[*#_~`>]/g, '')
        .replace(/\(http[s]?:\/\/[^\)]*\)/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      activeUtteranceRef.current = utterance;

      // Select best Hindi or Indian voice available in browser
      const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      let bestVoice = availableVoices.find(
        (v) => v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')
      );
      if (!bestVoice) {
        bestVoice = availableVoices.find(
          (v) => v.lang.includes('IN') || v.name.includes('India') || v.lang.startsWith('en-IN')
        );
      }
      if (!bestVoice && availableVoices.length > 0) {
        bestVoice = availableVoices.find((v) => v.default) || availableVoices[0];
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = 'hi-IN';
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (msgId) setActiveSpeakingId(msgId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveSpeakingId(null);
        activeUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        setActiveSpeakingId(null);
        activeUtteranceRef.current = null;
      };

      // Slight delay to ensure previous speech cancellation clears completely
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error(err);
          setIsSpeaking(false);
          setActiveSpeakingId(null);
        }
      }, 60);

    } catch (err) {
      console.error('Speech error:', err);
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('आपका ब्राउज़र वॉइस रिकग्निशन का समर्थन नहीं करता है। कृपया टाइप करें।', 'info');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'hi-IN';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let currentTranscript = '';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const activeText = currentTranscript || interim;
        if (activeText) {
          setInput(activeText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showToast('कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति (Microphone Permission) दें।', 'error');
        } else if (event.error === 'no-speech') {
          showToast('कोई आवाज़ सुनाई नहीं दी। कृपया माइक के पास बोलें।', 'info');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalQuery = currentTranscript || input.trim();
        if (finalQuery) {
          handleSend(undefined, finalQuery);
        }
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userMsg = (customText !== undefined ? customText : input).trim();
    if (!userMsg || loading) return;

    setInput('');
    const newUserId = 'msg-' + Date.now();
    setMessages((prev) => [...prev, { id: newUserId, role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          systemInstruction: 'You are the intelligent corporate voice assistant for Free AI Vishal Company (फ्री एआई विशाल कंपनी, CEO: विशाल पटेल). Provide helpful, professional, and clear answers in Hindi. Keep answers conversational, warm, and natural for voice chat.',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.error 
        ? `नोट: ${data.error}` 
        : (data.text || 'नमस्ते! फ्री एआई विशाल कंपनी में आपका स्वागत है।');

      const assistantMsgId = 'msg-' + Date.now() + '-reply';
      setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', text: replyText }]);
      
      if (isVoiceEnabled) {
        speakText(replyText, assistantMsgId);
      }
    } catch (err: any) {
      const fallbackReplies = [
        `फ्री एआई विशाल कंपनी एआई सहायक: आपकी बात नोट कर ली गई है। हमारी मुख्य वेबसाइट्स पूरी तरह सक्रिय हैं।`,
        `नमस्ते! फ्री एआई विशाल कंपनी में आपका स्वागत है। आप एडमिन पैनल के जरिए एम्प्लॉई और वेबसाइट्स मैनेज कर सकते हैं।`,
        `अत्यंत उत्तम प्रश्न! फ्री एआई विशाल कंपनी तकनीक और एआई समाधानों में अग्रणी है।`
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      const assistantMsgId = 'msg-' + Date.now() + '-fallback';
      setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', text: randomReply }]);
      if (isVoiceEnabled) {
        speakText(randomReply, assistantMsgId);
      }
    } finally {
      setLoading(false);
    }
  };

  const quickVoicePrompts = [
    '🎤 कंपनी के बारे में बताओ',
    '🌐 वेबसाइट्स दिखाओ',
    '👥 एम्प्लॉई लिस्ट दिखाओ',
    '👑 CEO विशाल पटेल कौन हैं?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 rounded-3xl max-w-2xl w-full h-[680px] flex flex-col overflow-hidden shadow-2xl border border-indigo-500/30 text-white animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-amber-300 shadow-lg shadow-indigo-500/40 relative ${isSpeaking ? 'ring-4 ring-emerald-400/60 animate-pulse' : ''}`}>
              <Headphones className="w-6 h-6" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                <span>विशाल एआई वॉइस चैट रूम</span>
                {isSpeaking && (
                  <span className="text-[10px] bg-emerald-500/30 border border-emerald-400/40 px-2.5 py-0.5 rounded-full text-emerald-200 flex items-center gap-1.5 font-bold animate-pulse">
                    <Radio className="w-3 h-3 animate-spin text-emerald-400" /> आवाज़ चालू है...
                  </span>
                )}
                {isListening && (
                  <span className="text-[10px] bg-red-500/30 border border-red-400/40 px-2 py-0.5 rounded-full text-red-200 flex items-center gap-1 font-bold">
                    <Mic className="w-3 h-3 animate-bounce text-red-400" /> सुन रहा हूँ... बोलिए
                  </span>
                )}
              </h2>
              <p className="text-xs text-indigo-300">फ्री एआई विशाल कंपनी • लाइव टेक्स्ट-टू-स्पीच सक्रिय</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextState = !isVoiceEnabled;
                setIsVoiceEnabled(nextState);
                if (!nextState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setActiveSpeakingId(null);
                }
                showToast(nextState ? 'ऑटो वॉइस आउटपुट चालू किया गया' : 'ऑटो वॉइस आउटपुट बंद किया गया', 'info');
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md ${isVoiceEnabled ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-white/10 text-slate-400'}`}
              title={isVoiceEnabled ? 'ऑटो-वॉइस चालू है' : 'ऑटो-वॉइस बंद है'}
            >
              {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Immersive Audio Waveform Visualizer */}
        <div className="bg-indigo-950/60 py-3 px-4 border-b border-indigo-500/20 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-1.5 h-8">
            {[40, 70, 90, 60, 100, 80, 50, 85, 95, 65, 45].map((height, idx) => (
              <span
                key={idx}
                style={{ height: (isSpeaking || isListening) ? `${Math.max(25, (idx * 17) % 100)}%` : '25%' }}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeaking 
                    ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse' 
                    : isListening 
                    ? 'bg-red-400 shadow-[0_0_10px_#f87171] animate-bounce' 
                    : 'bg-indigo-500/50'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-indigo-200 font-medium text-center">
            {isListening ? '🎤 माइक ऑन है, बोलिए... आपकी आवाज़ सुनी जा रही है' : isSpeaking ? '🔊 एआई बोल रहा है... नीचे दिए स्पीकर बटन से दोबारा भी सुन सकते हैं' : '✨ किसी भी उत्तर के नीचे "स्पीकर आइकन (🔊)" दबाकर तुरंत आवाज़ सुनें'}
          </p>
        </div>

        {/* Quick Voice Prompts */}
        <div className="bg-slate-900/40 px-4 py-2 border-b border-indigo-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-indigo-300 shrink-0">बोलकर पूछें:</span>
          {quickVoicePrompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(undefined, promptText.replace(/^[^\s]+\s/, ''))}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600/50 border border-white/10 text-indigo-100 text-xs font-semibold shrink-0 transition-all shadow-sm flex items-center gap-1"
            >
              <span>{promptText}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/50">
          {messages.map((msg) => {
            const isThisSpeaking = isSpeaking && activeSpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="space-y-1.5 max-w-[82%]">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900/90 text-indigo-50 border border-indigo-500/20 shadow-lg rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 pl-1">
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
                          isThisSpeaking
                            ? 'bg-emerald-500 text-white ring-2 ring-emerald-400/50 shadow-emerald-500/30 animate-pulse'
                            : 'bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 border border-indigo-500/30'
                        }`}
                        title="आवाज़ में सुनें"
                      >
                        <Volume2 className={`w-4 h-4 ${isThisSpeaking ? 'animate-bounce text-white' : 'text-indigo-300'}`} />
                        <span>{isThisSpeaking ? 'बोल रहा है... (रुकने के लिए क्लिक करें)' : 'स्पीकर से सुनें (Play Voice)'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-500/30 text-indigo-200 text-sm flex items-center gap-3 shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="font-medium">एआई सोच रहा है और जवाब तैयार कर रहा है...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Voice Controls */}
        <div className="p-4 bg-slate-900/90 border-t border-indigo-500/20 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSpeechRecognition}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-lg ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 scale-105 ring-4 ring-red-400/40'
                : 'bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/30'
            }`}
            title={isListening ? 'सुन रहा है... बोलिए' : 'बोलकर बात करने के लिए माइक दबाएं'}
          >
            {isListening ? <MicOff className="w-6 h-6 animate-bounce" /> : <Mic className="w-6 h-6" />}
          </button>

          <form onSubmit={handleSend} className="flex-1 flex items-center gap-3">
            <input
              type="text"
              placeholder={isListening ? "🎤 सुन रहा हूँ... बोलिए..." : "माइक दबाकर बोलें या यहाँ प्रश्न लिखें..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-2xl border border-indigo-500/30 bg-slate-950/80 text-sm focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-medium placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 shrink-0"
            >
              <span>भेजें</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
