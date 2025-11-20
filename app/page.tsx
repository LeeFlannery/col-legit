import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Col-Legit</h1>
          <nav className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight">
            College apps, but make it a game
          </h2>
          <p className="mb-8 max-w-2xl text-xl text-slate-600">
            Track your college applications with XP, streaks, and achievements.
            Turn the grind into progress you can see and celebrate.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-24 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Track Everything</CardTitle>
              <CardDescription>
                Manage colleges, deadlines, essays, and tasks all in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Keep all your application requirements organized with a simple,
                visual tracker that shows exactly what needs to be done.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earn XP & Level Up</CardTitle>
              <CardDescription>
                Every task completed gets you closer to the next level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Complete tasks, hit milestones, and watch your XP grow. Progress
                bars make the journey feel rewarding, not overwhelming.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Build Your Streak</CardTitle>
              <CardDescription>
                Stay consistent with daily progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Work on your applications every day and build a streak. No
                punishment for missing days—just encouragement to keep going.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="mx-auto max-w-2xl border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-3xl">
                Ready to level up your college apps?
              </CardTitle>
              <CardDescription className="text-base">
                Join students who are making progress, one task at a time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link href="/signup">Start Your Journey</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>
            &copy; 2024 Col-Legit. Making college applications less stressful.
          </p>
        </div>
      </footer>
    </div>
  );
}
