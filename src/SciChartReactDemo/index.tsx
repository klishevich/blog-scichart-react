import { ESeriesType, EAxisType, EChart2DModifierType, EThemeProviderType } from 'scichart';
import { SciChartReact } from 'scichart-react';

const chartConfig = {
    surface: {
        theme: { type: EThemeProviderType.Dark },
        title: 'Basic Chart with scichart-react',
        titleStyle: {
            fontSize: 20,
        },
    },
    series: {
        type: ESeriesType.SplineMountainSeries,
        options: {
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
        },
        xyData: { xValues: [0, 1, 2, 3, 4], yValues: [3, 6, 1, 5, 2] },
    },
};

export default function SciChartReactDemo() {
    // @ts-ignore
    return <SciChartReact style={{ width: 800, height: 600 }} config={chartConfig} />;
}
