import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";

export type CardStackItem = {
  id: number;
  name: string;
  designation: string;
  content: ReactNode;
  imageUrl?: string;
  cta?: ReactNode;
};

export function CardStack({
  items,
  offset = 12,
  scaleFactor = 0.07,
}: {
  items: CardStackItem[];
  offset?: number;
  scaleFactor?: number;
}) {
  const [cards, setCards] = useState<CardStackItem[]>(items);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCards((prevCards: CardStackItem[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative h-60 w-60 md:h-64 md:w-[28rem]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute luxury-card h-60 w-60 md:h-64 md:w-[28rem] rounded-3xl p-5 shadow-xl ring-1 ring-primary/10 flex flex-col justify-between backdrop-blur-sm"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -offset,
              scale: 1 - index * scaleFactor,
              zIndex: cards.length - index,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="space-y-3">
              {card.imageUrl && (
                <div className="-mx-2 -mt-2">
                  <img
                    src={card.imageUrl}
                    alt="testimonial visual"
                    className="w-full h-24 md:h-28 object-cover rounded-xl ring-1 ring-primary/20"
                  />
                </div>
              )}
              <div className="font-normal text-neutral-300">{card.content}</div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-primary font-medium">{card.name}</p>
                <p className="text-neutral-400">{card.designation}</p>
              </div>
              {card.cta && <div className="shrink-0">{card.cta}</div>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 