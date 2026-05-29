"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart";
import type { PublicSession } from "@/lib/queries";

type ViewMode = "day" | "week" | "month";

const TIME_START = 8;
const TIME_END = 19;
const HOURS = TIME_END - TIME_START;
const PX_PER_HOUR = 60;
const WEEK_DAYS = 6;

const DAY_NAMES_SHORT = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
const DAY_NAMES_LONG = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const MONTHS_LONG = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addMonths(d: Date, n: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseTs(ts: string) {
  const [datePart, timePart = "00:00"] = ts.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return { y, m, d, hh, mm, dateKey: datePart };
}

function formatRangeLabel(start: Date, end: Date) {
  const sm = start.getMonth();
  const em = end.getMonth();
  if (sm === em) {
    return `${start.getDate()} – ${end.getDate()} ${MONTHS_LONG[em]} ${end.getFullYear()}`;
  }
  return `${start.getDate()} ${MONTHS_LONG[sm]} – ${end.getDate()} ${MONTHS_LONG[em]} ${end.getFullYear()}`;
}

type Props = {
  sessions: PublicSession[];
  titleBySlug: Record<string, string>;
  priceBySlug: Record<string, number | null>;
};

export function CalendrierView({ sessions, titleBySlug, priceBySlug }: Props) {
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<Date>(() => startOfDay(new Date()));
  const [now, setNow] = useState<Date>(() => new Date());
  const today = useMemo(() => startOfDay(now), [now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  function goPrev() {
    if (view === "day") setAnchor((a) => addDays(a, -1));
    else if (view === "week") setAnchor((a) => addDays(a, -7));
    else setAnchor((a) => addMonths(a, -1));
  }
  function goNext() {
    if (view === "day") setAnchor((a) => addDays(a, 1));
    else if (view === "week") setAnchor((a) => addDays(a, 7));
    else setAnchor((a) => addMonths(a, 1));
  }
  function goToday() {
    setAnchor(startOfDay(new Date()));
  }

  const isAtToday = useMemo(() => {
    if (view === "day") return dateKey(anchor) === dateKey(today);
    if (view === "week")
      return dateKey(getMonday(anchor)) === dateKey(getMonday(today));
    return (
      anchor.getFullYear() === today.getFullYear() &&
      anchor.getMonth() === today.getMonth()
    );
  }, [anchor, today, view]);

  const headerLabel = useMemo(() => {
    if (view === "day") {
      return `${DAY_NAMES_LONG[(anchor.getDay() + 6) % 7]} ${anchor.getDate()} ${MONTHS_LONG[anchor.getMonth()]} ${anchor.getFullYear()}`;
    }
    if (view === "week") {
      const monday = getMonday(anchor);
      const end = addDays(monday, WEEK_DAYS - 1);
      return formatRangeLabel(monday, end);
    }
    return `${MONTHS_LONG[anchor.getMonth()]} ${anchor.getFullYear()}`;
  }, [anchor, view]);

  const headerEyebrow =
    view === "day" ? "Journée du" : view === "week" ? "Semaine du" : "Mois de";

  return (
    <div className="border border-rule bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-rule">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="w-9 h-9 flex items-center justify-center border border-rule text-ink hover:bg-light transition-colors"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goNext}
            className="w-9 h-9 flex items-center justify-center border border-rule text-ink hover:bg-light transition-colors"
            aria-label="Suivant"
          >
            →
          </button>
          <button
            type="button"
            onClick={goToday}
            disabled={isAtToday}
            className="ml-2 text-[11px] uppercase tracking-[0.18em] font-medium border border-rule px-3 py-2 text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            Aujourd&apos;hui
          </button>
        </div>

        <div className="text-right">
          <p className="eyebrow text-primary">{headerEyebrow}</p>
          <p className="headline text-lg text-ink mt-1">{headerLabel}</p>
        </div>

        <ViewSwitcher value={view} onChange={setView} />
      </div>

      {view === "day" && (
        <DayView
          anchor={anchor}
          today={today}
          now={now}
          sessions={sessions}
          titleBySlug={titleBySlug}
          priceBySlug={priceBySlug}
        />
      )}
      {view === "week" && (
        <WeekView
          anchor={anchor}
          today={today}
          now={now}
          sessions={sessions}
          titleBySlug={titleBySlug}
          priceBySlug={priceBySlug}
        />
      )}
      {view === "month" && (
        <MonthView
          anchor={anchor}
          today={today}
          sessions={sessions}
          titleBySlug={titleBySlug}
          priceBySlug={priceBySlug}
          onDayClick={(d) => {
            setAnchor(d);
            setView("day");
          }}
        />
      )}
    </div>
  );
}

function ViewSwitcher({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const options: { v: ViewMode; label: string }[] = [
    { v: "day", label: "Jour" },
    { v: "week", label: "Semaine" },
    { v: "month", label: "Mois" },
  ];
  return (
    <div className="inline-flex border border-rule">
      {options.map((o, i) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`px-3 md:px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
              i > 0 ? "border-l border-rule" : ""
            } ${active ? "bg-ink text-white" : "bg-white text-ink hover:bg-light"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- NOW INDICATOR ---------- */

function nowOffsetPx(now: Date): number | null {
  const hours = now.getHours() + now.getMinutes() / 60;
  if (hours < TIME_START || hours > TIME_END) return null;
  return (hours - TIME_START) * PX_PER_HOUR;
}

function NowIndicator({ now, withDot = true }: { now: Date; withDot?: boolean }) {
  const top = nowOffsetPx(now);
  if (top == null) return null;
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top }}
    >
      {withDot && (
        <span className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
      )}
      <span className="block h-px bg-red-500" />
    </div>
  );
}

/* ---------- DAY VIEW ---------- */

function DayView({
  anchor,
  today,
  now,
  sessions,
  titleBySlug,
  priceBySlug,
}: {
  anchor: Date;
  today: Date;
  now: Date;
  sessions: PublicSession[];
  titleBySlug: Record<string, string>;
  priceBySlug: Record<string, number | null>;
}) {
  const k = dateKey(anchor);
  const isToday = k === dateKey(today);

  const daySessions = useMemo(
    () =>
      sessions.filter((s) => {
        const startK = s.starts_at.slice(0, 10);
        const endK = s.ends_at ? s.ends_at.slice(0, 10) : startK;
        return k >= startK && k <= endK;
      }),
    [sessions, k]
  );

  return (
    <div>
      <div
        className={`px-4 md:px-6 py-3 border-b border-rule ${
          isToday ? "bg-primary-soft" : ""
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray font-medium">
          {DAY_NAMES_LONG[(anchor.getDay() + 6) % 7]}
        </p>
      </div>
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `64px 1fr`,
          gridTemplateRows: `repeat(${HOURS}, ${PX_PER_HOUR}px)`,
        }}
      >
        {Array.from({ length: HOURS }, (_, i) => (
          <div
            key={`h-${i}`}
            className="text-[10px] uppercase tracking-[0.16em] text-gray text-right pr-2 pt-0.5 border-t border-rule"
            style={{ gridColumn: 1, gridRow: i + 1 }}
          >
            {String(TIME_START + i).padStart(2, "0")}h
          </div>
        ))}
        <div
          className={`relative border-l border-rule ${
            isToday ? "bg-primary-soft/40" : ""
          }`}
          style={{ gridColumn: 2, gridRow: `1 / span ${HOURS}` }}
        >
          {Array.from({ length: HOURS }, (_, i) => (
            <div
              key={`d-${i}`}
              className="absolute left-0 right-0 border-t border-rule"
              style={{ top: i * PX_PER_HOUR }}
            />
          ))}
          {daySessions.map((s, idx) => (
            <SessionBlock
              key={`${s.id}-${k}`}
              session={s}
              dayKey={k}
              title={titleBySlug[s.formation_slug] ?? s.formation_slug}
              priceFrom={priceBySlug[s.formation_slug] ?? null}
              stackIndex={idx}
              stackTotal={daySessions.length}
            />
          ))}
          {isToday && <NowIndicator now={now} />}
        </div>
      </div>
      {daySessions.length === 0 && (
        <p className="px-6 py-10 text-center text-sm text-gray normal-case border-t border-rule">
          Aucune session ce jour.
        </p>
      )}
    </div>
  );
}

/* ---------- WEEK VIEW ---------- */

function WeekView({
  anchor,
  today,
  now,
  sessions,
  titleBySlug,
  priceBySlug,
}: {
  anchor: Date;
  today: Date;
  now: Date;
  sessions: PublicSession[];
  titleBySlug: Record<string, string>;
  priceBySlug: Record<string, number | null>;
}) {
  const weekStart = getMonday(anchor);
  const days = useMemo(
    () => Array.from({ length: WEEK_DAYS }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, PublicSession[]>();
    for (const d of days) map.set(dateKey(d), []);
    for (const s of sessions) {
      const startK = s.starts_at.slice(0, 10);
      const endK = s.ends_at ? s.ends_at.slice(0, 10) : startK;
      for (const d of days) {
        const k = dateKey(d);
        if (k >= startK && k <= endK) map.get(k)!.push(s);
      }
    }
    return map;
  }, [sessions, days]);

  const weekTotal = [...sessionsByDay.values()].reduce(
    (n, arr) => n + arr.length,
    0
  );

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[820px]">
          <div
            className="grid border-b border-rule"
            style={{ gridTemplateColumns: `64px repeat(${WEEK_DAYS}, 1fr)` }}
          >
            <div />
            {days.map((d, i) => {
              const isToday = dateKey(d) === dateKey(today);
              return (
                <div
                  key={i}
                  className={`text-center px-2 py-3 border-l border-rule ${
                    isToday ? "bg-primary-soft" : ""
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray font-medium">
                    {DAY_NAMES_SHORT[i]}
                  </p>
                  <p
                    className={`mt-1 headline text-xl ${
                      isToday ? "text-primary" : "text-ink"
                    }`}
                  >
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="grid relative"
            style={{
              gridTemplateColumns: `64px repeat(${WEEK_DAYS}, 1fr)`,
              gridTemplateRows: `repeat(${HOURS}, ${PX_PER_HOUR}px)`,
            }}
          >
            {Array.from({ length: HOURS }, (_, i) => (
              <div
                key={`h-${i}`}
                className="text-[10px] uppercase tracking-[0.16em] text-gray text-right pr-2 pt-0.5 border-t border-rule"
                style={{ gridColumn: 1, gridRow: i + 1 }}
              >
                {String(TIME_START + i).padStart(2, "0")}h
              </div>
            ))}
            {days.map((d, dayIdx) => {
              const k = dateKey(d);
              const daySessions = sessionsByDay.get(k) ?? [];
              const isToday = k === dateKey(today);
              return (
                <div
                  key={dayIdx}
                  className={`relative border-l border-rule ${
                    isToday ? "bg-primary-soft/40" : ""
                  }`}
                  style={{
                    gridColumn: dayIdx + 2,
                    gridRow: `1 / span ${HOURS}`,
                  }}
                >
                  {Array.from({ length: HOURS }, (_, i) => (
                    <div
                      key={`d-${i}`}
                      className="absolute left-0 right-0 border-t border-rule"
                      style={{ top: i * PX_PER_HOUR }}
                    />
                  ))}
                  {daySessions.map((s, idx) => (
                    <SessionBlock
                      key={`${s.id}-${k}`}
                      session={s}
                      dayKey={k}
                      title={titleBySlug[s.formation_slug] ?? s.formation_slug}
                      priceFrom={priceBySlug[s.formation_slug] ?? null}
                      stackIndex={idx}
                      stackTotal={daySessions.length}
                    />
                  ))}
                  {isToday && <NowIndicator now={now} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="md:hidden divide-y divide-rule">
        {days.map((d, dayIdx) => {
          const k = dateKey(d);
          const daySessions = sessionsByDay.get(k) ?? [];
          const isToday = k === dateKey(today);
          if (daySessions.length === 0) return null;
          return (
            <div key={dayIdx} className="p-4">
              <p
                className={`text-[10px] uppercase tracking-[0.2em] font-medium ${
                  isToday ? "text-primary" : "text-gray"
                }`}
              >
                {DAY_NAMES_LONG[dayIdx]} {d.getDate()}{" "}
                {MONTHS_LONG[d.getMonth()]}
              </p>
              <div className="mt-3 space-y-2">
                {daySessions.map((s) => (
                  <SessionRowMobile
                    key={`${s.id}-${k}`}
                    session={s}
                    dayKey={k}
                    title={titleBySlug[s.formation_slug] ?? s.formation_slug}
                    priceFrom={priceBySlug[s.formation_slug] ?? null}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {weekTotal === 0 && (
          <p className="p-6 text-center text-sm text-gray normal-case">
            Aucune session cette semaine.
          </p>
        )}
      </div>

      {weekTotal === 0 && (
        <div className="hidden md:block px-6 py-10 text-center text-sm text-gray normal-case border-t border-rule">
          Aucune session programmée cette semaine.
        </div>
      )}
    </>
  );
}

/* ---------- MONTH VIEW ---------- */

function MonthView({
  anchor,
  today,
  sessions,
  titleBySlug,
  priceBySlug,
  onDayClick,
}: {
  anchor: Date;
  today: Date;
  sessions: PublicSession[];
  titleBySlug: Record<string, string>;
  priceBySlug: Record<string, number | null>;
  onDayClick: (d: Date) => void;
}) {
  const month = anchor.getMonth();
  const year = anchor.getFullYear();

  const gridStart = getMonday(new Date(year, month, 1));
  const totalCells = 42;
  const cells = useMemo(
    () => Array.from({ length: totalCells }, (_, i) => addDays(gridStart, i)),
    [gridStart]
  );

  // Trim to last week containing month days (4-6 weeks)
  const trimmed = useMemo(() => {
    const rows: Date[][] = [];
    for (let r = 0; r < 6; r++) {
      rows.push(cells.slice(r * 7, r * 7 + 7));
    }
    while (
      rows.length > 4 &&
      rows[rows.length - 1].every((d) => d.getMonth() !== month)
    ) {
      rows.pop();
    }
    return rows;
  }, [cells, month]);

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, PublicSession[]>();
    for (const row of trimmed)
      for (const d of row) map.set(dateKey(d), []);
    for (const s of sessions) {
      const startK = s.starts_at.slice(0, 10);
      const endK = s.ends_at ? s.ends_at.slice(0, 10) : startK;
      for (const row of trimmed) {
        for (const d of row) {
          const k = dateKey(d);
          if (k >= startK && k <= endK) map.get(k)?.push(s);
        }
      }
    }
    return map;
  }, [sessions, trimmed]);

  return (
    <div>
      {/* Day header */}
      <div className="grid grid-cols-7 border-b border-rule">
        {DAY_NAMES_SHORT.map((n) => (
          <div
            key={n}
            className="text-center px-2 py-3 border-l first:border-l-0 border-rule text-[10px] uppercase tracking-[0.2em] text-gray font-medium"
          >
            {n}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {trimmed.flat().map((d, i) => {
          const k = dateKey(d);
          const isOutside = d.getMonth() !== month;
          const isToday = k === dateKey(today);
          const list = sessionsByDay.get(k) ?? [];
          const shown = list.slice(0, 3);
          const remaining = list.length - shown.length;
          return (
            <button
              type="button"
              key={i}
              onClick={() => onDayClick(d)}
              className={`group/cell text-left p-2 min-h-[100px] md:min-h-[120px] border-l border-t border-rule first:border-l-0 transition-colors ${
                isOutside ? "bg-light/50" : "bg-white"
              } ${isToday ? "bg-primary-soft" : ""} hover:bg-light`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className={`text-sm font-semibold ${
                    isOutside ? "text-gray/60" : isToday ? "text-primary" : "text-ink"
                  }`}
                >
                  {d.getDate()}
                </span>
                {list.length > 0 && !isOutside && (
                  <span className="text-[9px] uppercase tracking-[0.14em] text-gray">
                    {list.length}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                {shown.map((s) => (
                  <MonthChip
                    key={`${s.id}-${k}`}
                    session={s}
                    dayKey={k}
                    title={titleBySlug[s.formation_slug] ?? s.formation_slug}
                    priceFrom={priceBySlug[s.formation_slug] ?? null}
                  />
                ))}
                {remaining > 0 && (
                  <p className="text-[10px] uppercase tracking-[0.14em] text-gray font-medium pl-1">
                    +{remaining} autre{remaining > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MonthChip({
  session,
  dayKey,
  title,
  priceFrom,
}: {
  session: PublicSession;
  dayKey: string;
  title: string;
  priceFrom: number | null;
}) {
  const { addItem, openCart } = useCart();
  const ref = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const isFull = session.status === "full" || session.seats_total === 0;
  const start = parseTs(session.starts_at);

  function onClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isFull) return;
    addItem({
      slug: session.formation_slug,
      title,
      priceFrom,
      categories: session.categories ?? [],
      sessionId: session.id,
      sessionLabel: `${dayKey} · ${String(start.hh).padStart(2, "0")}h${String(start.mm).padStart(2, "0")}`,
    });
    openCart();
  }

  return (
    <>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent);
          }
        }}
        className={`block text-[10px] px-1.5 py-0.5 leading-tight truncate cursor-pointer transition-colors ${
          isFull
            ? "bg-gray/20 text-gray cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        <span className="font-semibold mr-1">
          {String(start.hh).padStart(2, "0")}h
        </span>
        {title}
      </span>
      <SessionHoverCard
        anchorRef={ref}
        open={hovered}
        session={session}
        dayKey={dayKey}
        title={title}
        priceFrom={priceFrom}
      />
    </>
  );
}

/* ---------- TOOLTIP ---------- */

function formatLongDate(dayKey: string) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = (date.getDay() + 6) % 7;
  return `${DAY_NAMES_LONG[weekday]} ${d} ${MONTHS_LONG[m - 1]} ${y}`;
}

function SessionHoverCard({
  anchorRef,
  open,
  session,
  dayKey,
  title,
  priceFrom,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  session: PublicSession;
  dayKey: string;
  title: string;
  priceFrom: number | null;
}) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const TOOLTIP_W = 300;
    const OFFSET = 12;
    let left = rect.right + OFFSET;
    if (left + TOOLTIP_W > window.innerWidth - 8) {
      left = Math.max(8, rect.left - OFFSET - TOOLTIP_W);
    }
    let top = rect.top;
    const estimatedHeight = 220;
    if (top + estimatedHeight > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - estimatedHeight - 8);
    }
    setPos({ left, top });
  }, [open, anchorRef]);

  if (!open || !pos || typeof document === "undefined") return null;

  const { hh, mm, endHH, endMM } = blockTimesForDay(session, dayKey);
  const isFull = session.status === "full" || session.seats_total === 0;
  const startK = session.starts_at.slice(0, 10);
  const endK = session.ends_at?.slice(0, 10) ?? startK;
  const multiDay = startK !== endK;

  return createPortal(
    <div
      role="tooltip"
      style={{ left: pos.left, top: pos.top, width: 300 }}
      className="fixed z-[100] bg-white border border-rule shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] pointer-events-none"
    >
      <div className="px-4 py-3 border-b border-rule bg-light">
        <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-medium">
          {formatLongDate(dayKey)}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {String(hh).padStart(2, "0")}h{String(mm).padStart(2, "0")} –{" "}
          {String(endHH).padStart(2, "0")}h{String(endMM).padStart(2, "0")}
          {multiDay && (
            <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-gray font-medium">
              · multi-jours
            </span>
          )}
        </p>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-sm font-medium text-ink leading-snug">{title}</p>
        {session.categories && session.categories.length > 0 && (
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-medium">
            Catégorie{session.categories.length > 1 ? "s" : ""}{" "}
            {session.categories.join(" · ")}
          </p>
        )}
        <dl className="text-xs space-y-1.5 pt-1">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-gray normal-case">Lieu</dt>
            <dd className="text-ink font-medium normal-case">
              {session.location ?? "Montataire (60)"}
            </dd>
          </div>
          {session.seats_total != null && session.seats_total > 0 && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray normal-case">Places</dt>
              <dd className="text-ink font-medium normal-case">
                {session.seats_total}
              </dd>
            </div>
          )}
          {priceFrom != null && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray normal-case">Tarif</dt>
              <dd className="text-ink font-medium normal-case">
                Dès {priceFrom} €
              </dd>
            </div>
          )}
        </dl>
      </div>
      <div
        className={`px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium border-t border-rule ${
          isFull ? "bg-gray/20 text-gray" : "bg-primary/10 text-primary"
        }`}
      >
        {isFull ? "Session complète" : "Cliquer pour ajouter au panier →"}
      </div>
    </div>,
    document.body
  );
}

/* ---------- SHARED BLOCKS ---------- */

function blockTimesForDay(s: PublicSession, dayKey: string) {
  const start = parseTs(s.starts_at);
  const end = s.ends_at ? parseTs(s.ends_at) : start;

  let hh = start.hh;
  let mm = start.mm;
  let endHH = end.hh;
  let endMM = end.mm;

  if (start.dateKey !== dayKey) {
    hh = TIME_START;
    mm = 0;
  }
  if (end.dateKey !== dayKey) {
    endHH = TIME_END;
    endMM = 0;
  }
  if (start.dateKey === end.dateKey && !s.ends_at) {
    endHH = Math.min(TIME_END, hh + 8);
    endMM = mm;
  }

  return { hh, mm, endHH, endMM };
}

function SessionBlock({
  session,
  dayKey,
  title,
  priceFrom,
  stackIndex,
  stackTotal,
}: {
  session: PublicSession;
  dayKey: string;
  title: string;
  priceFrom: number | null;
  stackIndex: number;
  stackTotal: number;
}) {
  const { addItem, openCart } = useCart();
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const isFull = session.status === "full" || session.seats_total === 0;

  const { hh, mm, endHH, endMM } = blockTimesForDay(session, dayKey);
  const topHours = Math.max(0, hh + mm / 60 - TIME_START);
  const endHours = Math.min(HOURS, endHH + endMM / 60 - TIME_START);
  const top = topHours * PX_PER_HOUR;
  const height = Math.max(PX_PER_HOUR * 0.5, (endHours - topHours) * PX_PER_HOUR - 2);

  const widthPct = stackTotal > 1 ? 100 / stackTotal : 100;
  const leftPct = stackIndex * widthPct;

  function onClick() {
    if (isFull) return;
    addItem({
      slug: session.formation_slug,
      title,
      priceFrom,
      categories: session.categories ?? [],
      sessionId: session.id,
      sessionLabel: `${dayKey} · ${String(hh).padStart(2, "0")}h${String(mm).padStart(2, "0")}`,
    });
    openCart();
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        disabled={isFull}
        className={`absolute left-0 right-0 m-0.5 p-2 text-left text-[11px] leading-tight overflow-hidden transition-all ${
          isFull
            ? "bg-gray/20 text-gray border border-gray/30 cursor-not-allowed"
            : "bg-primary text-white border border-primary-dark hover:bg-primary-dark cursor-pointer"
        }`}
        style={{
          top,
          height,
          left: `${leftPct}%`,
          width: `calc(${widthPct}% - 4px)`,
        }}
      >
        <p className="font-semibold text-[10px]">
          {String(hh).padStart(2, "0")}h{String(mm).padStart(2, "0")} –{" "}
          {String(endHH).padStart(2, "0")}h{String(endMM).padStart(2, "0")}
        </p>
        <p className="mt-0.5 font-medium normal-case leading-tight line-clamp-2">
          {title}
        </p>
        {session.categories && session.categories.length > 0 && (
          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] font-medium opacity-90">
            Cat. {session.categories.join(" · ")}
          </p>
        )}
        {isFull && (
          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] font-bold">
            Complet
          </p>
        )}
      </button>
      <SessionHoverCard
        anchorRef={ref}
        open={hovered}
        session={session}
        dayKey={dayKey}
        title={title}
        priceFrom={priceFrom}
      />
    </>
  );
}

function SessionRowMobile({
  session,
  dayKey,
  title,
  priceFrom,
}: {
  session: PublicSession;
  dayKey: string;
  title: string;
  priceFrom: number | null;
}) {
  const { addItem, openCart } = useCart();
  const isFull = session.status === "full" || session.seats_total === 0;
  const { hh, mm, endHH, endMM } = blockTimesForDay(session, dayKey);

  function onClick() {
    if (isFull) return;
    addItem({
      slug: session.formation_slug,
      title,
      priceFrom,
      categories: session.categories ?? [],
      sessionId: session.id,
      sessionLabel: `${dayKey} · ${String(hh).padStart(2, "0")}h${String(mm).padStart(2, "0")}`,
    });
    openCart();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFull}
      className={`w-full text-left p-3 border transition-colors ${
        isFull
          ? "bg-gray/10 text-gray border-gray/20 cursor-not-allowed"
          : "bg-primary text-white border-primary-dark hover:bg-primary-dark"
      }`}
    >
      <p className="text-[11px] font-bold">
        {String(hh).padStart(2, "0")}h{String(mm).padStart(2, "0")} –{" "}
        {String(endHH).padStart(2, "0")}h{String(endMM).padStart(2, "0")}
      </p>
      <p className="text-sm font-medium normal-case mt-1">{title}</p>
      {session.categories && session.categories.length > 0 && (
        <p className="text-[10px] uppercase tracking-[0.14em] mt-1 opacity-90">
          Cat. {session.categories.join(" · ")}
        </p>
      )}
      {isFull && (
        <p className="text-[10px] uppercase tracking-[0.14em] font-bold mt-1">
          Complet
        </p>
      )}
    </button>
  );
}

export function CalendrierLegend() {
  return (
    <p className="mt-4 text-[11px] text-gray normal-case text-center">
      Cliquez sur une session pour l&apos;ajouter à votre panier — vous
      pourrez ensuite{" "}
      <Link href="/panier" className="text-ink underline hover:text-primary">
        finaliser votre demande de devis
      </Link>
      .
    </p>
  );
}
