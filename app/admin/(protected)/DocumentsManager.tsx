"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DocumentRow } from "./page";

type FormationItem = { slug: string; title: string };

const CATEGORY_OPTIONS = [
  { value: "general", label: "Général" },
  { value: "programme", label: "Programme" },
  { value: "reglement", label: "Règlement" },
  { value: "certificat", label: "Certificat" },
  { value: "promotion", label: "Promotion" },
];

function categoryLabel(value: string) {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function sanitize(name: string) {
  return name.normalize("NFD").replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export function DocumentsManager({
  formations,
  documents,
}: {
  formations: FormationItem[];
  documents: DocumentRow[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const titleBySlug = new Map(formations.map((f) => [f.slug, f.title]));

  async function openSigned(path: string) {
    setError(null);
    const supabase = createClient();
    const { data, error: signErr } = await supabase.storage
      .from("documents")
      .createSignedUrl(path, 3600);
    if (signErr || !data?.signedUrl) {
      setError("Impossible de générer le lien.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    const label = (
      form.elements.namedItem("label") as HTMLInputElement
    ).value.trim();
    const formationSlug = (
      form.elements.namedItem("formation_slug") as HTMLSelectElement
    ).value;
    const category = (
      form.elements.namedItem("category") as HTMLSelectElement
    ).value;

    if (!file) {
      setError("Sélectionnez un fichier.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    // Les flyers de promotion vont dans un dossier dédié `promotions/` : c'est
    // le seul préfixe rendu lisible publiquement (pour l'affichage sur le site).
    const prefix = category === "promotion" ? "promotions/" : "";
    const path = `${prefix}${Date.now()}-${sanitize(file.name)}`;

    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setError(`Upload échoué : ${upErr.message}`);
      setBusy(false);
      return;
    }

    const { error: insErr } = await supabase.from("documents").insert({
      label: label || file.name,
      file_path: path,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
      formation_slug: formationSlug || null,
      category,
    });

    if (insErr) {
      setError(`Enregistrement échoué : ${insErr.message}`);
      setBusy(false);
      return;
    }

    formRef.current?.reset();
    setBusy(false);
    router.refresh();
  }

  async function onUpdate(
    id: string,
    data: { label: string; category: string; formationSlug: string }
  ) {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error: updErr } = await supabase
      .from("documents")
      .update({
        label: data.label,
        category: data.category,
        formation_slug: data.formationSlug || null,
      })
      .eq("id", id);
    if (updErr) {
      setError(`Modification échouée : ${updErr.message}`);
      setBusy(false);
      return;
    }
    setEditingId(null);
    setBusy(false);
    router.refresh();
  }

  async function onDelete(doc: DocumentRow) {
    setBusy(true);
    const supabase = createClient();
    await supabase.storage.from("documents").remove([doc.file_path]);
    await supabase.from("documents").delete().eq("id", doc.id);
    setBusy(false);
    router.refresh();
  }

  const inputClass =
    "border border-rule bg-light px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

  return (
    <section className="bg-white border border-rule p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-8 h-px bg-primary" />
        <span className="eyebrow">Documents</span>
      </div>

      <form
        ref={formRef}
        onSubmit={onUpload}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end mb-8 pb-8 border-b border-rule"
      >
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Nom du document
          </span>
          <input
            type="text"
            name="label"
            placeholder="Ex : Programme R489"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Catégorie
          </span>
          <select name="category" defaultValue="general" className={inputClass}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Formation liée (optionnel)
          </span>
          <select name="formation_slug" defaultValue="" className={inputClass}>
            <option value="">— Aucune —</option>
            {formations.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Fichier (PDF, Excel, image…)
          </span>
          <input
            type="file"
            name="file"
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.gif"
            className="text-sm text-ink file:mr-3 file:border file:border-ink file:bg-white file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.18em] file:cursor-pointer"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="btn hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50"
        >
          {busy ? "Envoi…" : "Téléverser"}
        </button>
      </form>

      {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

      {documents.length === 0 ? (
        <p className="text-sm text-gray normal-case">
          Aucun document pour le moment.
        </p>
      ) : (
        <ul className="border-t border-rule">
          {documents.map((doc) =>
            editingId === doc.id ? (
              <li key={doc.id} className="py-4 border-b border-rule">
                <DocumentEditor
                  doc={doc}
                  formations={formations}
                  disabled={busy}
                  onCancel={() => setEditingId(null)}
                  onSave={(data) => onUpdate(doc.id, data)}
                />
              </li>
            ) : (
              <li
                key={doc.id}
                className="flex flex-wrap items-center gap-3 py-3 border-b border-rule"
              >
                <button
                  type="button"
                  onClick={() => openSigned(doc.file_path)}
                  className="flex-1 min-w-[180px] text-left text-sm font-medium text-ink hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <span aria-hidden="true">↗</span> {doc.label}
                </button>
                <span className="text-xs uppercase tracking-wider text-primary">
                  {categoryLabel(doc.category)}
                </span>
                {doc.formation_slug && (
                  <span className="text-xs text-gray">
                    {titleBySlug.get(doc.formation_slug) ?? doc.formation_slug}
                  </span>
                )}
                <span className="text-xs text-gray">
                  {formatSize(doc.size_bytes)}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(doc.id)}
                  disabled={busy}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-50"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(doc)}
                  disabled={busy}
                  className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50"
                >
                  Suppr.
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}

function DocumentEditor({
  doc,
  formations,
  disabled,
  onCancel,
  onSave,
}: {
  doc: DocumentRow;
  formations: FormationItem[];
  disabled: boolean;
  onCancel: () => void;
  onSave: (data: {
    label: string;
    category: string;
    formationSlug: string;
  }) => void;
}) {
  const [label, setLabel] = useState(doc.label);
  const [category, setCategory] = useState(doc.category);
  const [formationSlug, setFormationSlug] = useState(doc.formation_slug ?? "");

  const editClass =
    "border border-rule bg-light px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray normal-case">
        Fichier : {doc.file_name}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Nom du document
          </span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={editClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Catégorie
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={editClass}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray">
            Formation liée (optionnel)
          </span>
          <select
            value={formationSlug}
            onChange={(e) => setFormationSlug(e.target.value)}
            className={editClass}
          >
            <option value="">— Aucune —</option>
            {formations.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onSave({
              label: label.trim() || doc.file_name,
              category,
              formationSlug,
            })
          }
          disabled={disabled}
          className="btn hover:bg-primary-dark hover:border-primary-dark disabled:opacity-50"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="text-[11px] uppercase tracking-[0.16em] border border-rule px-3 py-1.5 text-ink hover:bg-light transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <span className="text-[11px] text-gray normal-case ml-1">
          Pour remplacer le fichier, supprimez le document et téléversez-le à
          nouveau.
        </span>
      </div>
    </div>
  );
}
