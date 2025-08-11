import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  useEffect(() => {
    document.title = "Личный кабинет — Ученик | Ability School";
  }, []);

  return (
    <main className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Добро пожаловать, Ученик</h1>
        <p className="text-muted-foreground">Ваше расписание, задания и виртуальный класс</p>
      </header>
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Расписание на сегодня</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>09:00 — Математика (Виртуальный класс)</li>
              <li>11:00 — Английский язык</li>
              <li>14:00 — Информатика</li>
            </ul>
            <Button className="mt-4" variant="hero">Перейти в класс</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Домашние задания</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>Математика — до завтра</div>
            <div>Английский — до пятницы</div>
            <div>Информатика — до понедельника</div>
          </CardContent>
        </Card>
      </section>
      <section className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader><CardTitle>Чат с ИИ‑помощником</CardTitle></CardHeader>
          <CardContent>
            <div className="h-40 border rounded-md p-3 text-sm text-muted-foreground">Сообщения будут здесь…</div>
            <div className="flex gap-2 mt-3">
              <input className="flex-1 border rounded-md px-3 py-2 bg-background" placeholder="Спросите что‑нибудь…" />
              <Button>Отправить</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Достижения</CardTitle></CardHeader>
          <CardContent className="text-sm">Баллы: 120 • Последнее достижение: «Мастер дробей»</CardContent>
        </Card>
      </section>
    </main>
  );
};

export default StudentDashboard;
