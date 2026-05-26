import { supabase } from "@/lib/supabase";
import TabsClient from "./TabsClient";

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

async function getPosiciones(serieId: number): Promise<Equipo[]> {
  const { data: equipos } = await supabase
    .from("equipos")
    .select("id, nombre")
    .eq("serie_id", serieId);

  const { data: partidos } = await supabase
    .from("partidos")
    .select("*")
    .eq("serie_id", serieId)
    .eq("jugado", true);

  const tabla: Record<number, Equipo> = {};

  for (const e of equipos ?? []) {
    tabla[e.id] = {
      id: e.id,
      nombre: e.nombre,
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
  const { data: series } = await supabase
    .from("series")
    .select("id, nombre")
    .order("nombre");

  const seriesConPosiciones = await Promise.all(
    (series ?? []).map(async (serie) => ({
      ...serie,
      posiciones: await getPosiciones(serie.id),
    })),
  );

  // Resultados
  const { data: resultados } = await supabase
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

  // Fixture
  const { data: fixture } = await supabase
    .from("partidos")
    .select(
      `
      id, fecha, goles_local, goles_visitante,
      local:local_id(nombre),
      visitante:visitante_id(nombre),
      serie:serie_id(nombre)
    `,
    )
    .eq("jugado", false)
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

  return (
    <main className="p-6">
      <TabsClient
        posiciones={seriesConPosiciones}
        fechas={fechas}
        porFecha={porFecha}
        fechasFixture={fechasFixture}
        porFechaFixture={porFechaFixture}
      />
    </main>
  );
}
