import { supabase } from "@/lib/supabase";
import TabsClient from "./TabsClient";
export const revalidate = 0;

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
  goles_local: number | null;
  goles_visitante: number | null;
  local: { nombre: string; escudo: string | null };
  visitante: { nombre: string; escudo: string | null };
  serie: { nombre: string };
};

// Posiciones para fase 1 (usa serie_id en equipos)
async function getPosicionesFase1(serieId: number): Promise<Equipo[]> {
  const { data: equipos } = await supabase
    .from("equipos")
    .select("id, nombre, escudo, posicion_anterior")
    .eq("serie_id", serieId);

  const { data: partidos } = await supabase
    .from("partidos")
    .select("*")
    .eq("serie_id", serieId)
    .eq("jugado", true)
    .eq("fase", 1);

  const tabla: Record<number, Equipo> = {};

  for (const e of equipos ?? []) {
    tabla[e.id] = {
      id: e.id,
      nombre: e.nombre,
      escudo: e.escudo ?? null,
      posicion_anterior: e.posicion_anterior ?? null,
      PJ: 0,
      PG: 0,
      PE: 0,
      PP: 0,
      GF: 0,
      GC: 0,
      DG: 0,
      PTS: 0,
    };
  }

  for (const p of partidos ?? []) {
    const local = tabla[p.local_id];
    const visit = tabla[p.visitante_id];
    if (!local || !visit) continue;

    local.PJ++;
    visit.PJ++;
    local.GF += p.goles_local;
    local.GC += p.goles_visitante;
    visit.GF += p.goles_visitante;
    visit.GC += p.goles_local;

    if (p.goles_local > p.goles_visitante) {
      local.PG++;
      local.PTS += 3;
      visit.PP++;
    } else if (p.goles_local < p.goles_visitante) {
      visit.PG++;
      visit.PTS += 3;
      local.PP++;
    } else {
      local.PE++;
      visit.PE++;
      local.PTS++;
      visit.PTS++;
    }
  }

  return Object.values(tabla)
    .map((e) => ({ ...e, DG: e.GF - e.GC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

// Posiciones para fase 2 (usa equipos_series)
async function getPosicionesFase2(serieId: number): Promise<Equipo[]> {
  const { data: equiposSeries } = await supabase
    .from("equipos_series")
    .select("equipo_id, equipos(id, nombre, escudo, posicion_anterior)")
    .eq("serie_id", serieId);

  const { data: partidos } = await supabase
    .from("partidos")
    .select("*")
    .eq("serie_id", serieId)
    .eq("jugado", true)
    .eq("fase", 2);

  const tabla: Record<number, Equipo> = {};

  for (const es of equiposSeries ?? []) {
    const e = es.equipos as any;
    if (!e) continue;
    tabla[e.id] = {
      id: e.id,
      nombre: e.nombre,
      escudo: e.escudo ?? null,
      posicion_anterior: e.posicion_anterior ?? null,
      PJ: 0,
      PG: 0,
      PE: 0,
      PP: 0,
      GF: 0,
      GC: 0,
      DG: 0,
      PTS: 0,
    };
  }

  for (const p of partidos ?? []) {
    const local = tabla[p.local_id];
    const visit = tabla[p.visitante_id];
    if (!local || !visit) continue;

    local.PJ++;
    visit.PJ++;
    local.GF += p.goles_local;
    local.GC += p.goles_visitante;
    visit.GF += p.goles_visitante;
    visit.GC += p.goles_local;

    if (p.goles_local > p.goles_visitante) {
      local.PG++;
      local.PTS += 3;
      visit.PP++;
    } else if (p.goles_local < p.goles_visitante) {
      visit.PG++;
      visit.PTS += 3;
      local.PP++;
    } else {
      local.PE++;
      visit.PE++;
      local.PTS++;
      visit.PTS++;
    }
  }

  return Object.values(tabla)
    .map((e) => ({ ...e, DG: e.GF - e.GC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

export default async function Home() {
  // Series fase 2 (actuales)
  const { data: seriesFase2 } = await supabase
    .from("series")
    .select("id, nombre, fase")
    .eq("fase", 2)
    .order("nombre");

  const seriesConPosicionesFase2 = await Promise.all(
    (seriesFase2 ?? []).map(async (serie) => ({
      ...serie,
      posiciones: await getPosicionesFase2(serie.id),
    })),
  );

  // Series fase 1 (historial)
  const { data: seriesFase1 } = await supabase
    .from("series")
    .select("id, nombre, fase")
    .eq("fase", 1)
    .order("nombre");

  const seriesConPosicionesFase1 = await Promise.all(
    (seriesFase1 ?? []).map(async (serie) => ({
      ...serie,
      posiciones: await getPosicionesFase1(serie.id),
    })),
  );

  // Resultados fase 2
  const { data: resultados } = await supabase
    .from("partidos")
    .select(
      `
      id, fecha, goles_local, goles_visitante,
      local:local_id(nombre, escudo),
      visitante:visitante_id(nombre, escudo),
      serie:serie_id(nombre)
    `,
    )
    .eq("jugado", true)
    .eq("fase", 2)
    .order("fecha", { ascending: false });

  const porFecha: Record<string, Record<string, Partido[]>> = {};
  for (const p of (resultados as unknown as Partido[]) ?? []) {
    const fecha = p.fecha;
    const serie = p.serie?.nombre ?? "Sin serie";
    if (!porFecha[fecha]) porFecha[fecha] = {};
    if (!porFecha[fecha][serie]) porFecha[fecha][serie] = [];
    porFecha[fecha][serie].push(p);
  }
  const fechas = Object.keys(porFecha).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  // Fixture fase 2
  const { data: fixture } = await supabase
    .from("partidos")
    .select(
      `
      id, fecha, goles_local, goles_visitante,
      local:local_id(nombre, escudo),
      visitante:visitante_id(nombre, escudo),
      serie:serie_id(nombre)
    `,
    )
    .eq("jugado", false)
    .eq("fase", 2)
    .order("fecha", { ascending: true });

  const porFechaFixture: Record<string, Record<string, Partido[]>> = {};
  for (const p of (fixture as unknown as Partido[]) ?? []) {
    const fecha = p.fecha;
    const serie = p.serie?.nombre ?? "Sin serie";
    if (!porFechaFixture[fecha]) porFechaFixture[fecha] = {};
    if (!porFechaFixture[fecha][serie]) porFechaFixture[fecha][serie] = [];
    porFechaFixture[fecha][serie].push(p);
  }
  const fechasFixture = Object.keys(porFechaFixture).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  // Resultados fase 1
  const { data: resultadosFase1 } = await supabase
    .from("partidos")
    .select(
      `
      id, fecha, goles_local, goles_visitante,
      local:local_id(nombre, escudo),
      visitante:visitante_id(nombre, escudo),
      serie:serie_id(nombre)
    `,
    )
    .eq("jugado", true)
    .eq("fase", 1)
    .order("fecha", { ascending: false });

  const porFechaFase1: Record<string, Record<string, Partido[]>> = {};
  for (const p of (resultadosFase1 as unknown as Partido[]) ?? []) {
    const fecha = p.fecha;
    const serie = p.serie?.nombre ?? "Sin serie";
    if (!porFechaFase1[fecha]) porFechaFase1[fecha] = {};
    if (!porFechaFase1[fecha][serie]) porFechaFase1[fecha][serie] = [];
    porFechaFase1[fecha][serie].push(p);
  }
  const fechasFase1 = Object.keys(porFechaFase1).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <main className="p-6">
      <TabsClient
        posiciones={seriesConPosicionesFase2}
        fechas={fechas}
        porFecha={porFecha}
        fechasFixture={fechasFixture}
        porFechaFixture={porFechaFixture}
        posicionesFase1={seriesConPosicionesFase1}
        fechasFase1={fechasFase1}
        porFechaFase1={porFechaFase1}
      />
    </main>
  );
}
