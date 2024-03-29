// import DonutCanvas from "./charts/Donut";
import BarChart from "./charts/Bar";

const App = () => {

  return (
    <div>
      {/* <DonutCanvas /> */}
      <BarChart compareBy="path" max={10} />
      <BarChart compareBy="year" />
      <BarChart compareBy="month" />
      <BarChart compareBy="day" filter="month" filterValue="3" />
    </div>
  );
};

export default App;

