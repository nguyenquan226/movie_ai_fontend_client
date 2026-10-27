"use client";

import { useFilmRouter } from "@/hooks/filmRouter";

interface SmartFilmTextProps {
  text: string;
}

export function SmartFilmText({ text }: SmartFilmTextProps) {
  const { goFilmDetail } = useFilmRouter();
  const filmUrlRegex = /https?:\/\/[^\s]*\/film-detail\/([a-zA-Z0-9-_]+)/g;

  const lines = text.split("\n");

  return (
    <div className="whitespace-pre-wrap space-y-2">
      {lines.map((line, idx) => {
        const match = filmUrlRegex.exec(line);

        filmUrlRegex.lastIndex = 0;

        if (!match) {
          return <div key={idx}>{line}</div>;
        }

        // Nếu có → extract slug
        const slug = match[1];

        return (
          <div key={idx} className="flex items-center gap-2">
            <span>{line.replace(match[0], "").trim()}</span>

            <button
              onClick={() => {
                goFilmDetail(slug);
              }}
              className="
                px-3 py-1 rounded-lg
                text-black bg-gradient-to-r from-yellow-300 to-yellow-500
                hover:from-yellow-400 hover:to-yellow-200 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] text-sm font-semibold
                hover:scale-[1.03] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 cursor-pointer
              "
            >
              Xem ngay
            </button>
          </div>
        );
      })}
    </div>
  );
}
