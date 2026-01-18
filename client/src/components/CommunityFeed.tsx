import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
}

const DEMO_POSTS: Post[] = [
  {
    id: 1,
    title: "The Future of AI in 2026",
    content: "AI is evolving faster than ever. From multimodal models to agentic workflows, the landscape is shifting daily...",
    author: "Jane Doe",
    likes: 124,
    dislikes: 12,
    comments: 45,
    shares: 89
  },
  {
    id: 2,
    title: "10 Tips for Better Blogging",
    content: "Consistency is key, but so is understanding your audience. Here are my top 10 tips for growing your blog...",
    author: "John Smith",
    likes: 89,
    dislikes: 5,
    comments: 23,
    shares: 12
  }
];

export function CommunityFeed() {
  const [posts, setPosts] = useState(DEMO_POSTS);

  const handleAction = (id: number, type: 'likes' | 'dislikes' | 'shares') => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, [type]: post[type] + 1 } : post
    ));
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden border-border/50 hover-elevate">
          <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{post.author}</span>
              <span className="text-xs text-muted-foreground">Community Member</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <h3 className="text-xl font-bold font-display mb-2">{post.title}</h3>
            <p className="text-muted-foreground line-clamp-3 leading-relaxed">{post.content}</p>
          </CardContent>
          <CardFooter className="p-4 border-t border-border/50 bg-muted/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-muted-foreground hover:text-primary"
                onClick={() => handleAction(post.id, 'likes')}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-muted-foreground hover:text-destructive"
                onClick={() => handleAction(post.id, 'dislikes')}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{post.dislikes}</span>
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-muted-foreground"
                onClick={() => handleAction(post.id, 'shares')}
              >
                <Share2 className="h-4 w-4" />
                <span>{post.shares}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
