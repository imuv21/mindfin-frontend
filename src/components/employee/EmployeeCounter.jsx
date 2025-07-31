// src/components/employee/EmployeeCounter.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon } from "lucide-react";

const EmployeeCounter = ({ count, lastUpdated }) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <UsersIcon className="h-4 w-4 text-blue-500 mr-2" />
          <CardTitle className="text-sm font-medium text-gray-500">Total Employee</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{count}</p>
          {lastUpdated && (
            <p className="text-xs text-gray-400">Update: {lastUpdated}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCounter;