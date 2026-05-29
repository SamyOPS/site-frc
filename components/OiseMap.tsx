import Image from "next/image";
import carte from "@/public/carte.png";

export function OiseMap() {
  return (
    <Image
      src={carte}
      alt="Carte de l'Oise (60) avec Montataire indiqué — FRC Technique"
      sizes="(min-width: 1024px) 55vw, 100vw"
      placeholder="blur"
      className="w-full h-auto"
    />
  );
}
