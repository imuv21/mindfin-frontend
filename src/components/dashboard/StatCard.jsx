// // src/components/dashboard/StatCard.jsx
// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

// const StatCard = ({ 
//   icon: Icon, 
//   title, 
//   value, 
//   description = null,
//   trend = null,
//   trendDirection = "up", // "up" or "down"
//   className = "" 
// }) => {
//   return (
//     <Card className={`bg-white ${className}`}>
//       <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
//         <CardTitle className="text-sm font-medium text-gray-500">
//           {title}
//         </CardTitle>
//         {Icon && <Icon className="h-4 w-4 text-gray-500" />}
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-1">
//           <p className="text-2xl font-bold">{value}</p>
//           {description && <p className="text-xs text-gray-500">{description}</p>}
//           {trend && (
//             <div className="flex items-center pt-1">
//               <span
//                 className={`text-xs font-medium ${
//                   trendDirection === "up"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 {trendDirection === "up" ? "+" : "-"}
//                 {trend}
//               </span>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default StatCard;