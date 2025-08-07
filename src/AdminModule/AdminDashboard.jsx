// import LeadsDataChart from "../AdminModule/Dashboard/LeadsDataChart";
// import TotalLeadsAssigned from "../AdminModule/Dashboard/TotalLeadsAssigned";
// import ProfileHeader from '../AdminModule/layout/ProfileHeader';
// import MainLayout from '../AdminModule/layout/MainLayout';
// import { Users } from 'lucide-react';
// import api from '../helpers/Api';

// const Dashboard = () => {
//     return (
//         <MainLayout>
//             <ProfileHeader />
//             <div className="p-6 bg-[#F8FAFC] min-h-screen">


//                 <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8" >
//                     {[
//                         {
//                             title: "Admin",
//                             count: 956,
//                             iconColor: "#FA7697",
//                             iconBgColor: "#FFF9E9", 
//                             bgColor: "#FFFFFF"
//                         },
//                         {
//                             title: "Data Entry",
//                             count: 766,
//                             iconColor: "#3FC28A",
//                             iconBgColor: "#E9FFF3", 
//                             bgColor: "#FFFFFF"
//                         },
//                         {
//                             title: "Digital Marketing",
//                             count: 556,
//                             iconColor: "#FA7697",
//                             iconBgColor: "#FDF2F8", 
//                             bgColor: "#FFFFFF"
//                         },
//                     ].map((item, idx) => (
//                         <div
//                             key={idx}
//                             className="p-5 min-h-[80px] rounded-xl shadow flex items-center gap-4"
//                             style={{ backgroundColor: item.bgColor }}
//                         >
//                             <div className="p-3 rounded-xl" style={{ backgroundColor: item.iconBgColor }}>
//                                 <Users className="w-8 h-8" style={{ color: item.iconColor }} />
//                             </div>
//                             <div>
//                                 <p className="font-medium text-[#64748B]" style={{ fontSize: '12px' }}>{item.title}</p>
//                                 <h2 className="font-bold text-gray-900" style={{ fontSize: '18px' }}>{item.count}</h2>
//                             </div>
//                         </div>
//                     ))}

//                 </div>



//                 {/* Charts Section - Responsive */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <LeadsDataChart />
//                     <TotalLeadsAssigned />
//                 </div>
//             </div>
//         </MainLayout>
//     );
// };

// export default Dashboard;



// with api testing
import { useEffect, useState } from 'react';
import api from '../helpers/Api';
import { Users } from 'lucide-react';
import LeadsDataChart from "../AdminModule/Dashboard/LeadsDataChart";
import TotalLeadsAssigned from "../AdminModule/Dashboard/TotalLeadsAssigned";
import ProfileHeader from '../AdminModule/layout/ProfileHeader';
import MainLayout from '../AdminModule/layout/MainLayout';

const Dashboard = () => {
    const [leadCounts, setLeadCounts] = useState({
        "Admin": 0,
        "Data entry": 0,
        "Digital Marketing": 0,
    });

    useEffect(() => {
        const fetchLeadCounts = async () => {
            try {
                const branchId = localStorage.getItem('branchId');
                console.log("Branch ID from localStorage:", branchId);
                if (!branchId) {
                    throw new Error("Branch ID is missing");
                }

                const { data, status } = await api.getMonthlyLeadCountsByDesignation(branchId);
                if (status === 200) {
                    setLeadCounts(data?.data);
                }
            } catch (error) {
                console.error("Failed to fetch lead counts", error);
                Toastify.error(error?.response?.data?.message || error.message || "Something went wrong");
            }
        };

        fetchLeadCounts();
    }, []);


    const cardData = [
        {
            title: "Admin",
            count: leadCounts["Admin"] || 0,
            iconColor: "#FA7697",
            iconBgColor: "#FFF9E9",
            bgColor: "#FFFFFF"
        },
        {
            title: "Data Entry",
            count: leadCounts["Data entry"] || 0, // Note: API returns "Data entry" (case sensitive)
            iconColor: "#3FC28A",
            iconBgColor: "#E9FFF3",
            bgColor: "#FFFFFF"
        },
        {
            title: "Digital Marketing",
            count: leadCounts["Digital Marketing"] || 0,
            iconColor: "#FA7697",
            iconBgColor: "#FDF2F8",
            bgColor: "#FFFFFF"
        },
    ];

    return (
        <MainLayout>
            <ProfileHeader />
            <div className="p-6 bg-[#F8FAFC] min-h-screen">
                <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {cardData.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-5 min-h-[80px] rounded-xl shadow flex items-center gap-4"
                            style={{ backgroundColor: item.bgColor }}
                        >
                            <div className="p-3 rounded-xl" style={{ backgroundColor: item.iconBgColor }}>
                                <Users className="w-8 h-8" style={{ color: item.iconColor }} />
                            </div>
                            <div>
                                <p className="font-medium text-[#64748B]" style={{ fontSize: '12px' }}>{item.title}</p>
                                <h2 className="font-bold text-gray-900" style={{ fontSize: '18px' }}>{item.count}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LeadsDataChart />
                    <TotalLeadsAssigned />
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;
