import { usePosts, useDeletePost } from "@/hooks/use-posts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MoreVertical, Edit, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: posts, isLoading } = usePosts();
  const { mutate: deletePost } = useDeletePost();

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">My Posts</h1>
          <p className="text-muted-foreground mt-1">Manage and edit your blog content</p>
        </div>
        <Link href="/editor">
          <Button className="h-12 px-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Plus className="w-5 h-5 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {posts?.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold font-display mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-6">Start writing your first blog post today.</p>
          <Link href="/editor">
            <Button variant="outline">Write a Post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-card hover:bg-card/50 border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[300px]"
            >
              {/* Card Header */}
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    post.isPublished 
                      ? "bg-green-500/10 text-green-600 border-green-500/20" 
                      : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  }`}>
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/editor/${post.id}`}>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={`/editor/${post.id}`} className="block group-hover:text-primary transition-colors">
                  <h3 className="text-xl font-bold font-display mb-3 line-clamp-2">{post.title}</h3>
                </Link>
                <div 
                  className="text-muted-foreground text-sm line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Just now'}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
