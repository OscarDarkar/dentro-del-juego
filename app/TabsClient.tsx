"use client";
import { useState } from "react";
import React from "react";

type Equipo = {
  id: number;
  nombre: string;
  escudo: string | null;
  posicion_anterior: number | null;
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
  jornada: number | null;
  goles_local: number | null;
  goles_visitante: number | null;
  local: { nombre: string; escudo: string | null };
  visitante: { nombre: string; escudo: string | null };
  serie: { nombre: string };
};

type JornadaData = {
  fecha: string;
  series: Record<string, Partido[]>;
};

export default function TabsClient({
  bracket,
  posiciones,
  jornadas,
  porJornada,
  jornadasFixture,
  porJornadaFixture,
  posicionesFase1,
  jornadasFase1,
  porJornadaFase1,
  posicionesFase2,
  jornadasFase2,
  porJornadaFase2,
}: {
  bracket: React.ReactNode;
  posiciones: { id: number; nombre: string; posiciones: Equipo[] }[];
  jornadas: string[];
  porJornada: Record<string, JornadaData>;
  jornadasFixture: string[];
  porJornadaFixture: Record<string, JornadaData>;
  posicionesFase1: { id: number; nombre: string; posiciones: Equipo[] }[];
  jornadasFase1: string[];
  porJornadaFase1: Record<string, JornadaData>;
  posicionesFase2: { id: number; nombre: string; posiciones: Equipo[] }[];
  jornadasFase2: string[];
  porJornadaFase2: Record<string, JornadaData>;
}) {
  const [tab, setTab] = useState<
    "posiciones" | "resultados" | "fixture" | "fase2" | "fase1"
  >("posiciones");

  function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  const bannerStyle: React.CSSProperties = {
    background: "rgba(10,15,46,0.85)",
    borderTop: "0.5px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
  };

  function getTendencia(posActual: number, posAnterior: number | null) {
    if (posAnterior === null)
      return <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>;
    if (posActual < posAnterior)
      return <span style={{ color: "#4ade80" }}>▲</span>;
    if (posActual > posAnterior)
      return <span style={{ color: "#f87171" }}>▼</span>;
    return <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>;
  }

  async function compartirTabla(serieNombre: string, posiciones: Equipo[]) {
    const texto = posiciones
      .map((e, i) => `${i + 1}. ${e.nombre} - ${e.PTS} pts`)
      .join("\n");
    const mensaje = `⚽ *${serieNombre} - Liga Misionera Del Sur*\n\n${texto}\n\n📱 Seguí la LMS en:\nhttps://dentro-del-juego-five.vercel.app`;
    if (navigator.share) {
      await navigator.share({ text: mensaje });
    } else {
      await navigator.clipboard.writeText(mensaje);
      alert("¡Tabla copiada al portapapeles!");
    }
  }

  const BannerInstagram = () => (
    <a
      href="https://www.instagram.com/_oscarruizd/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "0.5px solid rgba(195,100,255,0.3)",
        background: "rgba(195,100,255,0.06)",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "rgba(195,100,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c864ff"
          strokeWidth="2"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="#c864ff" stroke="none" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#c864ff",
            fontFamily: "sans-serif",
          }}
        >
          ¿Querés anunciar tu negocio aquí?
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "sans-serif",
          }}
        >
          Contactanos por Instagram · @_oscarruizd
        </div>
      </div>
      <div
        style={{
          fontSize: "10px",
          color: "rgba(195,100,255,0.6)",
          fontFamily: "sans-serif",
          border: "0.5px solid rgba(195,100,255,0.3)",
          padding: "4px 10px",
          borderRadius: "6px",
          flexShrink: 0,
        }}
      >
        Contactar
      </div>
    </a>
  );

  const TablaPosiciones = ({
    series,
  }: {
    series: { id: number; nombre: string; posiciones: Equipo[] }[];
  }) => (
    <div className="space-y-6">
      {series.map((serie, index) => (
        <React.Fragment key={serie.id}>
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
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
              <button
                onClick={() => compartirTabla(serie.nombre, serie.posiciones)}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#4ade80",
                  border: "0.5px solid rgba(34,197,94,0.3)",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Compartir
              </button>
            </div>
            <div
              className="rounded-xl overflow-x-auto"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              <table className="w-full text-xs" style={{ minWidth: "500px" }}>
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
                    <th className="p-2 text-center">PTS</th>
                    <th className="p-2 text-center">GF</th>
                    <th className="p-2 text-center">GC</th>
                    <th className="p-2 text-center">DG</th>
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
                        <div className="flex flex-col items-center">
                          <span>{i + 1}</span>
                          <span className="text-xs">
                            {getTendencia(i + 1, equipo.posicion_anterior)}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 font-medium truncate max-w-[100px] sm:max-w-none left-0 z-10 flex items-center gap-2">
                        <img
                          src={equipo.escudo ?? "/escudos/generico.svg"}
                          alt={equipo.nombre}
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                        {equipo.nombre}
                      </td>
                      <td className="p-2 text-center">{equipo.PJ}</td>
                      <td className="p-2 text-center">{equipo.PG}</td>
                      <td className="p-2 text-center">{equipo.PE}</td>
                      <td className="p-2 text-center">{equipo.PP}</td>
                      <td className="p-2 text-center">{equipo.PTS}</td>
                      <td className="p-2 text-center">{equipo.GF}</td>
                      <td className="p-2 text-center">{equipo.GC}</td>
                      <td className="p-2 text-center">{equipo.DG}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {index === 0 && <BannerInstagram />}
        </React.Fragment>
      ))}
      <BannerInstagram />
    </div>
  );

  const TablaResultados = ({
    jornadas,
    porJornada,
  }: {
    jornadas: string[];
    porJornada: Record<string, JornadaData>;
  }) => (
    <div className="space-y-6">
      {jornadas.length === 0 && (
        <p
          className="text-center py-8"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          No hay resultados cargados aún.
        </p>
      )}
      {jornadas.map((jornada) => (
        <div key={jornada}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: "#4ade80" }}>
              Fecha {jornada}
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {formatFecha(porJornada[jornada].fecha)}
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
            {Object.entries(porJornada[jornada].series)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([serie, partidos], si) => (
                <div key={serie}>
                  <div
                    className="px-3 py-1.5 text-xs font-semibold"
                    style={{
                      color: "#4ade80",
                      background: "rgba(52,211,153,0.1)",
                      borderTop:
                        si > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
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
                      <div className="flex-1 flex items-center justify-end gap-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-200 leading-tight text-right">
                          {p.local?.nombre}
                        </span>
                        <img
                          src={p.local?.escudo ?? "/escudos/generico.svg"}
                          alt={p.local?.nombre}
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                      </div>
                      <span
                        className="font-bold text-sm sm:text-base min-w-[48px] text-center rounded-lg px-1.5 py-0.5 flex-shrink-0"
                        style={{
                          color: "#4ade80",
                          background: "rgba(0,0,0,0.2)",
                        }}
                      >
                        {p.goles_local} - {p.goles_visitante}
                      </span>
                      <div className="flex-1 flex items-center justify-start gap-1">
                        <img
                          src={p.visitante?.escudo ?? "/escudos/generico.svg"}
                          alt={p.visitante?.nombre}
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-200 leading-tight">
                          {p.visitante?.nombre}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const TablaFixture = ({
    jornadas,
    porJornada,
  }: {
    jornadas: string[];
    porJornada: Record<string, JornadaData>;
  }) => (
    <div className="space-y-6">
      {jornadas.length === 0 && (
        <p
          className="text-center py-8"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          No hay partidos programados.
        </p>
      )}
      {jornadas.map((jornada) => (
        <div key={jornada}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: "#4ade80" }}>
              Fecha {jornada}
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {formatFecha(porJornada[jornada].fecha)}
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
            {Object.entries(porJornada[jornada].series)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([serie, partidos], si) => (
                <div key={serie}>
                  <div
                    className="px-3 py-1.5 text-xs font-semibold"
                    style={{
                      color: "#4ade80",
                      background: "rgba(52,211,153,0.1)",
                      borderTop:
                        si > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
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
                      <div className="flex-1 flex items-center justify-end gap-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-200 leading-tight text-right">
                          {p.local?.nombre}
                        </span>
                        <img
                          src={p.local?.escudo ?? "/escudos/generico.svg"}
                          alt={p.local?.nombre}
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                      </div>
                      <span
                        className="font-bold text-sm sm:text-base min-w-[48px] text-center rounded-lg px-1.5 py-0.5 flex-shrink-0"
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          background: "rgba(0,0,0,0.2)",
                        }}
                      >
                        vs
                      </span>
                      <div className="flex-1 flex items-center justify-start gap-1">
                        <img
                          src={p.visitante?.escudo ?? "/escudos/generico.svg"}
                          alt={p.visitante?.nombre}
                          width={20}
                          height={20}
                          className="object-contain flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-200 leading-tight">
                          {p.visitante?.nombre}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-6">
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
        <div className="flex items-center gap-2">
          <img
            src="/lms.png"
            alt="Liga Misionera del Sur"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="text-right">
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
      </div>

      {/* Bracket fase final */}
      {bracket}

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5 flex-wrap"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.12)" }}
      >
        {(
          ["posiciones", "resultados", "fixture", "fase2", "fase1"] as const
        ).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="py-2 px-3 text-xs sm:text-sm rounded-t-lg font-medium transition-colors"
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
                : t === "fixture"
                  ? "Fixture"
                  : t === "fase2"
                    ? "Fase 2"
                    : "Fase 1"}
          </button>
        ))}
      </div>

      {/* Posiciones fase final */}
      {tab === "posiciones" && (
        <div className="space-y-6">
          <BannerInstagram />
          <TablaPosiciones series={posiciones} />
        </div>
      )}

      {/* Resultados fase final */}
      {tab === "resultados" && (
        <TablaResultados jornadas={jornadas} porJornada={porJornada} />
      )}

      {/* Fixture fase final */}
      {tab === "fixture" && (
        <TablaFixture
          jornadas={jornadasFixture}
          porJornada={porJornadaFixture}
        />
      )}

      {/* Fase 2 */}
      {tab === "fase2" && (
        <div className="space-y-6">
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "0.5px solid rgba(34,197,94,0.2)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "rgba(34,197,94,0.8)" }}
            >
              📋 Fase 2 — Fase de clasificación
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Resultados y posiciones de la segunda fase del torneo.
            </p>
          </div>
          <TablaPosiciones series={posicionesFase2} />
          <div className="mt-6">
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Resultados Fase 2
            </h3>
            <TablaResultados
              jornadas={jornadasFase2}
              porJornada={porJornadaFase2}
            />
          </div>
        </div>
      )}

      {/* Fase 1 */}
      {tab === "fase1" && (
        <div className="space-y-6">
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(255,165,0,0.08)",
              border: "0.5px solid rgba(255,165,0,0.2)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "rgba(255,165,0,0.8)" }}
            >
              📋 Fase 1 — Fase de grupos
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Resultados y posiciones de la primera fase del torneo.
            </p>
          </div>
          <TablaPosiciones series={posicionesFase1} />
          <div className="mt-6">
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Resultados Fase 1
            </h3>
            <TablaResultados
              jornadas={jornadasFase1}
              porJornada={porJornadaFase1}
            />
          </div>
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
