import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
  useEffect(() => {
    document.title = "Личный кабинет — Учитель | Ability School";
  }, []);

  return (
    <main className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Здравствуйте, Учитель</h1>
        <p className="text-muted-foreground">Классы, задания и общение</p>
      </header>
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Мои классы</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>5А — 28 учеников</div>
            <div>6Б — 26 учеников</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Добавить задание</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <input className="w-full border rounded-md px-3 py-2 bg-background" placeholder="Название задания" />
              <textarea className="w-full border rounded-md px-3 py-2 bg-background" placeholder="Описание" />
              <Button variant="hero" className="w-full">Создать</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default TeacherDashboard;
