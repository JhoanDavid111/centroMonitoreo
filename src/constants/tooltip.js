export const TOOLTIP_CONFIG = () => ({
  backgroundColor: "#262626",
  style: { color: "#FFF", fontSize: "14px" },
  shared: true,
  formatter: function () {
    let header = `<b>${this.point.name}</b><br/>`;
    let rows = this.points
      .map((point) => {
        return `
            <div style="user-select:text;pointer-events:auto;margin:10px 0;">
              <span style="color:${point.color};  fontSize:20px;">● </span>
              ${point.series.name}: <b>${point.y}</b>
            </div>
          `;
      })
      .join("");
    return `<div style="padding:5px;">${header}${rows}</div>`;
  },
});
