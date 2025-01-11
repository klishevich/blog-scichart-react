import { useEffect, useRef } from 'react';
import { createChart } from './createChart';
import { SciChartSurface } from 'scichart';

export default function SciChartPure() {
    const chartId = 'chartId';
    const chartRef = useRef<SciChartSurface>();

    useEffect(() => {
        createChart(chartId).then((res) => (chartRef.current = res.sciChartSurface));
        return () => chartRef.current?.delete();
    }, []);

    return <div id={chartId} style={{ width: 800 }} />;
}
