import React, { useMemo, useState } from 'react';
import { DASHBOARD_COPY, type VisitsDay } from '../../data/dashboard';

interface VisitsChartProps {
  days: VisitsDay[];
}

interface HoveredBar {
  x: number;
  y: number;
  label: string;
  value: number;
}

/** Une seule série : pas de légende, le titre nomme la mesure. */
export const VisitsChart: React.FC<VisitsChartProps> = ({ days }) => {
  const [hovered, setHovered] = useState<HoveredBar | null>(null);

  const { max, totals, grandTotal } = useMemo(() => {
    const all = days.flatMap((day) => day.values);
    return {
      max: Math.max(1, ...all),
      totals: days.map((day) => day.values.reduce((sum, value) => sum + value, 0)),
      grandTotal: all.reduce((sum, value) => sum + value, 0),
    };
  }, [days]);

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.08] sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">{DASHBOARD_COPY.chart.title}</h2>
      <div className="mt-4 h-px bg-black/[0.06]" />

      <figure className="mt-6">
        <div
          className="relative h-56 sm:h-64"
          role="img"
          aria-label={`${DASHBOARD_COPY.chart.title} : ${grandTotal} visites au total, réparties par tranche horaire.`}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Grille de fond, volontairement discrète */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="absolute inset-x-0 h-px bg-black/[0.06]"
              style={{ bottom: `${ratio * 100}%` }}
              aria-hidden="true"
            />
          ))}

          <div className="relative flex h-full items-end gap-3 sm:gap-5">
            {days.map((day) => (
              <div key={day.label} className="flex h-full flex-1 items-end gap-[2px]">
                {day.values.map((value, index) => {
                  const height = (value / max) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 rounded-t-[3px] bg-accent-blueDark transition-opacity hover:opacity-75"
                      style={{ height: `${height}%` }}
                      onMouseEnter={(event) => {
                        const bar = event.currentTarget;
                        setHovered({
                          x: bar.offsetLeft + bar.offsetWidth / 2,
                          y: bar.offsetTop,
                          label: day.label,
                          value,
                        });
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {hovered && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white shadow-card"
              style={{ left: hovered.x, top: hovered.y }}
            >
              {hovered.label} — {hovered.value} visites
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-3 sm:gap-5">
          {days.map((day) => (
            <div key={day.label} className="flex-1 text-center text-xs text-ink-muted">
              {day.label}
            </div>
          ))}
        </div>
      </figure>

      {/* Équivalent tabulaire pour les lecteurs d'écran */}
      <table className="sr-only">
        <caption>{DASHBOARD_COPY.chart.title}</caption>
        <thead>
          <tr>
            <th scope="col">Jour</th>
            <th scope="col">Visites</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={day.label}>
              <th scope="row">{day.label}</th>
              <td>{totals[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
