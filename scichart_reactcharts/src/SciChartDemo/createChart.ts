import {
    EAutoRange,
    EAxisAlignment,
    EColor,
    EDragMode,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    XAxisDragModifier,
    XyDataSeries,
    YAxisDragModifier,
    ZoomExtentsModifier,
} from 'scichart';
import { RandomWalkGenerator } from '../RandomWalkGenerator';

const numberOfPointsPerTimerTick = 100; // 100 points are appended every timer tick
const timerInterval = 20; // the timer ticks every 20 milliseconds (equivalent to 50 FPS)
const maxPoints = 10000; // max points for a single series before the demo stops

let perfStart: number;
let perfEnd: number;

export const createChart = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.createSingle(rootElement);

    // Create an XAxis and YAxis with autoRange=Always
    const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisAlignment: EAxisAlignment.Left });
    sciChartSurface.yAxes.add(yAxis);

    // Create some DataSeries
    const dataSeries: XyDataSeries[] = [
        new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
        new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
        new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
    ];

    const seriesColors = [EColor.Blue, EColor.Orange, EColor.Purple];

    // Create some FastLineRenderableSeries bound to each dataSeries and add to the chart
    dataSeries.map((ds, index) => {
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: ds,
                strokeThickness: 2,
                stroke: seriesColors[index],
            }),
        );
    });

    // Add some interactivity modifiers. These are only operational when the demo is paused
    // as interactivity conflicts with AutoRange.Always
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new XAxisDragModifier({ dragMode: EDragMode.Panning }),
        new YAxisDragModifier({ dragMode: EDragMode.Panning }),
        new ZoomExtentsModifier(),
    );

    // This class generates some data for our example
    // It generates a random walk, which is a line which increases or decreases by a random value
    // each data-point
    const randomWalkGenerators = [1, 2, 3].map((_) => {
        return new RandomWalkGenerator(0);
    });

    let timerId: NodeJS.Timeout;

    // Function called when the user clicks stopUpdate button
    const stopUpdate = () => {
        clearTimeout(timerId);
        timerId = undefined;
        randomWalkGenerators.forEach((rw) => rw.reset());
        // Disable autoranging on X when the demo is paused. This allows zooming and panning
        xAxis.autoRange = EAutoRange.Once;
    };

    const updateFunc = (setTimeElapsedFn: (v: string) => void) => {
        if (dataSeries[0].count() >= maxPoints) {
            perfEnd = performance.now();
            setTimeElapsedFn(`${((perfEnd - perfStart) / 1000).toFixed(2)} seconds`);
            stopUpdate();
            return;
        }

        randomWalkGenerators.forEach((randomWalk, index) => {
            // Get the next N random walk x,y values
            const { xValues, yValues } = randomWalk.getRandomWalkSeries(numberOfPointsPerTimerTick);

            // Append these to the dataSeries. This will cause the chart to redraw
            dataSeries[index].appendRange(xValues, yValues);
        });

        timerId = setTimeout(() => updateFunc(setTimeElapsedFn), timerInterval);
    };

    // Function called when the user clicks startUpdate button
    const startUpdate = (setTimeElapsedFn: (v: string) => void) => {
        if (timerId) {
            stopUpdate();
        }

        // Enable autoranging on X when running the demo
        xAxis.autoRange = EAutoRange.Always;
        dataSeries.forEach((ds) => ds.clear());
        perfStart = performance.now();
        timerId = setTimeout(() => updateFunc(setTimeElapsedFn), timerInterval);
    };

    let lastRendered = Date.now();
    sciChartSurface.rendered.subscribe(() => {
        const currentTime = Date.now();
        const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
        lastRendered = currentTime;
        const fps = 1 / timeDiffSeconds;
        const renderStats = {
            numberPoints:
                sciChartSurface.renderableSeries.size() * sciChartSurface.renderableSeries.get(0).dataSeries.count(),
            fps,
        };
    });

    return { wasmContext, sciChartSurface, controls: { startUpdate, stopUpdate } };
};
