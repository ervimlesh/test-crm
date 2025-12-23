import { BarChart } from '@mui/x-charts/BarChart';
export default function RevenueChart() {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const data = [100, 25, 33, 12, 5, 66, 80, 60, 13, 66, 16, 7];

  const monthColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E7E9ED",
    "#8BC34A",
    "#00BCD4",
    "#F44336",
    "#9C27B0",
    "#3F51B5",
  ];
  return (
    <>
      <BarChart
        series={[{ data }]}
        xAxis={[
          {
            data: months,
            scaleType: "band",
            colorMap: {
              type: "ordinal",
              values: months,
              colors: monthColors,
            },
          },
        ]}
        height={300}
        margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
      />
    </>
  );
}


// ==========================================================Dynamic chart===========================================

// import { BarChart } from "@mui/x-charts/BarChart";
// import { useCtmFlightDeals } from "../context/CtmFlightDealsContext.jsx";
// import { useMemo } from "react";

// export default function RevenueChart() {
//   const { ctmFlightDeals } = useCtmFlightDeals();


//   const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

//   const monthlyRevenue = useMemo(() => {
//     const revenueArray = Array(12).fill(0);

//     ctmFlightDeals?.forEach((flight) => {
//       if (flight.ticketmco === "ticketMco") {
//         const date = new Date(flight.createdAt);
//         const monthIndex = date.getMonth(); 
//         const taxValue = parseFloat(flight.taxes) || 0;
//         revenueArray[monthIndex] += taxValue;
//       }
//     });

//     return revenueArray;
//   }, [ctmFlightDeals]);

  
//   const monthColors = [
//     "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
//     "#9966FF", "#FF9F40", "#E7E9ED", "#8BC34A",
//     "#00BCD4", "#F44336", "#9C27B0", "#3F51B5",
//   ];

//   return (
//     <BarChart
//       series={[{ data: monthlyRevenue, label: "Monthly Tax Revenue ($)" }]}
//       xAxis={[
//         {
//           data: months,
//           scaleType: "band",
//           colorMap: {
//             type: "ordinal",
//             values: months,
//             colors: monthColors,
//           },
//         },
//       ]}
//       height={350}
//       margin={{ top: 20, bottom: 50, left: 60, right: 20 }}
//       sx={{
//         ".MuiChartsLegend-root": { display: "none" },
//         ".MuiChartsAxis-label": { fontSize: "14px", fontWeight: "bold" },
//         ".MuiChartsTooltip-root": { fontSize: "14px" },
//       }}
//     />
//   );
// }
