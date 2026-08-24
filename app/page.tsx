import { supabase } from "@/lib/supabase";
import TabsClient from "./TabsClient";
import BracketFinal from "./BracketFinal";
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
      PJ: 0, PG: 0, PE: 0, PP: 0,
      GF: 0, GC: 0, DG: 0, PTS: 0,
    };
  }

  for (const p of partidos ?? []) {
    const local = tabla[p.local_id];
    const visit = tabla[p.visitante_id];
    if (!local || !visit) continue;

    local.PJ++; visit.PJ++;
    local.GF += p.goles_local; local.GC += p.goles_visitante;
    visit.GF += p.goles_visitante; visit.GC += p.goles_local;

    if (p.goles_local > p.goles_visitante) {
      local.PG++; local.PTS += 3; visit.PP++;
    } else if (p.goles_local < p.goles_visitante) {
      visit.PG++; visit.PTS += 3; local.PP++;
    } else {
      local.PE++; visit.PE++; local.PTS++; visit.PTS++;
    }
  }

  return Object.values(tabla)
    .map((e) => ({ ...e, DG: e.GF - e.GC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

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
      PJ: 0, PG: 0, PE: 0, PP: 0,
      GF: 0, GC: 0, DG: 0, PTS: 0,
    };
  }

  for (const p of partidos ?? []) {
    const local = tabla[p.local_id];
    const visit = tabla[p.visitante_id];
    if (!local || !visit) continue;

    local.PJ++; visit.PJ++;
    local.GF += p.goles_local; local.GC += p.goles_visitante;
    visit.GF += p.goles_visitante; visit.GC += p.goles_local;

    if (p.goles_local > p.goles_visitante) {
      local.PG++; local.PTS += 3; visit.PP++;
    } else if (p.goles_local < p.goles_visitante) {
      visit.PG++; visit.PTS += 3; local.PP++;
    } else {
      local.PE++; visit.PE++; local.PTS++; visit.PTS++;
    }
  }

  return Object.values(tabla)
    .map((e) => ({ ...e, DG: e.GF - e.GC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

function agruparPorJornada(partidos: Partido[]): { jornadas: string[]; porJornada: Record<string, JornadaData> } {
  const porJornada: Record<string, JornadaData> = {};
  for (const p of partidos) {
    const key = String(p.jornada ?? 0);
    const serie = p.serie?.nombre ?? "Sin serie";
    if (!porJornada[key]) porJornada[key] = { fecha: p.fecha, series: {} };
    if (!porJornada[key].series[serie]) porJornada[key].series[serie] = [];
    porJornada[key].series[serie].push(p);
  }
  const jornadas = Object.keys(porJornada).sort((a, b) => Number(b) - Number(a));
  return { jornadas, porJornada };
}

function agruparFixturePorJornada(partidos: Partido[]): { jornadas: string[]; porJornada: Record<string, JornadaData> } {
  const porJornada: Record<string, JornadaData> = {};
  for (const p of partidos) {
    const key = String(p.jornada ?? 0);
    const serie = p.serie?.nombre ?? "Sin serie";
    if (!porJornada[key]) porJornada[key] = { fecha: p.fecha, series: {} };
    if (!porJornada[key].series[serie]) porJornada[key].series[serie] = [];
    porJornada[key].series[serie].push(p);
  }
  const jornadas = Object.keys(porJornada).sort((a, b) => Number(a) - Number(b));
  return { jornadas, porJornada };
}

export default async function Home() {
  // Fase final bracket
  const { data: partidosFinal } = await supabase
    .from("fase_final")
    .select(`
      id, ronda, partido, jugado, goles_local, goles_visitante,
      penales_local, penales_visitante, fecha,
      equipo_local:equipo_local_id(nombre, escudo),
      equipo_visitante:equipo_visitante_id(nombre, escudo)
    `)
    .order("ronda")
    .order("partido");

  // Series fase 2
  const { data: seriesFase2 } = await supabase
    .from("series")
    .select("id, nombre, fase")
    .eq("fase", 2)
    .order("nombre");

  const seriesConPosicionesFase2 = await Promise.all(
    (seriesFase2 ?? []).map(async (serie) => ({
      ...serie,
      posiciones: await getPosicionesFase2(serie.id),
    }))
  );

  // Series fase 1
  const { data: seriesFase1 } = await supabase
    .from("series")
    .select("id, nombre, fase")
    .eq("fase", 1)
    .order("nombre");

  const seriesConPosicionesFase1 = await Promise.all(
    (seriesFase1 ?? []).map(async (serie) => ({
      ...serie,
      posiciones: await getPosicionesFase1(serie.id),
    }))
  );

  // Resultados fase 2
  const { data: resultados } = await supabase
    .from("partidos")
    .select(`
      id, fecha, jornada, goles_local, goles_visitante,
      local:local_id(nombre, escudo),
      visitante:visitante_id(nombre, escudo),
      serie:serie_id(nombre)
    `)
    .eq("jugado", true)
    .eq("fase", 2)
    .order("jornada", { ascending: false })
    .order("fecha", { ascending: false });

  const { jornadas, porJornada } = agruparPorJornada(resultados as unknown as Partido[] ?? []);

  // Fixture fase 2
  const { data: fixture } = await supabase
    .from("partidos")
    .select(`
      id, fecha, jornada, goles_local, goles_visitante,
      local:local_id(nombre, escudo),
      visitante:visitante_id(nombre, escudo),
      serie:serie_id(nombre)
    `)
    .eq("jugado", false)
    .eq("fase", 2)
    .order("jornada", { ascending: true })
    .order("fecha", { ascending: true });

  const { jornadas: jornadasFixture, porJornada: porJornadaFixture } = agruparFixturePorJornada(fixture as unknown as Partido[] ?? []);

  // Resultados fase 1
  const { data: resultadosFase1 } = await supabase
    .from("partidos")
    .select(`
      id, fecha, jornada, goles_local, goles_visitante,
      local:local_id(nombre, escudo),
      visitante:visitante_id(nombre, escudo),
      serie:serie_id(nombre)
    `)
    .eq("jugado", true)
    .eq("fase", 1)
    .order("jornada", { ascending: false })
    .order("fecha", { ascending: false });

  const { jornadas: jornadasFase1, porJornada: porJornadaFase1 } = agruparPorJornada(resultadosFase1 as unknown as Partido[] ?? []);

  return (
    <main className="p-6">
      <TabsClient
        bracket={<BracketFinal partidos={(partidosFinal as unknown as PartidoFinal[]) ?? []} />}
        posiciones={seriesConPosicionesFase2}
        jornadas={jornadas}
        porJornada={porJornada}
        jornadasFixture={jornadasFixture}
        porJornadaFixture={porJornadaFixture}
        posicionesFase1={seriesConPosicionesFase1}
        jornadasFase1={jornadasFase1}
        porJornadaFase1={porJornadaFase1}
        posicionesFase2={seriesConPosicionesFase2}
        jornadasFase2={jornadas}
        porJornadaFase2={porJornada}
      />
    </main>
  );
}
