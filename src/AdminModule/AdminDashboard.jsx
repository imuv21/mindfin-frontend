import LeadsDataChart from "../AdminModule/Dashboard/LeadsDataChart";
import TotalLeadsAssigned from "../AdminModule/Dashboard/TotalLeadsAssigned";
import ProfileHeader from '../AdminModule/layout/ProfileHeader';
import MainLayout from '../AdminModule/layout/MainLayout';
import { Users } from 'lucide-react'; 

const Dashboard = () => {
    return (
        <MainLayout>
            <ProfileHeader />
            <div className="p-6 bg-[#F8FAFC] min-h-screen">


                <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8" >
                    {[
                        {
                            title: "Admin",
                            count: 956,
                            iconColor: "#FA7697",
                            bgColor:"#FFFFFF"
                           
                        },
                        {
                            title: "Data Entry",
                            count: 766,
                            iconColor: "#3FC28A",
                            bgColor:"#FFFFFF"
                            
                        },
                        {
                            title: "Digital Marketing",
                            count: 556,
                            iconColor: "#FA7697",
                            bgColor:"#FFFFFF"
                            
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="p-5 min-h-[80px] rounded-xl shadow flex items-center gap-4"
                            style={{ backgroundColor: item.bgColor }}
                        >
                            <Users className="w-12 h-12" style={{ color: item.iconColor }} />
                            <div>
                                <p className="font-medium text-gray-700" style={{ fontSize: '12px' }}>{item.title}</p>
                                <h2 className=" font-bold text-gray-900" style={{ fontSize: '18px' }}>{item.count}</h2>
                            </div>
                        </div>
                    ))}
                </div>



                {/* Charts Section - Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LeadsDataChart />
                    <TotalLeadsAssigned />
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;
