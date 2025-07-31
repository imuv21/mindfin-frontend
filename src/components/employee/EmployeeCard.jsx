// src/components/employee/EmployeeCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EyeIcon, FileEditIcon } from "lucide-react";

const EmployeeCard = ({ employee }) => {
  // Example employee object structure based on the image
  // {
  //   id: "TH-007",
  //   name: "Ruben Korsgaard",
  //   role: "Geekbite",
  //   employeeId: "Employee-01",
  //   joinDate: "Join Date: 14/10/2023",
  //   avatarUrl: "/path/to/avatar.jpg",
  // }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-xs border border-gray-200">
      <CardContent className="p-4 flex flex-col items-center">
        <Avatar className="h-16 w-16 mb-3">
          {employee.avatarUrl ? (
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
          ) : (
            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
          )}
        </Avatar>

        <h3 className="font-medium text-lg">{employee.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{employee.role}</p>

        <div className="w-full grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="text-gray-500">Employee Id</p>
            <p>{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-gray-500">Join Date</p>
            <p>{employee.joinDate}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <FileEditIcon className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;