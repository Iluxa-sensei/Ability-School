import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Политика конфиденциальности — Ability School";
  }, []);

  return (
    <main className="container py-12">
      <article className="max-w-3xl space-y-4">
        <h1>Политика конфиденциальности</h1>
        <p>Мы бережно относимся к персональным данным пользователей и используем их только для улучшения сервиса. Данный прототип не хранит реальные данные.</p>
        <h2>Какие данные собираются</h2>
        <p>В прототипе данные не передаются на сервер и не сохраняются.</p>
        <h2>Связь с нами</h2>
        <p>По всем вопросам пишите на hello@ability.school.</p>
      </article>
    </main>
  );
};

export default PrivacyPolicy;
