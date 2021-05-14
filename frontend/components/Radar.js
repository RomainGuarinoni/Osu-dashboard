import GraphLayout from "./GraphLayout";
import { Radar } from "react-chartjs-2";
export default function RadarGraph({ dataValue }) {
  const data = {
    labels: Object.keys(dataValue),
    datasets: [
      {
        label: "Recent map average",
        data: Object.values(dataValue),
        fill: true,
        backgroundColor: "#1ec09a3d",
        borderColor: "#1ec099",
        pointBackgroundColor: "#1ec099",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#1ec099",
      },
    ],
  };
  const options = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: "white", //set your desired color
        },
      },
    },
    label: {
      color: "blue",
    },
    scale: {
      ticks: {
        callback: function () {
          return "";
        },
        backdropColor: "rgba(0, 0, 0, 0)",
      },
    },
  };

  return (
    <GraphLayout>
      <p>Average stats of recent maps</p>
      <Radar data={data} options={options} />
    </GraphLayout>
  );
}
