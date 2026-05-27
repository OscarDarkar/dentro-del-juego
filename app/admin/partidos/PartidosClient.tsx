"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { signOut } from "next-auth/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Partido = {
  id: number;
  fecha: string;
  goles_local: number | null;
  goles_visitante: number | null;
  jugado: boolean;
  local: { nombre: string };
  visitante: { nombre: string };
  serie: { nombre: string };
};

export default function PartidosClient() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [fecha, setFecha] = useState("");
  const [jugado, setJugado] = useState(true);
  const [mensaje, setMensaje] = useState("");

  async function cargarPartidos() {
    const { data } = await supabase
      .from("partidos")
      .select(
        `
        id, fecha, goles_local, goles_visitante, jugado,
        local:local_id(nombre),
        visitante:visitante_id(nombre),
        serie:serie_id(nombre)
      `,
      )
      .order("fecha", { ascending: false });

    if (data) setPartidos(data as unknown as Partido[]);
  }

  useEffect(() => {
    cargarPartidos();
  }, []);

  async function eliminar(id: number) {
    if (!confirm("¿Seguro que querés eliminar este partido?")) return;
    const { error } = await supabase
      .from("partidos")
      .delete()
      .eq("id", Number(id));
    console.log("Error eliminar:", error);
    setMensaje("🗑️ Partido eliminado.");
    setTimeout(() => cargarPartidos(), 500);
  }

  async function guardarEdicion(id: number) {
    const { data, error } = await supabase
      .from("partidos")
      .update({
        goles_local: jugado ? golesLocal : null,
        goles_visitante: jugado ? golesVisitante : null,
        fecha,
        jugado,
      })
      .eq("id", Number(id))
      .select();
    console.log("Resultado:", data, error);
    setEditandoId(null);
    setMensaje("✅ Partido actualizado.");
    setTimeout(() => cargarPartidos(), 500);
  }

  function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  function iniciarEdicion(p: Partido) {
    setEditandoId(p.id);
    setGolesLocal(p.goles_local ?? 0);
    setGolesVisitante(p.goles_visitante ?? 0);
    setFecha(p.fecha);
    setJugado(p.jugado);
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Partidos cargados</h1>
        <div className="flex gap-2">
          <Link
            href="/admin"
            className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold px-4 py-2 rounded"
          >
            ← Volver
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-700 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {mensaje && (
        <p className="text-center text-sm text-yellow-300 mb-4">{mensaje}</p>
      )}

      <div className="space-y-3">
        {partidos.length === 0 && (
          <p className="text-gray-400 text-center">No hay partidos cargados.</p>
        )}
        {partidos.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-400 text-sm font-semibold">
                {p.serie?.nombre}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">
                  {formatFecha(p.fecha)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${p.jugado ? "bg-green-900 text-green-400" : "bg-gray-700 text-gray-400"}`}
                >
                  {p.jugado ? "Jugado" : "Pendiente"}
                </span>
              </div>
            </div>

            {editandoId === p.id ? (
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm w-2/5 text-right">
                    {p.local?.nombre}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={golesLocal}
                    onChange={(e) => setGolesLocal(Number(e.target.value))}
                    disabled={!jugado}
                    className="w-12 text-center bg-gray-700 text-white rounded p-1 disabled:opacity-40"
                  />
                  <span className="text-white">-</span>
                  <input
                    type="number"
                    min={0}
                    value={golesVisitante}
                    onChange={(e) => setGolesVisitante(Number(e.target.value))}
                    disabled={!jugado}
                    className="w-12 text-center bg-gray-700 text-white rounded p-1 disabled:opacity-40"
                  />
                  <span className="text-white text-sm w-2/5">
                    {p.visitante?.nombre}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-gray-300 text-sm">Fecha:</label>
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="bg-gray-700 text-white rounded p-1 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-300 text-sm">¿Jugado?</label>
                    <input
                      type="checkbox"
                      checked={jugado}
                      onChange={(e) => setJugado(e.target.checked)}
                      className="w-4 h-4 accent-green-600"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => guardarEdicion(p.id)}
                    className="bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="bg-gray-600 hover:bg-gray-500 text-white text-xs px-3 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2">
                <span className="text-white font-medium text-right w-2/5">
                  {p.local?.nombre}
                </span>
                {p.jugado ? (
                  <span className="text-green-400 font-bold text-xl mx-3">
                    {p.goles_local} - {p.goles_visitante}
                  </span>
                ) : (
                  <span className="text-gray-500 font-bold text-xl mx-3">
                    vs
                  </span>
                )}
                <span className="text-white font-medium w-2/5">
                  {p.visitante?.nombre}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => iniciarEdicion(p)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(p.id)}
                    className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
