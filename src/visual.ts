import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

export class Visual implements IVisual {
    private target: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
    }

    public update(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        
        if (!dataView || !dataView.categorical) {
            this.target.innerHTML = "<div style='padding:20px;'>No data available</div>";
            return;
        }

        const categorical = dataView.categorical;
        const categories = categorical.categories?.[0];
        const values = categorical.values?.[0];

        if (!categories || !values) {
            this.target.innerHTML = "<div style='padding:20px;'>No data available</div>";
            return;
        }

        const data = categories.values.map((cat, idx) => ({
            name: String(cat),
            value: Number(values.values?.[idx] || 0)
        }));

        const sorted = data.sort((a, b) => b.value - a.value).slice(0, 10);
        const max = Math.max(...sorted.map(d => d.value));

        let html = `<div style="padding:20px; font-family:Arial;">
            <h3>Top 10 Customers</h3>`;

        sorted.forEach(item => {
            const width = (item.value / max) * 300;
            html += `<div style="margin:10px 0;">
                <div>${item.name}</div>
                <div style="background:#1f77b4; width:${width}px; height:20px; color:white; text-align:right; padding:2px;">
                    $${(item.value).toLocaleString()}
                </div>
            </div>`;
        });

        html += `</div>`;
        this.target.innerHTML = html;
    }
}
