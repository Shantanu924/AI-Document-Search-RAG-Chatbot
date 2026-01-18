import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive font-bold text-xl items-center">
            <AlertCircle className="w-6 h-6" />
            <h1>404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-muted-foreground text-sm leading-relaxed mb-6">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>

          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
