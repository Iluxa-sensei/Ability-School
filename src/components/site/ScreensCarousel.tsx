import screen1 from "@/assets/screenshot-virtual-class.jpg";
import screen2 from "@/assets/screenshot-ai-chat.jpg";
import screen3 from "@/assets/screenshot-parent-dashboard.jpg";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const ScreensCarousel = () => {
  return (
    <section id="screens" className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <header className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold">Скриншоты платформы</h2>
          <p className="text-muted-foreground mt-2">Короткий обзор интерфейса для учеников, родителей и учителей.</p>
        </header>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {[screen1, screen2, screen3].map((src, i) => (
                <CarouselItem key={i}>
                  <img
                    src={src}
                    loading="lazy"
                    alt={
                      i === 0
                        ? "Виртуальный класс и расписание"
                        : i === 1
                        ? "Чат с ИИ‑ассистентом"
                        : "Дашборд родителя с прогрессом"
                    }
                    className="w-full rounded-xl shadow-elevated"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ScreensCarousel;
