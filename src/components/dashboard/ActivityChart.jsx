// src/components/dashboard/ActivityChart.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ActivityChart = ({ data, title = "Activity" }) => {
  // Sample data structure
  // const data = [
  //   { day: 'Mo', value: 4 },
  //   { day: 'Tu', value: 3 },
  //   { day: 'We', value: 2 },
  //   { day: 'Th', value: 6 },
  //   { day: 'Fr', value: 8 },
  //   { day: 'Sa', value: 9 },
  //   { day: 'Su', value: 4 },
  // ];

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
              />
              <YAxis hide={true} />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: "4px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              />
              <Bar
                dataKey="value"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;