import React from 'react';
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, BarChart, Bar } from "recharts";
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/layout/ProfileHeader";
import '../Telecaller/telecaller.css';


const Overview = () => {

    const dummyData = [
        { date: "November 01", leads: 12000 },
        { date: "November 04", leads: 500 },
        { date: "November 07", leads: 4500 },
        { date: "November 10", leads: 600 },
        { date: "November 13", leads: 4000 },
        { date: "November 16", leads: 3500 },
        { date: "November 19", leads: 9000 },
        { date: "November 22", leads: 7000 },
        { date: "November 25", leads: 8000 },
        { date: "November 28", leads: 5500 }
    ];

    const disbursalData = [
        { name: "Bajaj", value: 700, fill: "#4F77FF" },
        { name: "HDFC", value: 750, fill: "#26C2F7" },
        { name: "Digital Marketing", value: 600, fill: "#CBD5E1" },
    ];

    const processDummyData = [
        { name: "Eligible", value: 914, color: "#3B82F6" },
        { name: "Not Eligible", value: 54, color: "#60A5FA" },
        { name: "Rejected", value: 47, color: "#93C5FD" },
        { name: "Document Pending", value: 71, color: "#BFDBFE" },
        { name: "RNR", value: 79, color: "#DBEAFE" },
    ];
    const totalLeads = processDummyData.reduce((sum, item) => sum + item.value, 0);

    const bankProcessData = [
        { name: "Total Logins", value: 914, color: "#3B82F6" },
        { name: "Total Banks", value: 574, color: "#60A5FA" },
        { name: "Eligible", value: 447, color: "#38BDF8" },
    ];
    const totalBankLeads = bankProcessData.reduce((sum, item) => sum + item.value, 0);

    const loanTypeData = [
        { name: "Personal Loan", value: 914, color: "#3B82F6" },
        { name: "Car Loan", value: 574, color: "#60A5FA" },
        { name: "Business Loan", value: 447, color: "#CBD5E1" },
        { name: "Overdraft Loan", value: 271, color: "#93C5FD" },
    ];
    const totalLoanLeads = loanTypeData.reduce((sum, item) => sum + item.value, 0);


    return (
        <MainLayout>
            <ProfileHeader name="Overview" breadcrumbs={["This is an overview"]} />

            <div className='teleCont'>
                <div className="teleSubContOne">
                    <div className="ltaGraph border">
                        <div className="teleContHead">
                            <div className="teleHeading">Leads Total Assigned</div>
                            <select name="filter" className="styledSelect">
                                <option value="month">This Month</option>
                                <option value="week">This Week</option>
                                <option value="today">Today</option>
                            </select>
                        </div>

                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={dummyData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(val) => (val >= 1000 ? `${val / 1000}K` : val)} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="subOne">
                        <div className="dlpGraph border">
                            <div className="teleContHead">
                                <div className="teleHeading">Bank Process</div>
                                <select name="filterProcess" className="styledSelect">
                                    <option value="month">This Month</option>
                                    <option value="week">This Week</option>
                                    <option value="today">Today</option>
                                </select>
                            </div>

                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={bankProcessData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={450}>
                                        {bankProcessData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pieTotalCenter">
                                <div className="label">Total</div>
                                <div className="value">{totalBankLeads}</div>
                            </div>

                            <div className="leadTableWrapper">
                                <table className="leadTable">
                                    <thead>
                                        <tr>
                                            <th>PROCESS</th>
                                            <th style={{ textAlign: "right" }}>TOTAL LEADS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bankProcessData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="leadStatusCell">
                                                    <span className="statusDot" style={{ backgroundColor: item.color }} />
                                                    {item.name}
                                                </td>
                                                <td style={{ textAlign: "right" }}>{item.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="dlpGraph border">
                            <div className="teleContHead">
                                <div className="teleHeading">Loan Type</div>
                                <select name="filterProcess" className="styledSelect">
                                    <option value="month">This Month</option>
                                    <option value="week">This Week</option>
                                    <option value="today">Today</option>
                                </select>
                            </div>

                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={loanTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={450}>
                                        {loanTypeData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pieTotalCenter">
                                <div className="label">Total</div>
                                <div className="value">{totalLoanLeads}</div>
                            </div>

                            <div className="leadTableWrapper">
                                <table className="leadTable">
                                    <thead>
                                        <tr>
                                            <th>LOAN TYPES</th>
                                            <th style={{ textAlign: "right" }}>LOANS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loanTypeData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="leadStatusCell">
                                                    <span className="statusDot" style={{ backgroundColor: item.color }} />
                                                    {item.name}
                                                </td>
                                                <td style={{ textAlign: "right" }}>{item.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="teleSubContTwo">
                    <div className="dlpGraph border">
                        <div className="teleContHead">
                            <div className="teleHeading">Data of Lead Process</div>
                            <select name="filterProcess" className="styledSelect">
                                <option value="month">This Month</option>
                                <option value="week">This Week</option>
                                <option value="today">Today</option>
                            </select>
                        </div>

                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={processDummyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={450}>
                                    {processDummyData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pieTotalCenter">
                            <div className="label">Total</div>
                            <div className="value">{totalLeads}</div>
                        </div>

                        <div className="leadTableWrapper">
                            <table className="leadTable">
                                <thead>
                                    <tr>
                                        <th>LEAD STATUS</th>
                                        <th style={{ textAlign: "right" }}>TOTAL LEADS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processDummyData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="leadStatusCell">
                                                <span className="statusDot" style={{ backgroundColor: item.color }} />
                                                {item.name}
                                            </td>
                                            <td style={{ textAlign: "right" }}>{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="dlpGraph border disbursalChart">
                        <div className="teleContHead">
                            <div className="teleHeading">Disbursal Process</div>
                            <select name="filterDisbursal" className="styledSelect" aria-label="Filter Disbursal">
                                <option value="month">This Month</option>
                                <option value="week">This Week</option>
                                <option value="today">Today</option>
                            </select>
                        </div>

                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={disbursalData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                                <YAxis tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)} />
                                <Tooltip />
                                <Bar dataKey="value" barSize={60} radius={[8, 8, 4, 4]}>
                                    {disbursalData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Overview;