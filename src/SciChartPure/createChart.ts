import { NumericAxis, SciChartSurface } from 'scichart';

export async function createChart(divElementId: string | HTMLDivElement) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    return { sciChartSurface };
};
