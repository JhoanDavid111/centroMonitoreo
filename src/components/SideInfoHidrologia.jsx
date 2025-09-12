import { useEffect, useState } from "react";
import { mockHidrologiaData } from "../data/mockHidrologiaData";

export const HidrologiaComponent = () => {
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
    <div className="p-2 pr-4 pt-6 z-20 min-w-sm w-full md:w-2/6 border-r border-[#898989]  flex flex-col gap-y-4 bg-[#323232]">
      <span className="text-xl text-center font-semibold">
        Regiones Hidrológicas
      </span>

      <ul className="w-full overflow-y-auto max-h-[500px] md:max-h-none">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="pb-3 border-b-2 border-[#575756] w-full"
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
            <div className="grid grid-cols-2 gap-1 pl-4 text-[14px] pb-2">
              <div>Aportes</div>
              <div>
                {item.Porcentaje}% / {item.Aportes} GWh-día
              </div>
              <div>Nivel</div>
              <div>
                {item.Aportes}GWh-dia - {item.Porcentaje}%
              </div>
            </div>
            <div className="flex-1 h-3 rounded-2xl overflow-hidden bg-[#575756] mx-3 w-6/6">
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
