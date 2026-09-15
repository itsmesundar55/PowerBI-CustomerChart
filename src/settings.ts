import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObject = powerbi.DataViewObject;

export class VisualSettings extends dataViewObjectsParser.DataViewObjectsParser {
    public dataPoint: dataPointSettings = new dataPointSettings();
}

export class dataPointSettings {
    public barColor: string = "#1f77b4";
    public topCustomers: number = 10;
    public showLabels: boolean = true;
}
