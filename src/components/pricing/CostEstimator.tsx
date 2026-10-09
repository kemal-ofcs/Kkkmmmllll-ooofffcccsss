"use client";

import { Check, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { scrollToElement } from "@/components/motion/SmoothScroll";
import { buttonVariants } from "@/components/ui/button-variants";
import { cx } from "@/lib/cx";
import {
  type Addon,
  addons,
  type Backend,
  backends,
  type Config,
  defaultConfig,
  disabledReason,
  estimate,
  formatRupiah,
  normalize,
  packages,
  scopes,
  timelines,
  visuals,
} from "@/lib/pricing";
import { estimateUrl } from "@/lib/whatsapp";

type Option = { value: string; label: string; price: string; note?: string; reason: string | null };
type Group = { key: keyof Config; title: string; multiple?: boolean; options: Option[] };

const plus = (n: number) => `+ ${formatRupiah(n)}`;
const factor = (percent: number) =>
  `× ${(percent / 100).toLocaleString("id-ID", { minimumFractionDigits: 1 })}`;

function groupsFor(config: Config): Group[] {
  return [
    {
      key: "scope",
      title: "Tipe Solusi",
      options: Object.entries(scopes).map(([value, o]) => ({
        value,
        label: o.label,
        price: formatRupiah(o.price),
        reason: null,
      })),
    },
    {
      key: "visual",
      title: "Gaya Visual",
      options: Object.entries(visuals).map(([value, o]) => ({
        value,
        label: o.label,
        price: plus(o.price),
        note: o.note,
        reason: null,
      })),
    },
    {
      key: "backend",
      title: "Backend & Data",
      options: Object.entries(backends).map(([value, o]) => ({
        value,
        label: o.label,
        price: plus(o.price),
        note: o.note,
        reason: disabledReason(config, { backend: value as Backend }),
      })),
    },
    {
      key: "addons",
      title: "Add-ons",
      multiple: true,
      options: Object.entries(addons).map(([value, o]) => ({
        value,
        label: o.label,
        price: plus(o.price),
        note: o.note,
        reason: disabledReason(config, { addon: value as Addon }),
      })),
    },
    {
      key: "timeline",
      title: "Timeline",
      options: Object.entries(timelines).map(([value, o]) => ({
        value,
        label: o.label,
        price: factor(o.percent),
        reason: null,
      })),
    },
  ];
}

/** Angka total beranimasi 400 ms tiap berubah; reduced-motion langsung berganti (DESIGN.md §6.6). */
function useTween(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 400);
      const eased = 1 - (1 - t) ** 3;
      const v = Math.round((a + (value - a) * eased) / 100_000) * 100_000;
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return shown;
}

/** Catat lead tanpa menunda WhatsApp (PRD §5.5.G). Server menghitung ulang harganya. */
function sendLead(config: Config) {
  const body = JSON.stringify(config);
  if (navigator.sendBeacon?.("/api/leads", new Blob([body], { type: "application/json" }))) return;
  fetch("/api/leads", {
    method: "POST",
    body,
    keepalive: true,
    headers: { "content-type": "application/json" },
  }).catch(() => {});
}

export function CostEstimator({ waNumber }: { waNumber: string }) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState<{ text: string; id: number } | null>(null);
  const [flash, setFlash] = useState(0);
  const [opening, setOpening] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const calc = useRef<HTMLDivElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const totalEl = useRef<HTMLParagraphElement>(null);

  const { lines, percent, total } = estimate(config);
  const shownTotal = useTween(total);
  const groups = groupsFor(config);

  const apply = (next: Config) => {
    const result = normalize(next);
    setConfig(result.config);
    if (result.notices.length) setNotice({ text: result.notices.join(" "), id: Date.now() });
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  // Bar total di bawah layar (mobile): tampil selama kalkulator terlihat tapi angka total belum.
  useEffect(() => {
    const calcEl = calc.current;
    const summaryEl = totalEl.current;
    if (!calcEl || !summaryEl) return;
    const seen = { calc: false, summary: false };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen[e.target === calcEl ? "calc" : "summary"] = e.isIntersecting;
      setShowBar(seen.calc && !seen.summary);
    });
    io.observe(calcEl);
    io.observe(summaryEl);
    return () => io.disconnect();
  }, []);

  // Wizard mobile: tinggi langkah berbeda-beda, jadi setelah pindah langkah penanda
  // "Langkah n dari 5" bisa tertutup header. Gulir kembali ke atas kalkulator bila perlu.
  const firstStep = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: dipicu oleh perubahan langkah saja
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const el = calc.current;
    if (el && el.getBoundingClientRect().top < 80) scrollToElement(el);
  }, [step]);

  const choosePackage = (pkg: Config) => {
    apply(pkg);
    setStep(0);
    setFlash((n) => n + 1);
    if (calc.current) scrollToElement(calc.current);
  };

  const onWhatsApp = () => {
    sendLead(config);
    setOpening(true);
    setTimeout(() => setOpening(false), 2000);
  };

  return (
    <div className="mt-12 flex flex-col gap-16">
      {/* Daftar paket bergaya lembar penawaran (DESIGN.md §6.6) */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="hidden grid-cols-12 gap-6 border-border border-b px-6 py-3 font-mono text-fg-muted text-label uppercase lg:grid">
          <span className="col-span-4">Paket</span>
          <span className="col-span-5">Termasuk</span>
          <span className="col-span-3 text-right">Mulai dari</span>
        </div>
        <ul className="divide-y divide-border">
          {packages.map((p) => (
            <li key={p.id} className="grid gap-4 p-6 lg:grid-cols-12 lg:items-center lg:gap-6">
              <div className="flex items-baseline justify-between gap-4 lg:col-span-4 lg:block">
                <div>
                  <h3 className="font-bold font-heading text-title">{p.name}</h3>
                  <p className="mt-1 hidden text-fg-muted text-sm lg:block">{p.description}</p>
                </div>
                <p className="shrink-0 font-bold font-heading text-xl tabular-nums lg:hidden">
                  <span className="mr-1 font-normal font-sans text-fg-muted text-sm">mulai</span>
                  {formatRupiah(p.price)}
                </p>
              </div>
              <p className="text-fg-muted text-sm lg:hidden">{p.description}</p>
              <ul className="flex flex-col gap-1.5 text-sm lg:col-span-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-green" strokeWidth={2} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 lg:col-span-3 lg:items-end">
                <p className="hidden font-bold font-heading text-2xl tabular-nums lg:block">
                  {formatRupiah(p.price)}
                </p>
                <button
                  type="button"
                  className={buttonVariants({ variant: "outline", className: "w-full lg:w-auto" })}
                  onClick={() => choosePackage(p.config)}
                >
                  Hitung Paket Ini
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        id="kalkulator"
        ref={calc}
        className="relative grid scroll-mt-24 gap-8 lg:grid-cols-12 lg:gap-10"
      >
        {/* Kedip highlight 600 ms setelah memilih paket; key baru = animasi diulang */}
        {flash > 0 && <span key={flash} aria-hidden className="calc-flash" />}

        <div className="lg:col-span-7">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <p className="font-mono text-fg-muted text-label uppercase">
              Langkah {step + 1} dari {groups.length}
            </p>
            <div className="flex gap-1.5" aria-hidden>
              {groups.map((g, i) => (
                <span
                  key={g.key}
                  className={cx("h-1.5 w-6 rounded-pill", i <= step ? "bg-accent" : "bg-border")}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {groups.map((group, i) => (
              <fieldset key={group.key} className={cx(i !== step && "max-lg:hidden")}>
                <legend className="mb-3 font-semibold text-title">{group.title}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.options.map((opt) => {
                    const checked = group.multiple
                      ? config.addons.includes(opt.value as Addon)
                      : config[group.key] === opt.value;
                    const disabled = opt.reason !== null;
                    const reasonId = `${group.key}-${opt.value}-alasan`;
                    return (
                      <label
                        key={opt.value}
                        className={cx(
                          "relative flex min-h-11 flex-col gap-1 rounded-md border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-ring has-focus-visible:outline-offset-2",
                          checked ? "border-accent bg-accent-soft" : "border-border bg-surface",
                          disabled ? "cursor-not-allowed" : "cursor-pointer",
                        )}
                      >
                        <input
                          type={group.multiple ? "checkbox" : "radio"}
                          name={group.key}
                          value={opt.value}
                          checked={checked}
                          disabled={disabled}
                          aria-describedby={disabled ? reasonId : undefined}
                          onChange={(e) => {
                            if (group.multiple) {
                              const value = opt.value as Addon;
                              apply({
                                ...config,
                                addons: e.target.checked
                                  ? [...config.addons, value]
                                  : config.addons.filter((a) => a !== value),
                              });
                            } else apply({ ...config, [group.key]: opt.value });
                          }}
                          className="sr-only"
                        />
                        <span
                          className={cx(
                            "flex items-start justify-between gap-3",
                            disabled && "opacity-40",
                          )}
                        >
                          <span className="font-medium">{opt.label}</span>
                          {checked ? (
                            <Check
                              className="size-5 shrink-0 text-accent"
                              strokeWidth={2}
                              aria-hidden
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 rounded-full border border-fg-muted/50"
                            />
                          )}
                        </span>
                        <span
                          className={cx(
                            "font-mono text-fg-muted text-xs",
                            disabled && "opacity-40",
                          )}
                        >
                          {opt.price}
                          {opt.note && ` · ${opt.note}`}
                        </span>
                        {disabled && (
                          <span id={reasonId} className="text-sm text-warning">
                            {opt.reason}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-6 flex gap-3 lg:hidden">
            <button
              type="button"
              className={buttonVariants({ variant: "outline", className: "flex-1" })}
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              Kembali
            </button>
            {step < groups.length - 1 ? (
              <button
                type="button"
                className={buttonVariants({ className: "flex-1" })}
                onClick={() => setStep((s) => s + 1)}
              >
                Lanjut
              </button>
            ) : (
              <button
                type="button"
                className={buttonVariants({ className: "flex-1" })}
                onClick={() => summary.current && scrollToElement(summary.current)}
              >
                Lihat Ringkasan
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div ref={summary} id="ringkasan" className="scroll-mt-24 lg:sticky lg:top-24">
            <div role="status" aria-live="polite" className="min-h-0">
              {notice && (
                <p
                  key={notice.id}
                  className="mb-3 rounded-md border border-warning/40 bg-surface-2 px-4 py-3 text-sm"
                >
                  {notice.text}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="font-mono text-fg-muted text-label uppercase">Ringkasan estimasi</p>
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                {lines.map((l) => (
                  <div key={l.label} className="flex justify-between gap-4">
                    <dt className="text-fg-muted">{l.label}</dt>
                    <dd className="shrink-0 tabular-nums">{formatRupiah(l.amount)}</dd>
                  </div>
                ))}
                {percent !== 100 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-fg-muted">{timelines[config.timeline].short}</dt>
                    <dd className="shrink-0 tabular-nums">{factor(percent)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-5 border-border border-t pt-5">
                <p className="text-fg-muted text-sm">Total estimasi</p>
                <p
                  ref={totalEl}
                  aria-hidden
                  className="mt-1 font-bold font-heading text-display-l tabular-nums"
                >
                  {formatRupiah(shownTotal)}
                </p>
                <p className="sr-only" aria-live="polite">
                  Total estimasi {formatRupiah(total)}
                </p>
                <p className="mt-3 text-fg-muted text-xs">
                  Angka ini estimasi awal, bukan penawaran final. Harga akhir ditetapkan setelah
                  sesi discovery.
                </p>
              </div>

              <ol className="mt-6 grid grid-cols-2 gap-4 border-border border-t pt-5 text-xs">
                <li className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <span aria-hidden className="size-2 rounded-full bg-accent" />
                    DP 50%
                  </span>
                  <span className="text-fg-muted">
                    Sebelum perancangan antarmuka dan arsitektur dimulai.
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <span aria-hidden className="size-2 rounded-full bg-green" />
                    Pelunasan 50%
                  </span>
                  <span className="text-fg-muted">
                    Setelah staging di-review dan siap serah terima.
                  </span>
                </li>
              </ol>

              <a
                href={estimateUrl(waNumber, config)}
                target="_blank"
                rel="noopener"
                onClick={onWhatsApp}
                className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}
              >
                <MessageCircle data-icon="inline-start" strokeWidth={1.75} />
                {opening ? "Membuka WhatsApp…" : "Konsultasikan Estimasi Ini via WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bar total mobile; ketuk untuk melihat rincian */}
      <button
        type="button"
        onClick={() => summary.current && scrollToElement(summary.current)}
        className={cx(
          "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-border border-t bg-surface px-4 py-3 transition-transform duration-300 lg:hidden",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showBar}
        tabIndex={showBar ? undefined : -1}
      >
        <span className="text-fg-muted text-sm">Total estimasi</span>
        <span className="font-bold font-heading text-lg tabular-nums">{formatRupiah(total)}</span>
      </button>
    </div>
  );
}
