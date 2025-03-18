import { useEffect, useState, useRef } from 'react';
import { SciChartSurface } from 'scichart';
import { createChart } from './createChart';

export default function SciChartDemo() {
    const chartId = 'chartId';
    const chartRef = useRef<SciChartSurface>(undefined);
    const [timeElapsed, setTimeElapsed] = useState('');

    useEffect(() => {
        (async () => {
            const { sciChartSurface, controls } = await createChart(chartId);
            chartRef.current = sciChartSurface;
            controls.startUpdate(setTimeElapsed);
        })();
        return () => chartRef.current?.delete();
    }, []);

    return (
        <div>
            <div id={chartId} />
            <p>Time elapsed: {timeElapsed}</p>
        </div>
    );
}
