import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataViewValueColumns = powerbi.DataViewValueColumns;
import PrimitiveValue = powerbi.PrimitiveValue;
import { VisualSettings } from "./settings";

import * as d3 from "d3";

export class Visual implements IVisual {
    private target: HTMLElement;
    private svg: d3.Selection<SVGElement, any, HTMLElement, any>;
    private barGroup: d3.Selection<SVGGElement, any, HTMLElement, any>;
    private settings: VisualSettings;
    private margin = { top: 20, right: 30, bottom: 60, left: 60 };

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        
        this.svg = d3.select(this.target)
            .append("svg")
            .style("width", "100%")
            .style("height", "100%");

        this.barGroup = this.svg.append("g")
            .attr("class", "bar-group");

        this.settings = new VisualSettings();
    }

    public update(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        
        if (!dataView || !dataView.categorical) {
            return;
        }

        this.settings = VisualSettings.parse<VisualSettings>(dataView);

        const categorical = dataView.categorical;
        const categories = categorical.categories?.[0];
        const values = categorical.values?.[0];

        if (!categories || !values) {
            return;
        }

        const data = categories.values.map((category, index) => ({
            customer: <string>category,
            sales: <number>values.values?.[index] || 0,
        }));

        // Sort by sales (descending) and limit to top N
        const topN = this.settings.dataPoint.topCustomers || 10;
        const sortedData = data.sort((a, b) => b.sales - a.sales).slice(0, topN);

        this.renderChart(sortedData, options);
    }

    private renderChart(data: Array<{ customer: string; sales: number }>, options: VisualUpdateOptions) {
        const width = options.viewport.width - this.margin.left - this.margin.right;
        const height = options.viewport.height - this.margin.top - this.margin.bottom;

        // Update SVG dimensions
        this.svg
            .attr("width", options.viewport.width)
            .attr("height", options.viewport.height);

        // Update bar group transform
        this.barGroup.attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Scales
        const xScale = d3.scaleBand<string>()
            .domain(data.map(d => d.customer))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.sales) || 0])
            .range([height, 0]);

        // Remove old elements
        this.barGroup.selectAll("*").remove();

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Add Y axis
        this.barGroup.append("g")
            .call(yAxis)
            .style("font-size", "12px");

        // Add X axis
        this.barGroup.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .style("font-size", "12px")
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("text-anchor", "end")
            .attr("dy", "0.5em")
            .attr("dx", "-0.5em");

        // Add Y axis label
        this.barGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Sales/Revenue");

        // Add bars
        this.barGroup.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.customer) || 0)
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(d.sales))
            .attr("height", d => height - yScale(d.sales))
            .attr("fill", this.settings.dataPoint.barColor)
            .style("opacity", 0.8)
            .on("mouseover", function () {
                d3.select(this)
                    .style("opacity", 1)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function () {
                d3.select(this).style("opacity", 0.8);
            });

        // Add value labels on bars
        if (this.settings.dataPoint.showLabels) {
            this.barGroup.selectAll(".label")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", d => (xScale(d.customer) || 0) + xScale.bandwidth() / 2)
                .attr("y", d => yScale(d.sales) - 5)
                .attr("text-anchor", "middle")
                .style("font-size", "11px")
                .text(d => `$${(d.sales / 1000).toFixed(0)}K`);
        }
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
        const instances: VisualObjectInstance[] = [];
        const settings = this.settings;

        // Data point formatting
        if (options.objectName === "dataPoint") {
            instances.push({
                objectName: "dataPoint",
                properties: {
                    barColor: { solid: { color: settings.dataPoint.barColor } },
                    topCustomers: settings.dataPoint.topCustomers,
                    showLabels: settings.dataPoint.showLabels,
                },
                selector: null,
            });
        }

        return instances;
    }
}
