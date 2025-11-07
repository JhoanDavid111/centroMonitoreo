import tokens from '../styles/theme.js';

export const TOOLTIP_CONFIG = () => ({
  backgroundColor: tokens.colors.surface.primary,
  borderColor: tokens.colors.border.default,
  style: { color: tokens.colors.text.primary, fontSize: tokens.font.size.base },
  padding: parseInt(tokens.spacing.lg, 10),
  shared: true,
  formatter: function () {
    let header = `<b style="font-size:${tokens.font.size.md};">${this.point.name}</b><br/>`;
    let rows = this.points
      .map((point) => {
        return `
            <div style="user-select:text;pointer-events:auto;margin:${tokens.spacing.xs} 0;color:${tokens.colors.text.secondary};">
              <span style="color:${point.color}; font-size:16px;">● </span>
              ${point.series.name}: <b style="color:${tokens.colors.text.primary};">${point.y}</b>
            </div>
          `;
      })
      .join('');
    return `<div style="padding: ${tokens.spacing.xs} 0;">${header}${rows}</div>`;
  },
});
