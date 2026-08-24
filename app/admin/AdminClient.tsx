"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { signOut } from "next-auth/react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Serie = { id: number; nombre: string; fase: number };
type Equipo = { id: number; nombre: string; serie_id: number };

export default function AdminClient() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [serieId, setSerieId] = useState<number | null>(null);
  const [serieFase, setSerieFase] = useState<number>(1);
  const [localId, setLocalId] = useState<number | null>(null);
  const [visitanteId, setVisitanteId] = useState<number | null>(null);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [fecha, setFecha] = useState("");
  const [jugado, setJugado] = useState(true);
  const [jornada, setJornada] = useState(1);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    supabase
      .from("series")
      .select("id, nombre, fase")
      .order("fase")
      .order("nombre")
      .then(({ data }) => {
        if (data) setSeries(data);
      });
  }, []);

  async function cargarEquipos(serieId: number, fase: number) {
    if (fase === 2) {
      // Para fase 2 cargar desde equipos_series
      const { data } = await supabase
        .from("equipos_series")
        .select("equipo_id, equipos(id, nombre)")
        .eq("serie_id", serieId);

      if (data) {
        const equiposMapeados = data.map((es: any) => ({
          id: es.equipos.id,
          nombre: es.equipos.nombre,
          serie_id: serieId,
        }));
        setEquipos(equiposMapeados);
      }
    } else {
      // Para fase 1 cargar desde equipos
      const { data } = await supabase
        .from("equipos")
        .select("id, nombre, serie_id")
        .eq("serie_id", serieId);
      if (data) setEquipos(data);
    }
  }

  async function cargarResultado() {
    if (!serieId || !localId || !visitanteId || !fecha) {
      setMensaje("Completá todos los campos.");
      return;
    }
    if (localId === visitanteId) {
      setMensaje("El local y visitante no pueden ser el mismo equipo.");
      return;
    }

    const { error } = await supabase.from("partidos").insert({
      serie_id: serieId,
      local_id: localId,
      visitante_id: visitanteId,
      goles_local: jugado ? golesLocal : null,
      goles_visitante: jugado ? golesVisitante : null,
      fecha,
      jugado,
      fase: serieFase,
      jornada,
    });

    if (error) {
      setMensaje("Error al cargar: " + error.message);
    } else {
      setMensaje("✅ Resultado cargado correctamente.");
      setLocalId(null);
      setVisitanteId(null);
      setGolesLocal(0);
      setGolesVisitante(0);
      setFecha("");
      setJugado(true);
      setJornada(1);
    }
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-white">
          Cargar Resultado
        </h1>
        <div className="flex gap-2">
          <Link
            href="/admin/partidos"
            className="bg-gray-600 hover:bg-gray-500 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded"
          >
            Ver partidos
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded"
          >
            Cerrar sesión
          </button>
          <Link
            href="/admin/final"
            className="bg-yellow-700 hover:bg-yellow-600 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded"
          >
            Fase Final
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg space-y-4">
        <div>
          <label className="text-gray-300 text-sm">Serie</label>
          <select
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
            value={serieId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const serie = series.find((s) => s.id === id);
              setSerieId(id);
              setSerieFase(serie?.fase ?? 1);
              setLocalId(null);
              setVisitanteId(null);
              if (id && serie) cargarEquipos(id, serie.fase);
            }}
          >
            <option value="">Seleccioná una serie</option>
            {[1, 2].map((fase) => (
              <optgroup key={fase} label={`Fase ${fase}`}>
                {series
                  .filter((s) => s.fase === fase)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm">Equipo Local</label>
          <select
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
            value={localId ?? ""}
            onChange={(e) => setLocalId(Number(e.target.value))}
            disabled={!serieId}
          >
            <option value="">Seleccioná el local</option>
            {equipos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm">Equipo Visitante</label>
          <select
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
            value={visitanteId ?? ""}
            onChange={(e) => setVisitanteId(Number(e.target.value))}
            disabled={!serieId}
          >
            <option value="">Seleccioná el visitante</option>
            {equipos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-gray-300 text-sm">¿Ya se jugó?</label>
          <input
            type="checkbox"
            checked={jugado}
            onChange={(e) => setJugado(e.target.checked)}
            className="w-5 h-5 accent-green-600"
          />
        </div>

        {jugado && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm">Goles Local</label>
              <input
                type="number"
                min={0}
                value={golesLocal}
                onChange={(e) => setGolesLocal(Number(e.target.value))}
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Goles Visitante</label>
              <input
                type="number"
                min={0}
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(Number(e.target.value))}
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-gray-300 text-sm">Fecha del partido</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Jornada</label>
          <input
            type="number"
            min={1}
            value={jornada}
            onChange={(e) => setJornada(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white text-sm"
          />
        </div>

        <button
          onClick={cargarResultado}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded text-sm"
        >
          Cargar
        </button>

        {mensaje && (
          <p className="text-center text-sm text-yellow-300">{mensaje}</p>
        )}
      </div>
    </main>
  );
}
