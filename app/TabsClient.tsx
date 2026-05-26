"use client";
import { useState } from "react";

type Equipo = {
  id: number;
  nombre: string;
  PJ: number;
  PG: number;
  PE: number;
  PP: number;
  GF: number;
  GC: number;
  DG: number;
  PTS: number;
};

type Partido = {
  id: number;
  fecha: string;
  goles_local: number | null;
  goles_visitante: number | null;
  local: { nombre: string };
  visitante: { nombre: string };
  serie: { nombre: string };
};

export default function TabsClient({
  posiciones,
  fechas,
  porFecha,
  fechasFixture,
  porFechaFixture,
}: {
  posiciones: { id: number; nombre: string; posiciones: Equipo[] }[];
  fechas: string[];
  porFecha: Record<string, Record<string, Partido[]>>;
  fechasFixture: string[];
  porFechaFixture: Record<string, Record<string, Partido[]>>;
}) {
  const [tab, setTab] = useState<"posiciones" | "resultados" | "fixture">(
    "posiciones",
  );

  function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
        <div className="bg-green-700 rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Dentro del Juego</h1>
          <p className="text-xs text-gray-400">
            Liga Misionera Del Sur · Temporada 2026
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-700 pb-0">
        {(["posiciones", "resultados", "fixture"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-t-lg capitalize font-medium transition-colors ${
              tab === t
                ? "bg-green-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {t === "posiciones"
              ? "Posiciones"
              : t === "resultados"
                ? "Resultados"
                : "Fixture"}
          </button>
        ))}
      </div>

      {/* Posiciones */}
      {tab === "posiciones" && (
        <div className="space-y-8">
          {posiciones.map((serie) => (
            <section key={serie.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                  {serie.nombre}
                </h2>
              </div>
              <div className="rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-800 text-gray-400">
                      <th className="p-2 text-center w-6">#</th>
                      <th className="p-2 text-left">Equipo</th>
                      <th className="p-2 text-center">PJ</th>
                      <th className="p-2 text-center">PG</th>
                      <th className="p-2 text-center">PE</th>
                      <th className="p-2 text-center">PP</th>
                      <th className="p-2 text-center">GF</th>
                      <th className="p-2 text-center">GC</th>
                      <th className="p-2 text-center">DG</th>
                      <th className="p-2 text-center font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serie.posiciones.map((equipo, i) => (
                      <tr
                        key={equipo.id}
                        className={`border-t border-gray-700 ${
                          i === 0
                            ? "bg-green-900/30 text-green-300"
                            : "text-gray-300 hover:bg-gray-800/50"
                        }`}
                      >
                        <td className="p-2 text-center text-gray-500">
                          {i + 1}
                        </td>
                        <td className="p-2 font-medium">{equipo.nombre}</td>
                        <td className="p-2 text-center">{equipo.PJ}</td>
                        <td className="p-2 text-center">{equipo.PG}</td>
                        <td className="p-2 text-center">{equipo.PE}</td>
                        <td className="p-2 text-center">{equipo.PP}</td>
                        <td className="p-2 text-center">{equipo.GF}</td>
                        <td className="p-2 text-center">{equipo.GC}</td>
                        <td className="p-2 text-center">{equipo.DG}</td>
                        <td
                          className={`p-2 text-center font-bold ${i === 0 ? "text-green-400" : "text-green-500"}`}
                        >
                          {equipo.PTS}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Resultados */}
      {tab === "resultados" && (
        <div className="space-y-6">
          {fechas.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No hay resultados cargados aún.
            </p>
          )}
          {fechas.map((fecha) => (
            <div key={fecha}>
              <div className="flex items-center gap-2 mb-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  {formatFecha(fecha)}
                </span>
              </div>
              <div className="rounded-xl border border-gray-700 overflow-hidden">
                {Object.entries(porFecha[fecha])
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([serie, partidos], si) => (
                    <div key={serie}>
                      <div
                        className={`px-3 py-1.5 text-xs font-semibold text-green-400 bg-green-900/20 ${si > 0 ? "border-t border-gray-700" : ""}`}
                      >
                        {serie}
                      </div>
                      {partidos.map((p, pi) => (
                        <div
                          key={p.id}
                          className={`flex items-center px-3 py-3 gap-2 ${pi > 0 || si >= 0 ? "border-t border-gray-700/50" : ""} hover:bg-gray-800/40`}
                        >
                          <span className="flex-1 text-right text-sm font-medium text-gray-200">
                            {p.local?.nombre}
                          </span>
                          <span className="text-green-400 font-bold text-base min-w-[52px] text-center bg-gray-800 rounded-lg px-2 py-0.5">
                            {p.goles_local} – {p.goles_visitante}
                          </span>
                          <span className="flex-1 text-left text-sm font-medium text-gray-200">
                            {p.visitante?.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixture */}
      {tab === "fixture" && (
        <div className="space-y-6">
          {fechasFixture.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No hay partidos programados.
            </p>
          )}
          {fechasFixture.map((fecha) => (
            <div key={fecha}>
              <div className="flex items-center gap-2 mb-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  {formatFecha(fecha)}
                </span>
              </div>
              <div className="rounded-xl border border-gray-700 overflow-hidden">
                {Object.entries(porFechaFixture[fecha])
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([serie, partidos], si) => (
                    <div key={serie}>
                      <div
                        className={`px-3 py-1.5 text-xs font-semibold text-green-400 bg-green-900/20 ${si > 0 ? "border-t border-gray-700" : ""}`}
                      >
                        {serie}
                      </div>
                      {partidos.map((p, pi) => (
                        <div
                          key={p.id}
                          className={`flex items-center px-3 py-3 gap-2 ${pi > 0 || si >= 0 ? "border-t border-gray-700/50" : ""} hover:bg-gray-800/40`}
                        >
                          <span className="flex-1 text-right text-sm font-medium text-gray-200">
                            {p.local?.nombre}
                          </span>
                          <span className="text-gray-500 font-bold text-base min-w-[52px] text-center bg-gray-800 rounded-lg px-2 py-0.5">
                            vs
                          </span>
                          <span className="flex-1 text-left text-sm font-medium text-gray-200">
                            {p.visitante?.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
