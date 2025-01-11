import SciChartPureDemo from './SciChartPureDemo';
import SciChartReactDemo from './SciChartReactDemo';

function App() {
    return (
        <div className='App'>
            <header className='App-header'>
                <h1>scichart-react vs scichart</h1>
                <p>Comparison of creating charts with scichart-react and just with scichart</p>
            </header>
            <SciChartReactDemo />
            <div style={{ height: 10 }} />
            <SciChartPureDemo />
        </div>
    );
}

export default App;
