import Image, { type StaticImageData } from "next/image";

import img1 from "@/public/frc/2023-12-13.webp";
import img2 from "@/public/frc/2024-07-18.webp";
import img3 from "@/public/frc/unnamed.webp";
import img4 from "@/public/frc/2022-10-22.webp";
import img5 from "@/public/frc/2024-01-20.webp";
import img6 from "@/public/frc/3w6a0433_52035903199_o.webp";
import img7 from "@/public/frc/2024-07-18 (1).webp";
import img8 from "@/public/frc/2023-12-13 (1).webp";
import img9 from "@/public/frc/unnamed (1).webp";
import img10 from "@/public/frc/unnamed (2).webp";

const allImages: StaticImageData[] = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
];

const colA = allImages.filter((_, i) => i % 2 === 0);
const colB = allImages.filter((_, i) => i % 2 === 1);

export function AnimatedMarquee() {
  const loopA = [...colA, ...colA];
  const loopB = [...colB, ...colB];

  return (
    <div className="relative grid grid-cols-2 gap-3 h-[52vh] min-h-[380px] max-h-[540px] w-full">
      <div className="overflow-hidden">
        <div className="flex flex-col gap-3 animate-[marquee_45s_linear_infinite] will-change-transform">
          {loopA.map((img, i) => (
            <div
              key={`a-${i}`}
              className="shrink-0 border border-rule bg-light"
            >
              <Image
                src={img}
                alt=""
                className="block w-full h-auto"
                sizes="(min-width: 1024px) 22vw, 100vw"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-col gap-3 animate-[marquee_45s_linear_infinite] [animation-direction:reverse] will-change-transform">
          {loopB.map((img, i) => (
            <div
              key={`b-${i}`}
              className="shrink-0 border border-rule bg-light"
            >
              <Image
                src={img}
                alt=""
                className="block w-full h-auto"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
