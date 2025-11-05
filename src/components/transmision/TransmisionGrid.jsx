
// src/components/transmision/TransmisionGrid.jsx
import DataGrid from '../DataGrid/DataGrid';
import { TRANSMISION_GRID_CONFIG } from '../../config/transmisionGrid';

const TransmisionGrid = () => {
  const config = {
    ...TRANSMISION_GRID_CONFIG,
    tabs: TRANSMISION_GRID_CONFIG.tabs.map(tab => ({
      ...tab,
      // Pasar solo el endpoint relativo, apiClient ya tiene baseURL configurado
      apiUrl: tab.apiEndpoint,
      fetchOptions: { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }))
  };

  return <DataGrid config={config} />;
};

export default TransmisionGrid;