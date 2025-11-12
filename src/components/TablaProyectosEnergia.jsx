export function TablaProyectosEnergia() {
    const proyectos = [
      { tipo: "Eólica", capacidad: 10, region: "La Guajira", inicio: "25-05-2025", fin: "20-01-2027" },
      { tipo: "Solar", capacidad: 8, region: "Norte de Santander", inicio: "28-06-2025", fin: "25-02-2027" },
      { tipo: "Solar", capacidad: 4, region: "Bolívar", inicio: "29-10-2025", fin: "16-08-2027" },
      { tipo: "Eólica", capacidad: 1, region: "Valle del Cauca", inicio: "29-10-2025", fin: "16-08-2027" },
      { tipo: "Eólica", capacidad: 6, region: "Sucre", inicio: "29-10-2025", fin: "16-08-2027" },
      { tipo: "Solar", capacidad: 3, region: "Huila", inicio: "29-10-2025", fin: "16-08-2027" },
      { tipo: "Solar", capacidad: 5, region: "Cesar", inicio: "01-11-2025", fin: "01-06-2027" },
      { tipo: "Eólica", capacidad: 7, region: "Magdalena", inicio: "01-11-2025", fin: "15-06-2027" },
      { tipo: "Solar", capacidad: 2, region: "Córdoba", inicio: "01-12-2025", fin: "15-07-2027" },
      { tipo: "Eólica", capacidad: 9, region: "Atlántico", inicio: "15-12-2025", fin: "30-07-2027" },
    ];
  
    return (
      <section className="mt-8">
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border-default)]">
          <table className="min-w-full divide-y divide-[#666666] text-sm text-white">
            <thead className="bg-[#FFC800] text-black text-left">
              <tr>
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Capacidad</th>
                <th className="px-4 py-2">Región</th>
                <th className="px-4 py-2">Fecha inicio</th>
                <th className="px-4 py-2">Fecha fin</th>
              </tr>
            </thead>
            <tbody className="bg-surface-primary divide-y divide-[#666666]">
              {proyectos.map((p, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{p.tipo}</td>
                  <td className="px-4 py-2">{p.capacidad}</td>
                  <td className="px-4 py-2">{p.region}</td>
                  <td className="px-4 py-2">{p.inicio}</td>
                  <td className="px-4 py-2">{p.fin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  