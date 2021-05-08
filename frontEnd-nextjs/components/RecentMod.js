import { Doughnut } from "react-chartjs-2";
import GraphLayout from "./GraphLayout";

export default function RecentMod({ dataValue }) {
  const labelsValue = Object.keys(dataValue);
  dataValue = Object.values(dataValue);
  const data = {
    labels: labelsValue,
    datasets: [
      {
        label: "My First Dataset",
        data: dataValue,
        backgroundColor: [
          "#1ec099",
          "#ff9f40",
          "#ff6384",
          "#ffd76e",
          "#72c904",
          "#ffffff",
          "#c62828",
          "#2b08f3",
          "#ffd78f",
          "rgb(255, 205, 86)",
          "rgb(54, 162, 235)",
        ],
        hoverOffset: 4,
        borderColor: "transparent",
      },
    ],
  };

  return (
    <GraphLayout>
      <p>Recent mods played</p>
      <Doughnut data={data} />
    </GraphLayout>
  );
}
