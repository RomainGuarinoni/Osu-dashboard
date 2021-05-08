import { Line } from "react-chartjs-2";
import GraphLayout from "../components/GraphLayout";
import { useEffect } from "react";
import React from "react";
export default function RecentAccuracy({ dataValue, labelsValue }) {
  console.log(dataValue);
  const data = {
    labels: labelsValue,
    datasets: [
      {
        label: "Accuracy",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#ff6384",
        borderColor: "#ff6384",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#ff6384",
        pointBackgroundColor: "#ff6384",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#ff6384",
        pointHoverBorderColor: "#ff6384",
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
      },
      xAxis: {
        ticks: {
          backdropColor: "rgba(255, 255, 255, 1)",
          color: "rgba(255, 255, 255, 0.5)",
        },
        grid: {
          color: "rgba(255,255,255,0.2)",
          display: false,
        },
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
      <p>Recent Difficulty evolution</p>
      <Line data={data} options={options} />
    </GraphLayout>
  );
}
