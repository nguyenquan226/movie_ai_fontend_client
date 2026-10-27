"use client";

import { useEffect, useState, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Mic, MicOff } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function VoiceSearch({
  onResult,
}: {
  onResult: (text: string) => void;
}) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const [open, setOpen] = useState(false);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Khi bắt đầu nghe
  const startListening = () => {
    resetTranscript();
    setOpen(true);

    SpeechRecognition.startListening({
      continuous: true,
      language: "vi-VN",
    });
  };

  // Khi dừng nghe
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setOpen(false);

    if (transcript.trim() !== "") {
      onResult(transcript.trim());
    }

    resetTranscript();
  }, [transcript]);

  // Auto-stop nếu người dùng ngừng nói > 1.5s
  useEffect(() => {
    if (!listening) return;

    if (silenceTimeout) clearTimeout(silenceTimeout);

    const timeout = setTimeout(() => {
      stopListening();
    }, 2000);

    setSilenceTimeout(timeout);
  }, [transcript, listening]);

  return (
    <>
      {/* Nút icon micro */}
      <button
        onClick={startListening}
        className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
      >
        <Mic className="w-6 h-6 text-foreground" />
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={stopListening}>
        <DialogContent className="bg-secondary text-foreground border-none max-w-sm text-center">
          <div className="flex flex-col items-center space-y-4 py-6">
            {/* Hiệu ứng micro */}
            <div className="relative">
              {/* vòng ping ngoài */}
              {listening && (
                <div className="absolute inset-0 rounded-full bg-red-500 opacity-40 animate-ping"></div>
              )}

              {/* icon micro */}
              <div className="p-5 rounded-full bg-red-600 relative z-10">
                {listening ? (
                  <Mic className="w-10 h-10" />
                ) : (
                  <MicOff className="w-10 h-10" />
                )}
              </div>
            </div>

            {/* dòng text */}
            <p className="text-lg text-muted-foreground">
              {transcript !== ""
                ? transcript
                : "Đang nghe... hãy nói điều gì đó"}
            </p>

            {/* trạng thái */}
            <span className="text-sm text-muted-foreground/70">
              {listening ? "Đang ghi âm..." : "Đã dừng"}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
