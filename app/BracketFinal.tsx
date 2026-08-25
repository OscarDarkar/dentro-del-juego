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

function formatFecha(fecha: string) {
  const [, month, day] = fecha.split("-");
  return `${day}/${month}`;
}

function ganador(p: PartidoFinal): "local" | "visitante" | null {
  if (!p.jugado) return null;
  if (p.penales_local !== null && p.penales_visitante !== null) {
    return p.penales_local > p.penales_visitante ? "local" : "visitante";
  }
  if (p.goles_local !== null && p.goles_visitante !== null) {
    if (p.goles_local > p.goles_visitante) return "local";
    if (p.goles_local < p.goles_visitante) return "visitante";
  }
  return null;
}

const TeamRow = ({
  equipo,
  goles,
  penales,
  isWinner,
  isPending,
}: {
  equipo: { nombre: string; escudo: string | null } | null;
  goles: number | null;
  penales: number | null;
  isWinner: boolean;
  isPending: boolean;
}) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    padding: "9px 12px",
    gap: "8px",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
  }}>
    <img
      src={equipo?.escudo ?? "/escudos/generico.svg"}
      alt={equipo?.nombre ?? ""}
      width={18}
      height={18}
      style={{ objectFit: "contain", flexShrink: 0 }}
    />
    <span style={{
      flex: 1,
      fontSize: "12px",
      fontWeight: 500,
      color: equipo ? (isWinner ? "#4ade80" : "rgba(255,255,255,0.85)") : "rgba(255,255,255,0.3)",
    }}>
      {equipo?.nombre ?? "Por definir"}
    </span>
    {!isPending && goles !== null && (
      <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
        <span style={{
          fontSize: "13px",
          fontWeight: 500,
          color: isWinner ? "#4ade80" : "rgba(255,255,255,0.6)",
        }}>
          {goles}
        </span>
        {penales !== null && (
          <span style={{ fontSize: "10px", color: "#fbbf24" }}>({penales})</span>
        )}
      </div>
    )}
    {isPending && (
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>—</span>
    )}
  </div>
);

const MatchCard = ({
  partidos,
  rondaLabel,
  accentBorder,
}: {
  partidos: PartidoFinal[];
  rondaLabel: string;
  accentBorder?: boolean;
}) => (
  <div style={{
    background: "rgba(255,255,255,0.07)",
    border: `0.5px solid ${accentBorder ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.12)"}`,
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "8px",
  }}>
    {partidos.map((p, i) => {
      const w = ganador(p);
      const isPending = !p.jugado;
      return (
        <div key={p.id}>
          <div style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
            padding: "4px 12px",
            background: "rgba(0,0,0,0.2)",
            borderTop: i > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
            display: "flex",
            justifyContent: "space-between",
            letterSpacing: "1px",
          }}>
            <span>{rondaLabel} · Partido {p.partido}</span>
            <span>{p.fecha ? formatFecha(p.fecha) : "Por jugar"}</span>
          </div>
          <TeamRow
            equipo={p.equipo_local}
            goles={p.goles_local}
            penales={p.penales_local}
            isWinner={w === "local"}
            isPending={isPending}
          />
          <div style={{ borderBottom: "none" }}>
            <TeamRow
              equipo={p.equipo_visitante}
              goles={p.goles_visitante}
              penales={p.penales_visitante}
              isWinner={w === "visitante"}
              isPending={isPending}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export default function BracketFinal({ partidos }: { partidos: PartidoFinal[] }) {
  const sf1 = partidos.filter((p) => p.ronda === "semifinal1").sort((a, b) => a.partido - b.partido);
  const sf2 = partidos.filter((p) => p.ronda === "semifinal2").sort((a, b) => a.partido - b.partido);
  const final = partidos.filter((p) => p.ronda === "final" && p.equipo_local !== null).sort((a, b) => a.partido - b.partido);

  const colStyle: React.CSSProperties = { flex: 1, minWidth: 0 };
  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "2px",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: "8px",
    display: "block",
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
        <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
          Fase Final
        </span>
        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.1)" }}></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr 24px 1fr", alignItems: "center" }}>

        {/* Semifinales */}
        <div style={colStyle}>
          <span style={labelStyle}>Semifinales</span>
          <MatchCard partidos={sf1} rondaLabel="SF1" />
          <MatchCard partidos={sf2} rondaLabel="SF2" accentBorder />
        </div>

        {/* Conector izquierdo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "stretch" }}>
          <svg width="24" height="100%" viewBox="0 0 24 200" preserveAspectRatio="none" fill="none">
            <path d="M0 60 H12 V140 H0" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" fill="none"/>
            <line x1="12" y1="100" x2="24" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Final */}
        <div style={colStyle}>
          <span style={labelStyle}>Final</span>
          <div style={{ textAlign: "center", fontSize: "24px", marginBottom: "6px" }}>🏆</div>
          {final.length > 0 ? (
            <MatchCard partidos={final} rondaLabel="Final" accentBorder />
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.07)",
              border: "0.5px solid rgba(52,211,153,0.2)",
              borderRadius: "10px",
              padding: "1rem",
              textAlign: "center",
            }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Por definir</span>
            </div>
          )}
        </div>

        {/* Conector derecho */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <line x1="0" y1="20" x2="24" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Campeón */}
        <div style={colStyle}>
          <span style={labelStyle}>Campeón</span>
          <div style={{
            background: "rgba(255,255,255,0.07)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: "10px",
            padding: "1rem",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🥇</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Por definir</div>
          </div>
        </div>

      </div>
    </div>
  );
}