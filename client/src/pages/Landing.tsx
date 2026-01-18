import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, PenTool, BrainCircuit, Rocket } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold font-display tracking-tight text-primary">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <Sparkles className="w-6 h-6" />
          </div>
          InkFlow AI
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/api/login'}
          className="rounded-full px-6 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              AI-Powered Blogging Assistant
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.1] mb-6">
              Write better blogs,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                faster than ever.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock your creativity with an AI assistant that understands your tone. 
              Draft, edit, and perfect your content in one beautiful workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'}
                className="h-14 px-8 rounded-full text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
              >
                Start Writing for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 rounded-full text-lg font-semibold border-2 hover:bg-muted/50"
              >
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: BrainCircuit,
              title: "AI Brainstorming",
              desc: "Never run out of ideas. Chat with our AI to generate topics, outlines, and fresh perspectives."
            },
            {
              icon: PenTool,
              title: "Smart Editor",
              desc: "A distraction-free writing environment enhanced with AI auto-completion and formatting tools."
            },
            {
              icon: Rocket,
              title: "Instant Drafts",
              desc: "Turn a simple topic into a comprehensive first draft in seconds. Just review and publish."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
              className="p-8 rounded-3xl bg-white/50 dark:bg-card/50 border border-white/20 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
