"use client";

import { useState } from "react";
import { QrCodeSvg } from "@/components/QrCodeSvg";

const SVG_ID = "review-qr-svg";

function serializeSvg(): string | null {
  const el = document.getElementById(SVG_ID);
  if (!el) return null;
  const clone = el.cloneNode(true) as SVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function ReviewQrPanel({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  function downloadSvg() {
    const svg = serializeSvg();
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objUrl = URL.createObjectURL(blob);
    triggerDownload(objUrl, "qr-avis-frc-technique.svg");
    URL.revokeObjectURL(objUrl);
  }

  function downloadPng() {
    const svg = serializeSvg();
    if (!svg) return;
    const size = 1024;
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        triggerDownload(canvas.toDataURL("image/png"), "qr-avis-frc-technique.png");
      }
      URL.revokeObjectURL(objUrl);
    };
    img.src = objUrl;
  }

  function printQr() {
    const svg = serializeSvg();
    if (!svg) return;
    const win = window.open("", "_blank", "width=600,height=720");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>QR code — Avis FRC Technique</title>
      <style>
        body{font-family:system-ui,sans-serif;margin:0;display:flex;flex-direction:column;
          align-items:center;justify-content:center;min-height:100vh;gap:24px;padding:40px;text-align:center}
        svg{width:340px;height:340px}
        h1{font-size:20px;margin:0}
        p{font-size:14px;color:#444;margin:0;word-break:break-all}
      </style></head><body>
      <h1>Laissez-nous un avis</h1>
      ${svg}
      <p>${url}</p>
      <script>window.onload=function(){window.print()}</script>
      </body></html>`);
    win.document.close();
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const btn =
    "text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors";

  return (
    <section className="bg-white border border-rule p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">QR code avis</span>
      </div>

      <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="w-44 h-44 border border-rule bg-white p-2 shrink-0">
          <QrCodeSvg
            id={SVG_ID}
            value={url}
            className="w-full h-full"
            title="QR code vers la page d'avis"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-gray normal-case leading-relaxed">
            Imprimez ce QR code et affichez-le en salle de formation. Les
            stagiaires le scannent pour accéder directement à la page de dépôt
            d&apos;avis. Les avis reçus apparaissent ci-dessous, en attente de
            validation.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <code className="text-xs bg-light border border-rule px-2.5 py-1.5 text-ink break-all">
              {url}
            </code>
            <button type="button" onClick={copyUrl} className={btn}>
              {copied ? "Copié" : "Copier"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={downloadPng} className={btn}>
              Télécharger PNG
            </button>
            <button type="button" onClick={downloadSvg} className={btn}>
              Télécharger SVG
            </button>
            <button type="button" onClick={printQr} className={btn}>
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
