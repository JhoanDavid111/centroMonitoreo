// src/components/DataGrid/styles/darkTheme.js
import { createTheme } from 'react-data-table-component';
import tokens from '../../../styles/theme.js';

export const registerDarkDataTableTheme = () =>
  createTheme('customDark', {
    background: { default: tokens.colors.surface.primary },
    context: { background: tokens.colors.accent.warning, text: tokens.colors.text.primary },
    divider: { default: tokens.colors.border.subtle },
    action: { button: 'rgba(0,0,0,.54)', hover: 'rgba(0,0,0,.08)', disabled: 'rgba(0,0,0,.12)' },
    text: { primary: tokens.colors.text.primary, secondary: tokens.colors.text.muted },
    rows: {
      style: {
        backgroundColor: tokens.colors.surface.primary,
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: tokens.colors.border.subtle,
        },
        '&:hover': { backgroundColor: tokens.colors.surface.secondary, transition: '0.2s ease-in-out' },
      },
    },
    headCells: {
      style: {
        fontSize: tokens.font.size.lg,
        fontWeight: tokens.font.weight.semibold,
        color: tokens.colors.text.primary,
        backgroundColor: tokens.colors.surface.primary,
        paddingLeft: tokens.spacing.sm,
        paddingRight: tokens.spacing.sm,
      },
    },
    cells: {
      style: {
        fontSize: tokens.font.size.base,
        fontWeight: tokens.font.weight.regular,
        color: tokens.colors.text.secondary,
        paddingLeft: tokens.spacing.sm,
        paddingRight: tokens.spacing.sm,
      },
    },
    pagination: {
      style: {
        backgroundColor: tokens.colors.surface.primary,
        color: tokens.colors.text.secondary,
        borderTop: `1px solid ${tokens.colors.border.subtle}`,
      },
    },
  });

export const darkTableStyles = {
  table: {
    style: {
      backgroundColor: tokens.colors.surface.primary,
    },
  },
  pagination: {
    pageButtonsStyle: {
      fill: tokens.colors.text.secondary,
      '&:disabled': { fill: tokens.colors.text.muted },
      '&:hover:not(:disabled)': { fill: tokens.colors.text.primary },
    },
  },
};