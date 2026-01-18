import { ChatAssistant } from "@/components/ChatAssistant";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-64px)] p-4 md:p-6 bg-muted/20">
      <div className="max-w-4xl mx-auto h-full">
        <ChatAssistant className="h-full" />
      </div>
    </div>
  );
}
