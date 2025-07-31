// src/pages/Employees.jsx
import React, { useState } from "react";
import { Search, Filter, PlusCircle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeCard from "@/components/employee/EmployeeCard";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample employee data
  const employees = [
    {
      id: "TH-007",
      name: "Ruben Korsgaard",
      role: "Geekbite",
      employeeId: "Employee-01",
      joinDate: "14/10/2023",
      avatarUrl: null,
    },
    {
      id: "TH-008",
      name: "Sarah Johnson",
      role: "HR Manager",
      employeeId: "Employee-02",
      joinDate: "05/03/2023",
      avatarUrl: null,
    },
    {
      id: "TH-009",
      name: "Michael Chen",
      role: "Software Developer",
      employeeId: "Employee-03",
      joinDate: "22/06/2023",
      avatarUrl: null,
    },
    {
      id: "TH-010",
      name: "Anna Rodriguez",
      role: "Marketing Specialist",
      employeeId: "Employee-04",
      joinDate: "10/01/2024",
      avatarUrl: null,
    },
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );


  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">All Employees</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Employee</span>
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Employees;