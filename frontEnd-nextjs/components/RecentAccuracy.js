import { Line } from "react-chartjs-2";
import style from "../styles/RecentAccuracy.module.css";
import { useEffect } from "react";
import React from "react";
import { faBatteryThreeQuarters } from "@fortawesome/free-solid-svg-icons";
export default function RecentAccuracy({ dataValue, labelsValue }) {
  console.log(dataValue);
  const data = {
    labels: labelsValue,
    datasets: [
      {
        label: "Accuracy",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#40C4B2",
        borderColor: "#40C4B2",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
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
        max: 1,
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
    <div className={style.container}>
      <p>Recent accuracy evolution</p>
      <Line data={data} options={options} />
    </div>
  );
}
