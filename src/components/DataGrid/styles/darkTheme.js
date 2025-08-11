// src/components/DataGrid/styles/darkTheme.js
import { createTheme } from 'react-data-table-component';

createTheme('customDark', {
  background: { default: '#262626' },
  context: { background: '#cb4b16', text: '#FFFFFF' },
  divider: { default: '#1d1d1d' },
  action: { button: 'rgba(0,0,0,.54)', hover: 'rgba(0,0,0,.08)', disabled: 'rgba(0,0,0,.12)' },
  text: { primary: '#ffffff', secondary: '#aaaaaa' },
  rows: {
    style: {
      backgroundColor: '#262626',
      '&:not(:last-of-type)': { borderBottomStyle: 'solid', borderBottomWidth: '1px', borderBottomColor: '#1d1d1d' },
      '&:hover': { backgroundColor: '#3a3a3a', transition: '0.2s ease-in-out' }
    }
  },
  headCells: {
    style: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#262626',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      fontSize: '14px',
      fontWeight: '400',
      color: '#cccccc',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  pagination: {
    style: {
      backgroundColor: '#262626',
      color: '#cccccc',
      borderTop: '1px solid #1d1d1d',
    },
  },
});

export const darkTheme = {
  table: {
    style: {
      backgroundColor: '#262626',
    },
  },
  pagination: {
    pageButtonsStyle: {
      fill: '#cccccc',
      '&:disabled': { fill: '#666666' },
      '&:hover:not(:disabled)': { fill: '#ffffff' },
    },
  },
};