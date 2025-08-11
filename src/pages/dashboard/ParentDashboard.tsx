import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ParentDashboard = () => {
  useEffect(() => {
    document.title = "Личный кабинет — Родитель | Ability School";
  }, []);

  return (
    <main className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold">Здравствуйте, Родитель</h1>
        <p className="text-muted-foreground">Прогресс ребёнка и связь с учителем</p>
      </header>
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Прогресс ребёнка</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">Средний балл: 4.6 • Выполнено заданий: 85%</div>
            <div className="mt-2 text-sm text-muted-foreground">Рекомендации: уделить внимание чтению и практике по информатике.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Контакты учителя</CardTitle></CardHeader>
          <CardContent className="text-sm">
            Учитель: Ирина Петрова
            <div>Email: teach@example.com</div>
            <div>Чат доступен в рабочее время</div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ParentDashboard;
