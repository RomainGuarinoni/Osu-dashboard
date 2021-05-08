import GraphLayout from "./GraphLayout";
import { Line } from "react-chartjs-2";
export default function RankEvolution({ dataValue }) {
  let labelsValue = new Array();
  dataValue.forEach(() => labelsValue.push("test"));
  const data = {
    labels: labelsValue,
    datasets: [
      {
        label: "Rank",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#ff9f40",
        borderColor: "#ff9f40",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#ff9f40",
        pointBackgroundColor: "#ff9f40",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#ff9f40",
        pointHoverBorderColor: "#ff9f40",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataValue,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxis: {
        ticks: {
          backdropColor: "rgba(255, 255, 255, 1)",
          color: "rgba(255, 255, 255, 0.5)",
          padding: 0,
        },

        grid: {
          color: "rgba(255,255,255,0.2)",
          display: false,
        },
        title: {
          display: true,
          text: "test ",
          color: "white",
        },
        reverse: true,
      },
      xAxis: {
        ticks: {
          reverse: true,
          backdropColor: "rgba(255, 255, 255, 1)",
          color: "rgba(255, 255, 255, 0.5)",
          display: false,
        },
        grid: {
          color: "rgba(255,255,255,0.2)",
          display: false,
        },
        display: false,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", //set your desired color
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <GraphLayout>
      <p>Rank evolution</p>
      <Line data={data} options={options} />
    </GraphLayout>
  );
}
