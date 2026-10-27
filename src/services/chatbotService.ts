import publicAxios from "@/lib/publicAxios";
export const geminiService = {
  callChat: (questionContent: string) => {
    return publicAxios.post("/chatbot/chat", {
      question: questionContent,
    });
  },
};
