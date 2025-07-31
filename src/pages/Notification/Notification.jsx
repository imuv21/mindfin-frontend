import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/layout/ProfileHeader";
import { Lock } from "lucide-react";

const Notification = () => {
  const notifications = [
    {
      id: 1,
      title: "Leave Request",
      description: "@Robert Fox has applied for leave",
      time: "Just Now",
      avatar:
        "https://randomuser.me/api/portraits/men/32.jpg", // Replace with your actual image URL
    },
    {
      id: 2,
      title: "Password Update successfully",
      description: "Your password has been updated successfully",
      time: "Yesterday",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="7" width="16" height="14" rx="4" stroke="#2563EB" stroke-width="1.5"/>
      <circle cx="12" cy="14" r="2" stroke="#2563EB" stroke-width="1.5"/>
      <path d="M16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7" stroke="#2563EB" stroke-width="1.5"/>
      </svg>
      , // Lucide icon
    },
  ];

  return (
    <MainLayout>
      <ProfileHeader />
      <div className="mx-4 my-4 bg-white border border-[#D9D9D9] rounded-[8px] px-4">
      {notifications.map((item) => (
        <div key={item.id} className="flex justify-between items-center py-4 border-b border-[#D9D9D9]">
          <div className="flex items-start gap-3">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-[#EEF2FF] flex items-center justify-center rounded-full">
                {item.icon}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 whitespace-nowrap">{item.time}</p>
        </div>
      ))}
    </div>
    </MainLayout>
  );
};

export default Notification;
