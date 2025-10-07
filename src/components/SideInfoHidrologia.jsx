import { useEffect, useState } from "react";
import { mockHidrologiaData } from "../data/mockHidrologiaData";

export const SideInfoHidrologia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(mockHidrologiaData.proyectos);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="pl-4 pt-4 pr-2 w-full lg:max-w-[400px] flex flex-col gap-y-4 bg-[#323232] rounded-tr-lg rounded-tl-lg overflow-y-auto max-h-[500px] lg:max-h-none">
      <span className="text-xl text-center font-semibold">
        Regiones hidrológicas
      </span>

      <ul className="w-full h-full">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="pb-2 border-b-2 border-[#575756] w-full"
          >
            <div className="flex items-center space-y-2 gap-1 text-gray-50 pb-1">
              <p
                className="text-4xl"
                style={{ color: item.Color }}
              >
                ●
              </p>
              <p>{item.Region}</p>
              <p>- Embalses: {item.Embalses}</p>
            </div>
            <div className="grid grid-cols-6 gap-1 pl-4 md:text-[12px] lg:text-[14px] pb-2">
              <div className="col-span-2">Aportes</div>
              <div className="col-span-4">
                {item.Porcentaje}% / {item.Aportes} GWh-día
              </div>
              <div className="col-span-2 pt-1">Nivel</div>
              <div className="col-span-4">
                {item.Aportes}GWh-dia - {item.Porcentaje}%
              </div>
            </div>
            <div className="flex-1 h-3 rounded-2xl overflow-hidden bg-[#575756] mx-3 w-5/6">
              <div
                className="h-3"
                style={{ width: `${item.Porcentaje}%`, background: "#22C55E" }}
              />
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

// <3 ¯\_( ͡❛ ͜ʖ ͡❛)_/¯ js08
