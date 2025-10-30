import { useEffect, useState } from "react";
import { API } from '../config/api';

export const SideInfoHidrologia = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const colorMap = {
    ANTIOQUIA: '#9168EA',
    CALDAS: '#F06B6B',
    CARIBE: '#3B82F6',
    CENTRO: '#F97316',
    ORIENTE: '#FFC800',
    VALLE: '#32BF6F'
  };

  useEffect(() => {
    const fetchDataLabelDam = async () => {
      try {
        const response = await fetch(`${API}/v1/indicadores/hidrologia/indicadores_regionales`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok) {
          throw new Error("Error fetching data")
        }
        const data = await response.json()
        setData(data.resumen_hidrologico)
      } catch (error) {
        setErrorMessage(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDataLabelDam();
  }, [data])

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="pl-4 pt-4 pr-2 w-full lg:max-w-[400px] flex flex-col gap-y-4 bg-[#323232] rounded-tr-lg rounded-tl-lg overflow-y-scroll max-h-[500px] lg:max-h-[800px]">
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
                style={{ color: colorMap[item.Region] || 'FFFFFF' }}
              >
                ●
              </p>
              <p>{item.Region}</p>
              <p>- Embalses: {item["Número de embalses"]}</p>
            </div>
            <div className="grid grid-cols-6 gap-1 pl-4 md:text-[12px] lg:text-[14px] pb-2">
              <div className="col-span-2">Aportes</div>
              <div className="col-span-4">
                {item["Aportes por región (GWh-día)"]} GWh-día / {item["Porcentaje"]}%
              </div>
              <div className="col-span-2 pt-1">Nivel</div>
              <div className="col-span-4">
                {item["Volumen útil (GWh-día)"]} GWh-día - {item["Nivel (%)"]} %
              </div>
            </div>
            <div className="flex-1 h-3 rounded-2xl overflow-hidden bg-[#575756] mx-3 w-5/6">
              <div
                className="h-3"
                style={{ width: `${item["Nivel (%)"]}%`, background: "#22C55E" }}
              />
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

// <3 ¯\_( ͡❛ ͜ʖ ͡❛)_/¯ js08
