
// src/components/transmision/TransmisionGrid.jsx
import DataGrid from '../DataGrid/DataGrid';
import { TRANSMISION_GRID_CONFIG } from '../../config/transmisionGrid';
import { API } from '../../config/api';

const TransmisionGrid = () => {
  const config = {
    ...TRANSMISION_GRID_CONFIG,
    tabs: TRANSMISION_GRID_CONFIG.tabs.map(tab => ({
      ...tab,
      apiUrl: `${API}${tab.apiEndpoint}`,
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