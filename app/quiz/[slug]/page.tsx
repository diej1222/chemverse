"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import quizData from "@/data/quiz.json";
import { type Quiz, type QuizQuestion, type QuizAttempt } from "@/types/quiz";
import { saveAttempt, percentage } from "@/lib/quiz-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(
  questions: QuizQuestion[],
  randomise: boolean,
): QuizQuestion[] {
  if (!randomise) return questions;
  return shuffleArray(questions).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────
const ALL_QUIZZES = quizData as Quiz[];

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-chart-5/20 text-chart-5 border-chart-5/40",
  medium: "bg-chart-4/20 text-chart-4 border-chart-4/40",
  hard: "bg-destructive/15 text-destructive border-destructive/30",
};

type State = "idle" | "answering" | "finished";

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function QuizSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const quiz = ALL_QUIZZES.find((q) => q.slug === slug) ?? null;

  const [state, setState] = useState<State>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAttempt["answers"]>([]);

  // Redirect if slug is invalid
  useEffect(() => {
    if (!quiz) router.replace("/quiz");
  }, [quiz, router]);

  if (!quiz) return null;

  // ── Derived (safe — quiz is defined here) ──
  const question = questions[current] ?? quiz.questions[current];
  const total = questions.length || quiz.questions.length;
  const isLast = current === total - 1;
  const score = answers.filter((a) => a.isCorrect).length;
  const pct = percentage(score, total);

  // ── Handlers ──
  function startQuiz(randomise: boolean) {
    setQuestions(buildQuestions(quiz!.questions, randomise));
    setCurrent(0);
    setChosen(null);
    setAnswered(false);
    setAnswers([]);
    setState("answering");
  }

  function handleChoose(option: string) {
    if (answered || !question) return;
    setChosen(option);
    setAnswered(true);
    setAnswers((prev) => [
      ...prev,
      {
        question: question.question,
        chosen: option,
        correct: question.answer,
        isCorrect: option === question.answer,
      },
    ]);
  }

  function handleNext() {
    if (!quiz) return;
    if (isLast) {
      const attempt: QuizAttempt = {
        slug: quiz.slug,
        title: quiz.title,
        difficulty: quiz.difficulty,
        score: answers.filter((a) => a.isCorrect).length,
        total,
        completedAt: new Date().toISOString(),
        answers,
      };
      saveAttempt(attempt);
      setState("finished");
    } else {
      setCurrent((c) => c + 1);
      setChosen(null);
      setAnswered(false);
    }
  }

  // ── Idle ──
  if (state === "idle") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-5">
          <Link
            href="/quiz"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to quizzes
          </Link>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-foreground">
                {quiz.title}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize shrink-0",
                  DIFFICULTY_STYLES[quiz.difficulty],
                )}
              >
                {quiz.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{quiz.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{quiz.questions.length} questions</span>
              <span>{quiz.category}</span>
            </div>
            {/* randomise = true on first start */}
            <Button className="w-full" onClick={() => startQuiz(true)}>
              Start quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Finished ──
  if (state === "finished") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-5">
          {/* Score */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
              Result
            </p>
            <p className="text-5xl font-bold text-foreground">{pct}%</p>
            <p className="text-muted-foreground text-sm">
              {score} / {total} correct
            </p>
            <Progress value={pct} className="h-2" />
          </div>

          {/* Answer review */}
          <div className="space-y-2">
            {answers.map((a, i) => {
              // explanation lookup by question text — index-safe
              const explanation = quiz.questions.find(
                (q) => q.question === a.question,
              )?.explanation;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl border p-3 text-sm space-y-1",
                    a.isCorrect
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {a.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <p className="text-foreground font-medium leading-snug">
                      {a.question}
                    </p>
                  </div>
                  {!a.isCorrect && (
                    <p className="text-xs text-muted-foreground pl-6">
                      Your answer:{" "}
                      <span className="text-destructive">{a.chosen}</span>
                      {" · "}Correct:{" "}
                      <span className="text-green-600 dark:text-green-400">
                        {a.correct}
                      </span>
                    </p>
                  )}
                  {explanation && (
                    <p className="text-xs text-muted-foreground pl-6 italic">
                      {explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => startQuiz(false)} // retry = original order
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/quiz/results">See all results</Link>
            </Button>
          </div>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/quiz">← Back to quizzes</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Answering ──
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-4">
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{quiz.title}</span>
            <span>
              {current + 1} / {total}
            </span>
          </div>
          <Progress
            value={((current + (answered ? 1 : 0)) / total) * 100}
            className="h-1.5"
          />
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
          <p className="text-base sm:text-lg font-semibold text-foreground leading-snug">
            {question.question}
          </p>

          <div className="grid gap-2">
            {question.options.map((option) => {
              const isChosen = chosen === option;
              const isCorrect = option === question.answer;

              let optionClass =
                "border-border hover:border-primary/50 hover:bg-muted";
              if (answered) {
                if (isCorrect) {
                  optionClass =
                    "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                } else if (isChosen && !isCorrect) {
                  optionClass =
                    "border-destructive bg-destructive/10 text-destructive";
                } else {
                  optionClass = "border-border opacity-50";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleChoose(option)}
                  disabled={answered}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border text-sm",
                    "transition-all duration-150 flex items-center justify-between gap-2",
                    !answered && "cursor-pointer",
                    optionClass,
                  )}
                >
                  <span>{option}</span>
                  {answered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                  )}
                  {answered && isChosen && !isCorrect && (
                    <XCircle className="w-4 h-4 shrink-0 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-200">
              <span className="font-medium text-foreground">Explanation: </span>
              {question.explanation}
            </div>
          )}
        </div>

        {answered && (
          <Button
            className="w-full gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200"
            onClick={handleNext}
          >
            {isLast ? "Finish quiz" : "Next question"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
