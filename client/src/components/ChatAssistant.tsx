import { useState, useRef, useEffect } from "react";
import { useConversations, useCreateConversation, useConversationMessages, useChatStream } from "@/hooks/use-chat-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, MessageSquarePlus, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function ChatAssistant({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: loadingConvos } = useConversations();
  const { mutate: createConvo, isPending: creatingConvo } = useCreateConversation();
  
  // Auto-select first conversation
  useEffect(() => {
    if (!activeId && conversations?.length) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const { data: history } = useConversationMessages(activeId);
  const { localMessages, streamingContent, isStreaming, sendMessage } = useChatStream(activeId);

  // Combine history + local optimistic updates
  const displayMessages = [
    ...(history || []),
    ...localMessages
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages, streamingContent]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    if (!activeId) {
      // Create conversation first if none active
      createConvo("New Chat", {
        onSuccess: (newConvo) => {
          setActiveId(newConvo.id);
          // Wait a tick for state update then send
          setTimeout(() => sendMessage(inputValue), 100);
          setInputValue("");
        }
      });
    } else {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border border-border shadow-lg rounded-2xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold font-display">AI Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => createConvo("New Chat", { onSuccess: (c) => setActiveId(c.id) })}
          disabled={creatingConvo}
        >
          <MessageSquarePlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {(!activeId && !loadingConvos) ? (
             <div className="text-center text-muted-foreground py-10">
               <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" />
               <p>Start a new conversation to get help with your writing.</p>
             </div>
          ) : (
            displayMessages.map((msg, i) => (
              <div 
                key={msg.id || i} 
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  msg.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted text-foreground rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {/* Streaming Bubble */}
          {isStreaming && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-muted text-foreground rounded-tl-none text-sm leading-relaxed">
                {streamingContent}
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background">
        <div className="relative">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI for ideas..."
            className="pr-12 py-6 rounded-xl border-border/50 focus:border-primary/50 shadow-sm"
            disabled={isStreaming}
          />
          <Button 
            size="icon" 
            className="absolute right-1 top-1 h-10 w-10 rounded-lg"
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
