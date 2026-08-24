"use client";
import React from "react";

type PartidoFinal = {
  id: number;
  ronda: string;
  partido: number;
  jugado: boolean;
  goles_local: number | null;
  goles_visitante: number | null;
  penales_local: number | null;
  penales_visitante: number | null;
  fecha: string | null;
  equipo_local: { nombre: string; escudo: string | null } | null;
  equipo_visitante: { nombre: string; escudo: string | null } | null;
};

export default function BracketFinal({
  partidos,
}: {
  partidos: PartidoFinal[];
}) {
  const sf1 = partidos
    .filter((p) => p.ronda === "semifinal1")
    .sort((a, b) => a.partido - b.partido);
  const sf2 = partidos
    .filter((p) => p.ronda === "semifinal2")
    .sort((a, b) => a.partido - b.partido);
  const final = partidos
    .filter((p) => p.ronda === "final")
    .sort((a, b) => a.partido - b.partido);

  function resultado(p: PartidoFinal) {
    if (!p.jugado) return "—";
    let r = `${p.goles_local} - ${p.goles_visitante}`;
    if (p.penales_local !== null && p.penales_visitante !== null) {
      r += ` (${p.penales_local}-${p.penales_visitante} pen)`;
    }
    return r;
  }

  const MatchCard = ({
    partidos,
    titulo,
  }: {
    partidos: PartidoFinal[];
    titulo: string;
  }) => (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "0.5px solid rgba(255,255,255,0.12)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {partidos.map((p, i) => (
        <div key={p.id}>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              padding: "4px 10px",
              background: "rgba(0,0,0,0.2)",
              borderTop: i > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
              letterSpacing: "1px",
            }}
          >
            Partido {p.partido}{" "}
            {p.fecha ? `· ${p.fecha.split("-").reverse().join("/")}` : ""}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 10px",
              gap: "6px",
              borderTop: "0.5px solid rgba(255,255,255,0.06)",
            }}
          >
            {p.equipo_local?.escudo && (
              <img
                src={p.equipo_local.escudo}
                alt=""
                width={16}
                height={16}
                style={{ objectFit: "contain", flexShrink: 0 }}
              />
            )}
            <span
              style={{
                flex: 1,
                fontSize: "12px",
                fontWeight: 500,
                color: p.equipo_local
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
              }}
            >
              {p.equipo_local?.nombre ?? "Por definir"}
            </span>
            {p.jugado && (
              <span
                style={{ fontSize: "11px", color: "#4ade80", fontWeight: 500 }}
              >
                {resultado(p)}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 10px",
              gap: "6px",
              borderTop: "0.5px solid rgba(255,255,255,0.06)",
            }}
          >
            {p.equipo_visitante?.escudo && (
              <img
                src={p.equipo_visitante.escudo}
                alt=""
                width={16}
                height={16}
                style={{ objectFit: "contain", flexShrink: 0 }}
              />
            )}
            <span
              style={{
                flex: 1,
                fontSize: "12px",
                fontWeight: 500,
                color: p.equipo_visitante
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
              }}
            >
              {p.equipo_visitante?.nombre ?? "Por definir"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}
        >
          Fase Final
        </span>
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "rgba(255,255,255,0.1)",
          }}
        ></div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 32px 1fr 32px 1fr",
          gap: "0",
          alignItems: "center",
        }}
      >
        {/* Semifinales */}
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            SEMIFINALES
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <MatchCard partidos={sf1} titulo="SF1" />
            <MatchCard partidos={sf2} titulo="SF2" />
          </div>
        </div>

        {/* Conector izquierdo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="32" height="120" viewBox="0 0 32 120" fill="none">
            <path
              d="M0 30 H16 V90 H0"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
              fill="none"
            />
            <line
              x1="16"
              y1="60"
              x2="32"
              y2="60"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Final */}
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              textAlign: "center",
              marginBottom: "4px",
            }}
          >
            FINAL
          </p>
          <div
            style={{
              textAlign: "center",
              fontSize: "28px",
              marginBottom: "6px",
            }}
          >
            🏆
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "0.5px solid rgba(52,211,153,0.3)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {final.map((p, i) => (
              <div key={p.id}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.35)",
                    padding: "4px 10px",
                    background: "rgba(0,0,0,0.2)",
                    borderTop:
                      i > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                    letterSpacing: "1px",
                  }}
                >
                  Partido {p.partido}{" "}
                  {p.fecha ? `· ${p.fecha.split("-").reverse().join("/")}` : ""}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    gap: "6px",
                    borderTop: "0.5px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {p.equipo_local?.escudo && (
                    <img
                      src={p.equipo_local.escudo}
                      alt=""
                      width={16}
                      height={16}
                      style={{ objectFit: "contain", flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      fontWeight: 500,
                      color: p.equipo_local
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {p.equipo_local?.nombre ?? "Por definir"}
                  </span>
                  {p.jugado && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#4ade80",
                        fontWeight: 500,
                      }}
                    >
                      {resultado(p)}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    gap: "6px",
                    borderTop: "0.5px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {p.equipo_visitante?.escudo && (
                    <img
                      src={p.equipo_visitante.escudo}
                      alt=""
                      width={16}
                      height={16}
                      style={{ objectFit: "contain", flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      fontWeight: 500,
                      color: p.equipo_visitante
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {p.equipo_visitante?.nombre ?? "Por definir"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conector derecho */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
            <line
              x1="0"
              y1="20"
              x2="32"
              y2="20"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Campeón */}
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            CAMPEÓN
          </p>
          <div
            style={{
              textAlign: "center",
              padding: "1.5rem 1rem",
              background: "rgba(255,255,255,0.07)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🥇</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              Por definir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
