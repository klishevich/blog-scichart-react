import SciChartDemo from './SciChartDemo';
import ReactChartsDemo from './ReactChartsDemo';

function App() {
    return (
        <div className='App' style={{ maxWidth: 800 }}>
            <header className='App-header'>
                <h1>SciChart vs React Charts Tanstack</h1>
            </header>
            <SciChartDemo />
            {/* <ReactChartsDemo /> */}
        </div>
    );
}

export default App;
