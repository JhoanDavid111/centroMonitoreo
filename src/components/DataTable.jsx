export function DataTable({ proyectos }) {
  return (
    <table className="w-full text-white text-center border-collapse">
      <thead className="bg-lime-400 text-black">
        <tr><th>No.</th><th>Tipo</th><th>Capacidad</th><th>Departamento</th><th>Autorización</th><th>Ejecución</th></tr>
      </thead>
      <tbody>
        {proyectos.map((p, i) => (
          <tr key={i} className="border-t border-gray-600">
            <td>{i + 1}</td><td>{p.tipo}</td><td>{p.capacidad}</td><td>{p.departamento}</td><td>{p.autorizacion}</td><td>{p.ejecucion}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}