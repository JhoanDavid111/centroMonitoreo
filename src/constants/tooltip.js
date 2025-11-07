export const TOOLTIP_CONFIG = () => ({
  backgroundColor: "#262626",
  borderColor: "#666",
  style: { color: "#FFF", fontSize: "13px" },
  padding: 10,
  shared: true,
  formatter: function () {
    let header = `<b style="font-size:14px;">${this.point.name}</b><br/>`;
    let rows = this.points
      .map((point) => {
        return `
            <div style="user-select:text;pointer-events:auto;margin:5px 0;">
              <span style="color:${point.color}; font-size:16px;">● </span>
              ${point.series.name}: <b>${point.y}</b>
            </div>
          `;
      })
      .join("");
    return `<div style="padding: 4px 0;">${header}${rows}</div>`;
  },
});
