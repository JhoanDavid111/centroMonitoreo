// src/components/transmision/TotalProyectos.jsx
import InfraElectricaAmarillo from '../../assets/svg-icons/InfraElectrica-Amarillo.svg';

export default function TotalProyectos({total}) {
   return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-6 text-center md:text-left">
      <span className="text-white text-xl md:text-2xl font-semibold mr-4">
        Total de proyectos
      </span>
      <span className="flex items-center">
        <span 
          className="bg-yellow-400 flex items-center justify-center mr-4"
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
          }}
        >
          <img
            src={InfraElectricaAmarillo}
            alt="Infraestructura Eléctrica"
            style={{ width: 36, height: 36 }}
          />
        </span>
        <span 
          className="text-yellow-400 font-extrabold"
          style={{
            fontFamily: '"Nunito Sans", sans-serif',
            fontWeight: 800,
            fontSize: '62px',
            lineHeight: '66px',
            textAlign: 'center',
          }}
        >
          {total}
        </span>
      </span>
    </div>
  );

}
