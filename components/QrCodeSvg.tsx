import { QrCode, type Ecc } from "@/lib/qrcode";

type Props = {
  value: string;
  /** Niveau de correction d'erreur (M par défaut). */
  ecc?: Ecc;
  /** Taille du quiet zone, en modules (4 = recommandation ISO). */
  margin?: number;
  className?: string;
  /** Identifiant pour récupérer le SVG côté client (export). */
  id?: string;
  title?: string;
};

/**
 * Rend un QR code en SVG vectoriel (net à toute taille, imprimable).
 * `QrCode.encodeText` étant du JS pur, ce composant fonctionne aussi bien
 * côté serveur que client.
 */
export function QrCodeSvg({
  value,
  ecc = "M",
  margin = 4,
  className,
  id,
  title,
}: Props) {
  const modules = QrCode.encodeText(value, ecc).getModules();
  const n = modules.length;
  const dim = n + margin * 2;

  let path = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (modules[y][x]) {
        path += `M${x + margin},${y + margin}h1v1h-1z`;
      }
    }
  }

  return (
    <svg
      id={id}
      className={className}
      viewBox={`0 0 ${dim} ${dim}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label={title ?? "QR code"}
    >
      <rect width={dim} height={dim} fill="#ffffff" />
      <path d={path} fill="#0a0a0a" />
    </svg>
  );
}
