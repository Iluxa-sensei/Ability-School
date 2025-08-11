import { Link } from "react-router-dom";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t" id="contact">
      <div className="container py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold text-gradient">Ability School</div>
          <p className="text-sm text-muted-foreground mt-2">
            Виртуальная школа с ИИ для учеников, родителей и учителей.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Контакты</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: hello@ability.school</li>
            <li>Телефон: +7 (000) 000-00-00</li>
            <li>Город: Уральск</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Правовая информация</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
          <div className="flex gap-4 mt-4 text-muted-foreground">
            <a
              aria-label="WhatsApp"
              href="https://wa.me/77000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#25D366]"
            >
              <MessageCircle className="size-5" />
            </a>
            <a
              aria-label="Instagram"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-pink-500"
              style={{
                background: "linear-gradient(45deg,#fd5,#ff543e,#c837ab,#285AEB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              <Instagram className="size-5" />
            </a>
            <a
              aria-label="LinkedIn"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#0077B5]"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ability School. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
