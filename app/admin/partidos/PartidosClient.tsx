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
  goles_local: number;
  goles_visitante: number;
  local: { nombre: string };
  visitante: { nombre: string };
  serie: { nombre: string };
};

export default function PartidosClient() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [mensaje, setMensaje] = useState("");

  async function cargarPartidos() {
    const { data } = await supabase
      .from("partidos")
      .select(
        `
        id, fecha, goles_local, goles_visitante,
        local:local_id(nombre),
        visitante:visitante_id(nombre),
        serie:serie_id(nombre)
      `,
      )
      .eq("jugado", true)
      .order("fecha", { ascending: false });

    if (data) setPartidos(data as unknown as Partido[]);
  }

  useEffect(() => {
    cargarPartidos();
  }, []);

  async function eliminar(id: number) {
    if (!confirm("¿Seguro que querés eliminar este partido?")) return;
    await supabase.from("partidos").delete().eq("id", id);
    setMensaje("🗑️ Partido eliminado.");
    cargarPartidos();
  }

  async function guardarEdicion(id: number) {
    await supabase
      .from("partidos")
      .update({ goles_local: golesLocal, goles_visitante: golesVisitante })
      .eq("id", id);
    setEditandoId(null);
    setMensaje("✅ Partido actualizado.");
    cargarPartidos();
  }

  function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  }

  function iniciarEdicion(p: Partido) {
    setEditandoId(p.id);
    setGolesLocal(p.goles_local);
    setGolesVisitante(p.goles_visitante);
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
              <span className="text-gray-400 text-sm">
                {formatFecha(p.fecha)}
              </span>
            </div>

            {editandoId === p.id ? (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-white text-sm w-2/5 text-right">
                  {p.local?.nombre}
                </span>
                <input
                  type="number"
                  min={0}
                  value={golesLocal}
                  onChange={(e) => setGolesLocal(Number(e.target.value))}
                  className="w-12 text-center bg-gray-700 text-white rounded p-1"
                />
                <span className="text-white">-</span>
                <input
                  type="number"
                  min={0}
                  value={golesVisitante}
                  onChange={(e) => setGolesVisitante(Number(e.target.value))}
                  className="w-12 text-center bg-gray-700 text-white rounded p-1"
                />
                <span className="text-white text-sm w-2/5">
                  {p.visitante?.nombre}
                </span>
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
            ) : (
              <div className="flex items-center justify-between mt-2">
                <span className="text-white font-medium text-right w-2/5">
                  {p.local?.nombre}
                </span>
                <span className="text-green-400 font-bold text-xl mx-3">
                  {p.goles_local} - {p.goles_visitante}
                </span>
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
