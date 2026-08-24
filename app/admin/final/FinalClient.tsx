"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { signOut } from "next-auth/react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
  equipo_local: { nombre: string } | null;
  equipo_visitante: { nombre: string } | null;
};

const RONDA_LABELS: Record<string, string> = {
  semifinal1: "Semifinal 1 (30 de Agosto vs 13 de Junio)",
  semifinal2: "Semifinal 2 (17 de Marzo vs 4 de Octubre)",
  final: "Final",
};

export default function FinalClient() {
  const [partidos, setPartidos] = useState<PartidoFinal[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [penalesLocal, setPenalesLocal] = useState<number | null>(null);
  const [penalesVisitante, setPenalesVisitante] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [jugado, setJugado] = useState(false);
  const [conPenales, setConPenales] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function cargarPartidos() {
    const { data } = await supabase
      .from("fase_final")
      .select(
        `
        id, ronda, partido, jugado, goles_local, goles_visitante,
        penales_local, penales_visitante, fecha,
        equipo_local:equipo_local_id(nombre),
        equipo_visitante:equipo_visitante_id(nombre)
      `,
      )
      .order("ronda")
      .order("partido");
    if (data) setPartidos(data as unknown as PartidoFinal[]);
  }

  useEffect(() => {
    cargarPartidos();
  }, []);

  function iniciarEdicion(p: PartidoFinal) {
    setEditandoId(p.id);
    setGolesLocal(p.goles_local ?? 0);
    setGolesVisitante(p.goles_visitante ?? 0);
    setPenalesLocal(p.penales_local ?? null);
    setPenalesVisitante(p.penales_visitante ?? null);
    setFecha(p.fecha ?? "");
    setJugado(p.jugado);
    setConPenales(p.penales_local !== null);
  }

  async function guardar(id: number) {
    const { error } = await supabase
      .from("fase_final")
      .update({
        goles_local: jugado ? golesLocal : null,
        goles_visitante: jugado ? golesVisitante : null,
        penales_local: jugado && conPenales ? penalesLocal : null,
        penales_visitante: jugado && conPenales ? penalesVisitante : null,
        fecha: fecha || null,
        jugado,
      })
      .eq("id", Number(id));

    if (error) {
      setMensaje("Error: " + error.message);
    } else {
      setMensaje("✅ Partido actualizado.");
      setEditandoId(null);
      setTimeout(() => cargarPartidos(), 500);
    }
  }

  function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  const rondasOrden = ["semifinal1", "semifinal2", "final"];
  const rondasUnicas = rondasOrden.filter((r) =>
    partidos.some((p) => p.ronda === r),
  );

  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-white">Fase Final</h1>
        <div className="flex gap-2">
          <Link
            href="/admin"
            className="bg-gray-600 hover:bg-gray-500 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded"
          >
            ← Volver
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {mensaje && (
        <p className="text-center text-sm text-yellow-300 mb-4">{mensaje}</p>
      )}

      <div className="space-y-6">
        {rondasUnicas.map((ronda) => (
          <div key={ronda}>
            <h2 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-widest">
              {RONDA_LABELS[ronda] ?? ronda}
            </h2>
            <div className="space-y-3">
              {partidos
                .filter((p) => p.ronda === ronda)
                .map((p) => (
                  <div key={p.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-xs">
                        Partido {p.partido}
                      </span>
                      <div className="flex items-center gap-2">
                        {p.fecha && (
                          <span className="text-gray-400 text-xs">
                            {formatFecha(p.fecha)}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${p.jugado ? "bg-green-900 text-green-400" : "bg-gray-700 text-gray-400"}`}
                        >
                          {p.jugado ? "Jugado" : "Pendiente"}
                        </span>
                      </div>
                    </div>

                    {editandoId === p.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs flex-1 text-right">
                            {p.equipo_local?.nombre ?? "Por definir"}
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={golesLocal}
                            onChange={(e) =>
                              setGolesLocal(Number(e.target.value))
                            }
                            disabled={!jugado}
                            className="w-10 text-center bg-gray-700 text-white rounded p-1 text-sm disabled:opacity-40"
                          />
                          <span className="text-white">-</span>
                          <input
                            type="number"
                            min={0}
                            value={golesVisitante}
                            onChange={(e) =>
                              setGolesVisitante(Number(e.target.value))
                            }
                            disabled={!jugado}
                            className="w-10 text-center bg-gray-700 text-white rounded p-1 text-sm disabled:opacity-40"
                          />
                          <span className="text-white text-xs flex-1">
                            {p.equipo_visitante?.nombre ?? "Por definir"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-gray-400 text-xs">
                              Fecha
                            </label>
                            <input
                              type="date"
                              value={fecha}
                              onChange={(e) => setFecha(e.target.value)}
                              className="w-full mt-1 bg-gray-700 text-white rounded p-1.5 text-xs"
                            />
                          </div>
                          <div className="flex items-end pb-1.5 gap-2">
                            <label className="text-gray-400 text-xs">
                              ¿Jugado?
                            </label>
                            <input
                              type="checkbox"
                              checked={jugado}
                              onChange={(e) => setJugado(e.target.checked)}
                              className="w-4 h-4 accent-green-600"
                            />
                          </div>
                        </div>

                        {jugado && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="text-gray-400 text-xs">
                                ¿Hubo penales?
                              </label>
                              <input
                                type="checkbox"
                                checked={conPenales}
                                onChange={(e) =>
                                  setConPenales(e.target.checked)
                                }
                                className="w-4 h-4 accent-yellow-600"
                              />
                            </div>
                            {conPenales && (
                              <div className="flex items-center gap-2">
                                <span className="text-white text-xs flex-1 text-right">
                                  {p.equipo_local?.nombre ?? "Local"}
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  value={penalesLocal ?? ""}
                                  onChange={(e) =>
                                    setPenalesLocal(Number(e.target.value))
                                  }
                                  className="w-10 text-center bg-gray-700 text-yellow-300 rounded p-1 text-sm"
                                />
                                <span className="text-white text-xs">pen</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={penalesVisitante ?? ""}
                                  onChange={(e) =>
                                    setPenalesVisitante(Number(e.target.value))
                                  }
                                  className="w-10 text-center bg-gray-700 text-yellow-300 rounded p-1 text-sm"
                                />
                                <span className="text-white text-xs flex-1">
                                  {p.equipo_visitante?.nombre ?? "Visitante"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => guardar(p.id)}
                            className="flex-1 bg-green-700 hover:bg-green-600 text-white text-xs font-bold py-2 rounded"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold py-2 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-white text-xs sm:text-sm font-medium flex-1 text-right">
                          {p.equipo_local?.nombre ?? "Por definir"}
                        </span>
                        {p.jugado ? (
                          <div className="flex flex-col items-center">
                            <span className="text-green-400 font-bold text-sm min-w-[48px] text-center bg-gray-700 rounded-lg px-1.5 py-0.5">
                              {p.goles_local} - {p.goles_visitante}
                            </span>
                            {p.penales_local !== null && (
                              <span className="text-yellow-400 text-xs mt-0.5">
                                ({p.penales_local}-{p.penales_visitante} pen)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 font-bold text-sm min-w-[44px] text-center bg-gray-700 rounded-lg px-1.5 py-0.5">
                            vs
                          </span>
                        )}
                        <span className="text-white text-xs sm:text-sm font-medium flex-1">
                          {p.equipo_visitante?.nombre ?? "Por definir"}
                        </span>
                        <button
                          onClick={() => iniciarEdicion(p)}
                          className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded flex-shrink-0"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
