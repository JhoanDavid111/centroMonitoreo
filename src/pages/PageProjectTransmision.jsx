import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMockProjectData } from '../data/mockProjectsData';

// Componentes
import ProjectBanner from '../components/projects/ProjectBanner/ProjectBanner';
import ProjectSummary from '../components/projects/ProjectSummary/ProjectSummary';
import MilestoneCard from '../components/projects/MilestoneCard/MilestoneCard';
import ProgressSummaryCard from '../components/projects/ProgressSummaryCard/ProgressSummaryCard';
import ProgressSection from '../components/projects/ProgressSection/ProgressSection';
//import MonitoringChart from '../components/projects/MonitoringChart/MonitoringChart';
//import DocumentList from '../components/projects/DocumentList/DocumentList';
//import LoadingSpinner from '../components/LoadingSpinner';
//import ErrorDisplay from '../components/ErrorDisplay';
//import EmptyState from '../components/EmptyState';

// Assets
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';
import InfraElectricaAmarillo from '../assets/svg-icons/InfraElectrica-Amarillo.svg';
import bannerImage from '../assets/bannerCentroMonitoreoTransmision.png';

const PageProjectTransmision = ({ onBack }) => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  console.log('Project ID:', projectId);
  const [state, setState] = useState({
    projectData: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    
    const getProject = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        if (!projectId) {
          throw new Error('No se especificó un ID de proyecto');
        }
        
            

        const data = await getMockProjectData(projectId);

        
        
        if (data) {
          console.log('Datos del proyecto encontrado:', data);
          setState({
            projectData: data,
            loading: false,
            error: null
          });
        } else {
          throw new Error('Proyecto no encontrado');
        }
      } catch (err) {
        setState({
          projectData: null,
          loading: false,
          error: err.message
        });
      }
    };

    getProject();
  }, [projectId]);

  const { projectData, loading, error } = state;

  /*if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!projectData) return <EmptyState />;
*/
console.log('raro Project Data:', projectData);
console.log('rna Milestones:', projectData?.milestones);
  return (
    <div className="space-y-8 p-5 bg-gray-900 text-white min-h-screen">
      {projectData ? (
      <>      
      {/* Botón de volver */}
      <button 
        onClick={onBack}
        className="flex items-center text-yellow-400 hover:text-yellow-300 mb-4"
      >
       {/*  <ChevronLeft className="mr-1" size={20} /> */}
        Volver a Proyectos
      </button>

      {/* Banner del proyecto */}
      <ProjectBanner 
        title={projectData.header.title}
        subtitle={projectData.header.location}
        status={projectData.header.status}
        image={bannerImage}
        icon={GWOff}
      /> 

          </>
      ) : (
        <div className="text-center text-yellow-400">
          <h2 className="text-2xl font-bold mb-4">Proyecto no encontrado</h2>
          <p>Por favor, verifica el ID del proyecto.</p>
        </div>
      )}

     

      {/* Sección de Fechas de puesta en operación */}
     {projectData?.milestones?.map((milestone, index) => (
      <MilestoneCard 
        key={`milestone-${index}`}
        title={milestone.title}
        date={milestone.value}
        updated={milestone.updated}
        hasNote={milestone.hasNote}
      />
      ))}

    

     

      {/* Sección de Documentos */}
      {/* {projectData.documents?.length > 0 && (
        <section className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Documentos del proyecto</h2>
          <DocumentList documents={projectData.documents} />
        </section>
      )} */}

      {/* Sección de Avances */}
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Avances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/*  {projectData.progressSummary.map((progress, index) => (
            <ProgressSummaryCard
              key={`progress-${index}`}
              title={progress.title}
              percentage={progress.percentage}
              hasDelay={progress.hasDelay}
              delayDays={progress.delayDays}
              updated={progress.updated}
            />
          ))} */}
        </div>
      </section>

      {/* Sección de Tramos y Subestaciones */}
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Detalles de construcción</h2>
        <div className="space-y-6">
          {/* {projectData.sections.map((section, index) => (
            <ProgressSection
              key={`section-${index}`}
              title={section.title}
              licensePercent={section.license}
              constructionPercent={section.construction}
            />
          ))} */}
        </div>
      </section>

      {/* Gráfico Curva S */}
      {/* {projectData.chartData?.length > 0 && (
        <section className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Seguimiento Curva S</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              {projectData.header.title} - Avance programado vs cumplido
            </h3>
            <MonitoringChart data={projectData.chartData} />
          </div>
        </section>
      )} */}
    </div>
  );
};

export default PageProjectTransmision;