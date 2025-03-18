import { useMemo, useState, useEffect, useRef } from 'react';
import { AxisOptions, Chart } from 'react-charts';
import { RandomWalkGenerator } from '../RandomWalkGenerator';

type TDataPoint = {
    x: number;
    y: number;
};

type TSeries = {
    label: string;
    data: TDataPoint[];
};

const initialDataSeries: TSeries[] = [
    {
        label: 'Series 1',
        data: [],
    },
    {
        label: 'Series 2',
        data: [],
    },
    {
        label: 'Series 3',
        data: [],
    },
];

const numberOfPointsPerTimerTick = 100; // 100 points are appended every timer tick
const timerInterval = 20; // the timer ticks every 20 milliseconds (equivalent to 50 FPS)
const maxPoints = 10000; // max points for a single series before the demo stops

let perfStart: number;
let perfEnd: number;

export default function ReactChartsDemo() {
    const timerIdRef = useRef<NodeJS.Timeout>(null);
    const [dataSeries, setDataSeries] = useState(initialDataSeries);
    const [timeElapsed, setTimeElapsed] = useState('');

    const primaryAxis = useMemo(
        (): AxisOptions<TDataPoint> => ({
            getValue: (datum) => datum.x,
            scaleType: 'linear',
        }),
        [],
    );

    const secondaryAxes = useMemo(
        (): AxisOptions<TDataPoint>[] => [
            {
                getValue: (datum) => datum.y,
                scaleType: 'linear',
            },
        ],
        [],
    );

    useEffect(() => {
        const randomWalkGenerators = [1, 2, 3].map((_) => {
            return new RandomWalkGenerator(0);
        });
        const stopUpdate = () => {
            clearTimeout(timerIdRef.current);
            timerIdRef.current = undefined;
            randomWalkGenerators.forEach((rw) => rw.reset());
        };
        const updateFunc = () => {
            if (initialDataSeries[0].data.length >= maxPoints) {
                perfEnd = performance.now();
                setTimeElapsed(`${((perfEnd - perfStart)/1000).toFixed(2)} seconds`);

                stopUpdate();
                return;
            }

            randomWalkGenerators.forEach((randomWalk, index) => {
                // Get the next N random walk x,y values
                const { xValues, yValues } = randomWalk.getRandomWalkSeries(numberOfPointsPerTimerTick);
                for (let i = 0; i < numberOfPointsPerTimerTick; i++) {
                    const x = xValues[i];
                    const y = yValues[i];
                    initialDataSeries[index].data.push({ x, y });
                }
            });
            setDataSeries([...dataSeries]);
            timerIdRef.current = setTimeout(updateFunc, timerInterval);
        };
        const startUpdate = () => {
            if (timerIdRef.current) {
                stopUpdate();
            }
            perfStart = performance.now();
            timerIdRef.current = setTimeout(updateFunc, timerInterval);
        };
        startUpdate();
    }, []);

    return (
        <div>
            <div style={{ width: 800, height: 533 }}>
                <Chart
                    options={{
                        data: dataSeries,
                        primaryAxis,
                        secondaryAxes,
                        initialWidth: 800,
                        initialHeight: 533.33,
                    }}
                />
            </div>
            <p>Time elapsed: {timeElapsed}</p>
        </div>
    );
}
