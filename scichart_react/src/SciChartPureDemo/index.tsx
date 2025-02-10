import { useEffect, useRef } from 'react';
import {
    NumericAxis,
    SciChartJSDarkTheme,
    SciChartSurface,
    SplineMountainRenderableSeries,
    XyDataSeries,
} from 'scichart';

async function createChart(divElementId: string | HTMLDivElement) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSDarkTheme(),
        title: 'Basic Chart just with scichart',
        titleStyle: {
            fontSize: 20,
        },
    });

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const xyDataSeries = new XyDataSeries(wasmContext, { xValues: [0, 1, 2, 3, 4], yValues: [3, 6, 1, 5, 2] });
    const splineMountainSeries = new SplineMountainRenderableSeries(wasmContext, {
        strokeThickness: 4,
        stroke: '#216939',
        fillLinearGradient: {
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 1, y: 1 },
            gradientStops: [
                { offset: 0.3, color: '#2d2169' },
                { offset: 1, color: 'transparent' },
            ],
        },
        dataSeries: xyDataSeries,
    });
    sciChartSurface.renderableSeries.add(splineMountainSeries);

    return { sciChartSurface };
}

export default function SciChartPureDemo() {
    const chartId = 'chartId';
    const chartRef = useRef<SciChartSurface>();

    useEffect(() => {
        createChart(chartId).then((res) => (chartRef.current = res.sciChartSurface));
        return () => chartRef.current?.delete();
    }, []);

    return <div id={chartId} style={{ width: 800 }} />;
}
