type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: Props) {
  return (
    <div
      className={`max-w-2xl mb-12 ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <div
          className={`flex items-center gap-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="block w-10 h-px bg-primary" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2
        className={`mt-4 headline text-3xl md:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-base md:text-lg leading-relaxed normal-case ${
            light ? "text-white/70" : "text-gray"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
