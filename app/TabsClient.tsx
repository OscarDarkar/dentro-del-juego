"use client";
import { useState } from "react";
import React from "react";

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

  const bannerStyle: React.CSSProperties = {
    background: "rgba(10,15,46,0.85)",
    borderTop: "0.5px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-6 ">
      {/* Header */}
      {/* Navbar */}
      <div
        className="flex items-center justify-between mb-5 pb-4"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 120 120"
            className="flex-shrink-0"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="#0d1b4b"
              stroke="#4ade80"
              strokeWidth="2.5"
            />
            <circle
              cx="60"
              cy="60"
              r="38"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <line
              x1="60"
              y1="8"
              x2="60"
              y2="112"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="8"
              y1="60"
              x2="112"
              y2="60"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M 20 30 Q 60 10 100 30"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M 20 90 Q 60 110 100 90"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <circle cx="60" cy="60" r="5" fill="#4ade80" />
          </svg>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
              DENTRO{" "}
              <span style={{ color: "#4ade80", fontWeight: 300 }}>
                DEL JUEGO
              </span>
            </h1>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p
            className="text-xs font-semibold"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Temporada 2026
          </p>
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}
          >
            Liga Misionera del Sur
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.12)" }}
      >
        {(["posiciones", "resultados", "fixture"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs sm:text-sm rounded-t-lg font-medium transition-colors"
            style={
              tab === t
                ? {
                    background: "rgba(34,197,94,0.25)",
                    color: "#4ade80",
                    border: "0.5px solid rgba(34,197,94,0.4)",
                  }
                : {
                    color: "rgba(255,255,255,0.35)",
                    border: "0.5px solid transparent",
                  }
            }
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
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#4ade80" }}
                ></div>
                <h2
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {serie.nombre}
                </h2>
              </div>
              <div
                className="rounded-xl overflow-x-auto"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                <table className="w-full text-xs min-w-[340px]">
                  <thead>
                    <tr
                      style={{ background: "rgba(0,0,0,0.2)" }}
                      className="text-gray-400"
                    >
                      <th className="p-2 text-center w-6">#</th>
                      <th className="p-2 text-left">Equipo</th>
                      <th className="p-2 text-center">PJ</th>
                      <th className="p-2 text-center">PG</th>
                      <th className="p-2 text-center">PE</th>
                      <th className="p-2 text-center">PP</th>
                      <th className="p-2 text-center hidden sm:table-cell">
                        GF
                      </th>
                      <th className="p-2 text-center hidden sm:table-cell">
                        GC
                      </th>
                      <th className="p-2 text-center">DG</th>
                      <th className="p-2 text-center font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serie.posiciones.map((equipo, i) => (
                      <tr
                        key={equipo.id}
                        style={{
                          borderTop: "0.5px solid rgba(255,255,255,0.07)",
                          background:
                            i === 0 ? "rgba(52,211,153,0.1)" : "transparent",
                        }}
                        className={i === 0 ? "text-green-300" : "text-gray-300"}
                      >
                        <td
                          className="p-2 text-center"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {i + 1}
                        </td>
                        <td className="p-2 font-medium truncate max-w-[100px] sm:max-w-none">
                          {equipo.nombre}
                        </td>
                        <td className="p-2 text-center">{equipo.PJ}</td>
                        <td className="p-2 text-center">{equipo.PG}</td>
                        <td className="p-2 text-center">{equipo.PE}</td>
                        <td className="p-2 text-center">{equipo.PP}</td>
                        <td className="p-2 text-center hidden sm:table-cell">
                          {equipo.GF}
                        </td>
                        <td className="p-2 text-center hidden sm:table-cell">
                          {equipo.GC}
                        </td>
                        <td className="p-2 text-center">{equipo.DG}</td>
                        <td
                          className="p-2 text-center font-bold"
                          style={{ color: "#4ade80" }}
                        >
                          {equipo.PTS}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p
                className="text-xs mt-1 sm:hidden"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                * GF y GC visibles en pantalla grande
              </p>
            </section>
          ))}
        </div>
      )}

      {/* Resultados */}
      {tab === "resultados" && (
        <div className="space-y-6">
          {fechas.length === 0 && (
            <p
              className="text-center py-8"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
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
                  style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {formatFecha(fecha)}
                </span>
              </div>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {Object.entries(porFecha[fecha])
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([serie, partidos], si) => (
                    <div key={serie}>
                      <div
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{
                          color: "#4ade80",
                          background: "rgba(52,211,153,0.1)",
                          borderTop:
                            si > 0
                              ? "0.5px solid rgba(255,255,255,0.08)"
                              : "none",
                        }}
                      >
                        {serie}
                      </div>
                      {partidos.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center px-2 sm:px-3 py-3 gap-1 sm:gap-2"
                          style={{
                            borderTop: "0.5px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className="flex-1 text-right text-xs sm:text-sm font-medium text-gray-200 leading-tight">
                            {p.local?.nombre}
                          </span>
                          <span
                            className="font-bold text-sm sm:text-base min-w-[48px] text-center rounded-lg px-1.5 py-0.5 flex-shrink-0"
                            style={{
                              color: "#4ade80",
                              background: "rgba(0,0,0,0.2)",
                            }}
                          >
                            {p.goles_local} – {p.goles_visitante}
                          </span>
                          <span className="flex-1 text-left text-xs sm:text-sm font-medium text-gray-200 leading-tight">
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
            <p
              className="text-center py-8"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
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
                  style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {formatFecha(fecha)}
                </span>
              </div>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {Object.entries(porFechaFixture[fecha])
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([serie, partidos], si) => (
                    <div key={serie}>
                      <div
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{
                          color: "#4ade80",
                          background: "rgba(52,211,153,0.1)",
                          borderTop:
                            si > 0
                              ? "0.5px solid rgba(255,255,255,0.08)"
                              : "none",
                        }}
                      >
                        {serie}
                      </div>
                      {partidos.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center px-2 sm:px-3 py-3 gap-1 sm:gap-2"
                          style={{
                            borderTop: "0.5px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className="flex-1 text-right text-xs sm:text-sm font-medium text-gray-200 leading-tight">
                            {p.local?.nombre}
                          </span>
                          <span
                            className="font-bold text-sm sm:text-base min-w-[48px] text-center rounded-lg px-1.5 py-0.5 flex-shrink-0"
                            style={{
                              color: "rgba(255,255,255,0.3)",
                              background: "rgba(0,0,0,0.2)",
                            }}
                          >
                            vs
                          </span>
                          <span className="flex-1 text-left text-xs sm:text-sm font-medium text-gray-200 leading-tight">
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

      {/* Banner periodista */}
      <a
        href="https://www.facebook.com/leonciomartires/?locale=es_LA"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-4 px-4 text-xs mt-8 rounded-xl"
        style={bannerStyle}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#4ade80">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>
          Seguí los partidos en vivo en
        </span>
        <span className="font-semibold" style={{ color: "#4ade80" }}>
          San Patricio Portal Digital
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
