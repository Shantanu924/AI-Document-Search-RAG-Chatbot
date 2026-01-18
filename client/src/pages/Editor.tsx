import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { usePost, useCreatePost, useUpdatePost, useGeneratePost } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/components/TiptapEditor";
import { ChatAssistant } from "@/components/ChatAssistant";
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  PanelRightOpen, 
  PanelRightClose,
  Loader2
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const isNew = !id;
  const postId = id ? parseInt(id) : 0;

  const { data: post, isLoading } = usePost(postId);
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: generatePost, isPending: isGenerating } = useGeneratePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [showChat, setShowChat] = useState(true);

  // Generate Dialog State
  const [genTopic, setGenTopic] = useState("");
  const [genTone, setGenTone] = useState("Professional");
  const [isGenDialogOpen, setIsGenDialogOpen] = useState(false);

  // Load existing data
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setIsPublished(post.isPublished || false);
    }
  }, [post]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "Validation Error", description: "Title is required", variant: "destructive" });
      return;
    }

    if (isNew) {
      createPost(
        { title, content, isPublished },
        { onSuccess: (newPost) => setLocation(`/editor/${newPost.id}`) }
      );
    } else {
      updatePost({ id: postId, title, content, isPublished });
    }
  };

  const handleGenerate = () => {
    generatePost(
      { topic: genTopic, tone: genTone },
      {
        onSuccess: (data) => {
          setTitle(data.title);
          setContent(data.content); // Tiptap will sync
          setIsGenDialogOpen(false);
          toast({ title: "Magic!", description: "Content generated successfully." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to generate content.", variant: "destructive" });
        }
      }
    );
  };

  if (isLoading && !isNew) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Toolbar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={isPublished ? "text-green-500 font-medium" : "text-yellow-500 font-medium"}>
                {isPublished ? "Published" : "Draft"}
              </span>
              <span>•</span>
              <span>{isNew ? "Unsaved" : "Saved"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <Switch 
                checked={isPublished} 
                onCheckedChange={setIsPublished} 
                id="publish-mode"
              />
              <Label htmlFor="publish-mode" className="cursor-pointer">Publish</Label>
            </div>

            <Dialog open={isGenDialogOpen} onOpenChange={setIsGenDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input 
                      placeholder="e.g., The Future of AI in Healthcare" 
                      value={genTopic}
                      onChange={(e) => setGenTopic(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Input 
                      placeholder="e.g., Professional, Witty, Casual" 
                      value={genTone}
                      onChange={(e) => setGenTone(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleGenerate} disabled={isGenerating || !genTopic}>
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate Draft
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setShowChat(!showChat)} className="md:hidden">
              {showChat ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              className="text-4xl font-bold font-display border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto py-2"
            />
            <TiptapEditor 
              content={content} 
              onChange={setContent} 
            />
          </div>
        </div>
      </div>

      {/* Sidebar Chat - Collapsible */}
      <div 
        className={`
          fixed inset-y-0 right-0 w-80 bg-background border-l border-border transform transition-transform duration-300 z-20
          md:relative md:translate-x-0
          ${showChat ? "translate-x-0" : "translate-x-full md:hidden"}
        `}
      >
        <ChatAssistant className="h-full border-0 rounded-none shadow-none" />
      </div>
    </div>
  );
}
