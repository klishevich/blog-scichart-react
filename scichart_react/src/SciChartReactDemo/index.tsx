import {
    EThemeProviderType,
    NumericAxis,
    SciChartSurface,
    SplineMountainRenderableSeries,
    XyDataSeries,
} from 'scichart';
import { SciChartReact } from 'scichart-react';

// 2. Via Initialization function
const chartInitializationFunction = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: { type: EThemeProviderType.Dark },
        title: 'scichart-react via initialization function',
        titleStyle: {
            fontSize: 20,
        },
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.renderableSeries.add(
        new SplineMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [0, 1, 2, 3, 4],
                yValues: [3, 6, 1, 5, 2],
            }),
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
        }),
    );

    return { sciChartSurface };
};

export default function SciChartReactDemo() {
    return <SciChartReact style={{ width: 800, height: 600 }} initChart={chartInitializationFunction} />;
}
