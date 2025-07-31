// import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

// const usersOffToday = [
//   { name: 'John Doe', date: '25 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=3' },
//   { name: 'Alexa Johns', date: '26 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=5' },
// ];

// const birthdaysToday = [
//   { name: 'John Doe', date: '25 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=3' },
// ];

// export default function HolidayCalendar() {
//   return (
//     <div className="bg-white  border border-[#D9D9D9] rounded-[8px]  border p-4 w-full max-w-sm">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-lg text-gray-800">Holiday calendar</h2>
//         <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
//           <CalendarDays className="w-4 h-4" />
//         </div>
//       </div>

//       {/* Calendar Navigation */}
//       <div className="flex items-center justify-between mb-2">
//         <button className="p-1 rounded hover:bg-gray-100">
//           <ChevronLeft className="w-4 h-4" />
//         </button>
//         <span className="font-medium text-sm">July, 2023</span>
//         <button className="p-1 rounded hover:bg-gray-100">
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Days of Week */}
//       <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
//         {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
//           <div key={i}>{d}</div>
//         ))}
//       </div>

//       {/* Dates */}
//       <div className="grid grid-cols-7 text-center text-sm text-gray-700 gap-y-2 mb-4">
//         {Array.from({ length: 31 }, (_, i) => {
//           const day = i + 1;
//           const isToday = [6, 8].includes(day);
//           const isSelected = day === 8;
//           return (
//             <div key={day} className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : isToday ? 'text-indigo-600' : ''}`}>
//               {day}
//             </div>
//           );
//         })}
//       </div>

//       {/* Who's Off */}
//       <div className="mb-4">
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">Who’s Off Today</h3>
//         <p className="text-xs text-gray-400 mb-2">Thursday, 07 Oct 2025</p>
//         <div className="space-y-2">
//           {usersOffToday.map((user, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <img src={user.avatar} className="w-6 h-6 rounded-full" />
//               <div>
//                 <p className="text-sm text-gray-800">{user.name}</p>
//                 <p className="text-xs text-gray-400">{user.date}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Holiday Info */}
//       <div className="mb-4">
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">Holiday</h3>
//         <p className="text-xs text-gray-400">Thursday, 08 July 2025</p>
//         <p className="text-xs text-rose-500">International Day for Biological Diversity</p>
//       </div>

//       {/* Birthdays */}
//       <div>
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">Today Birthdays</h3>
//         <p className="text-xs text-gray-400 mb-2">Thursday, 08 Oct 2025</p>
//         <div className="flex items-center gap-2">
//           <img src={birthdaysToday[0].avatar} className="w-6 h-6 rounded-full" />
//           <div>
//             <p className="text-sm text-gray-800">{birthdaysToday[0].name}</p>
//             <p className="text-xs text-gray-400">{birthdaysToday[0].date}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ---------senond response




// import { useState } from 'react';
// import {
//   startOfMonth,
//   endOfMonth,
//   startOfWeek,
//   endOfWeek,
//   addDays,
//   addMonths,
//   subMonths,
//   isSameDay,
//   isSameMonth,
//   format,
//   isWithinInterval
// } from 'date-fns';

// import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

// const usersOffToday = [
//   { name: 'John Doe', date: '25 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=3' },
//   { name: 'Alexa Johns', date: '26 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=5' },
// ];

// const birthdaysToday = [
//   { name: 'John Doe', date: '25 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=3' },
// ];

// export default function HolidayCalendar() {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [range, setRange] = useState({ start: null, end: null });

//   const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
//   const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

//   const handleDateClick = (day) => {
//     if (range.start && !range.end) {
//       if (day > range.start) {
//         setRange({ ...range, end: day });
//       } else {
//         setRange({ start: day, end: null });
//       }
//     } else {
//       setSelectedDate(day);
//       setRange({ start: day, end: null });
//     }
//   };

//   const renderCalendarDays = () => {
//     const monthStart = startOfMonth(currentMonth);
//     const monthEnd = endOfMonth(monthStart);
//     const startDate = startOfWeek(monthStart);
//     const endDate = endOfWeek(monthEnd);
//     const dateFormat = 'd';
//     const rows = [];

//     let days = [];
//     let day = startDate;

//     while (day <= endDate) {
//       for (let i = 0; i < 7; i++) {
//         const formattedDate = format(day, dateFormat);
//         const cloneDay = day;

//         const isSelected = selectedDate && isSameDay(day, selectedDate);
//         const isInRange =
//           range.start &&
//           range.end &&
//           isWithinInterval(cloneDay, { start: range.start, end: range.end });

//         const isCurrentMonth = isSameMonth(day, currentMonth);

//         days.push(
//           <div
//             key={day}
//             onClick={() => handleDateClick(cloneDay)}
//             className={`text-sm w-8 h-8 flex items-center justify-center mx-auto rounded-full cursor-pointer
//               ${isSelected ? 'bg-indigo-600 text-white' :
//                 isInRange ? 'bg-indigo-200 text-indigo-800' :
//                 isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
//               hover:bg-gray-100`}
//           >
//             {formattedDate}
//           </div>
//         );
//         day = addDays(day, 1);
//       }
//       rows.push(
//         <div className="grid grid-cols-7 text-center" key={day}>
//           {days}
//         </div>
//       );
//       days = [];
//     }
//     return <div className="space-y-1">{rows}</div>;
//   };

//   return (
//     <div className="bg-white border border-[#D9D9D9] rounded-[8px] p-4 w-full max-w-sm">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-lg text-gray-800">Holiday calendar</h2>
//         <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
//           <CalendarDays className="w-4 h-4" />
//         </div>
//       </div>

//       {/* Calendar Navigation */}
//       <div className="flex items-center justify-between mb-2">
//         <button className="p-1 rounded hover:bg-gray-100" onClick={handlePrevMonth}>
//           <ChevronLeft className="w-4 h-4" />
//         </button>
//         <span className="font-medium text-sm">{format(currentMonth, 'MMMM, yyyy')}</span>
//         <button className="p-1 rounded hover:bg-gray-100" onClick={handleNextMonth}>
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Days of Week */}
//       <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
//         {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
//           <div key={i}>{d}</div>
//         ))}
//       </div>

//       {/* Dates */}
//       {renderCalendarDays()}

//       {/* Who’s Off */}
//       <div className="mt-4 mb-4">
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">Who’s Off Today</h3>
//         <p className="text-xs text-gray-400 mb-2">{format(new Date(), 'EEEE, dd MMM yyyy')}</p>
//         <div className="space-y-2">
//           {usersOffToday.map((user, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <img src={user.avatar} className="w-6 h-6 rounded-full" alt={user.name} />
//               <div>
//                 <p className="text-sm text-gray-800">{user.name}</p>
//                 <p className="text-xs text-gray-400">{user.date}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Holiday Info */}
//       <div className="mb-4">
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">Holiday</h3>
//         <p className="text-xs text-gray-400">Tuesday, 08 July 2025</p>
//         <p className="text-xs text-rose-500">International Day for Biological Diversity</p>
//       </div>

//       {/* Birthdays */}
//       <div>
//         <h3 className="font-semibold text-sm text-gray-800 mb-1">Today Birthdays</h3>
//         <p className="text-xs text-gray-400 mb-2">{format(new Date(), 'EEEE, dd MMM yyyy')}</p>
//         <div className="flex items-center gap-2">
//           <img src={birthdaysToday[0].avatar} className="w-6 h-6 rounded-full" alt={birthdaysToday[0].name} />
//           <div>
//             <p className="text-sm text-gray-800">{birthdaysToday[0].name}</p>
//             <p className="text-xs text-gray-400">{birthdaysToday[0].date}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  format,
  isWithinInterval,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../helpers/Api';
import { formatDate } from '../../helpers/conversion';

const usersOffToday = [
  { name: 'John Doe', date: '25 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Alexa Johns', date: '26 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=5' },
];

const birthdaysToday = [
  { name: 'John Doe', date: '25 Oct - 27 Oct', avatar: 'https://i.pravatar.cc/150?img=3' },
];

export default function HolidayCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [birthday,setBirthday] = useState([])
  const [leaves,setLeaves] = useState([])
  const [holiday,setHoliday] = useState([])

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const filterByDate = async (startDate, endDate = null) => {
    // const baseUrl = '{{host}}/hr/custom-dates';

    console.log("filter by date working");
    
    const query = endDate
      ? `?date=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`
      : `?date=${format(startDate, 'yyyy-MM-dd')}`;

    try {

      const {data,status} = await api.getCustomDateDetails(query)
      console.log(data,"custom Data");

      if (status === 200) {
        setHoliday(data?.holidays)
        setLeaves(data?.leaves)
        setBirthday(data?.birthdays)
      }
 
      
    } catch (error) {
      console.log(error,"error");
      
    }
  };

  const handleDateClick = (day) => {
    if (range.start && !range.end) {
      if (day > range.start) {
        const updatedRange = { start: range.start, end: day };
        setRange(updatedRange);
        filterByDate(updatedRange.start, updatedRange.end); // Range selected
      } else {
        setRange({ start: day, end: null });
      }
    } else {
      setSelectedDate(day);
      setRange({ start: day, end: null });
      filterByDate(day); // Single date selected
    }
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = 'd';
    const rows = [];

    console.log(range,"fkk");
    

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;

        // const isSelected = selectedDate && isSameDay(day, selectedDate);
        // const isInRange =
        //   range.start &&
        //   range.end &&
        //   isWithinInterval(cloneDay, { start: range.start, end: range.end });

        // const isCurrentMonth = isSameMonth(day, currentMonth);

        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isInRange = range.start && range.end && isWithinInterval(cloneDay, { start: range.start, end: range.end });
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, currentMonth);



        days.push(
          // <div
          //   key={day}
          //   onClick={() => handleDateClick(cloneDay)}
          //   className={`text-sm w-8 h-8 flex items-center justify-center mx-auto rounded-full cursor-pointer
          //     ${isSelected ? 'bg-indigo-600 text-white' :
          //       isInRange ? 'bg-indigo-200 text-indigo-800' :
          //       isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
          //     hover:bg-gray-100`}
          // >
          //   {formattedDate}
          // </div>
          <div
  key={day}
  onClick={() => handleDateClick(cloneDay)}
  className={`text-sm w-8 h-8 flex items-center justify-center mx-auto rounded-full cursor-pointer
    ${isSelected ? 'bg-indigo-600 text-white' :
      isInRange ? 'bg-indigo-200 text-indigo-800' :
      isToday ? 'bg-green-500 text-white' :
      isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
    hover:bg-gray-100`}
>
  {formattedDate}
</div>

        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 text-center" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };


  const groupedLeaves = Object.values(
    leaves.reduce((acc, curr) => {
      const id = curr.employee._id;
      const createdAt = new Date(curr.createdAt);
  
      if (!acc[id]) {
        acc[id] = {
          ...curr,
          startDate: createdAt,
          endDate: createdAt,
        };
      } else {
        acc[id].startDate = createdAt < acc[id].startDate ? createdAt : acc[id].startDate;
        acc[id].endDate = createdAt > acc[id].endDate ? createdAt : acc[id].endDate;
      }
  
      return acc;
    }, {})
  );

  console.log(birthday,"bday")
  console.log(holiday,"hday");
  console.log(leaves,"lve");
  
  
  
  return (
    <div className="bg-white border border-[#D9D9D9] rounded-[8px] p-4 w-full max-w-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Holiday calendar</h2>
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
          <CalendarDays className="w-4 h-4" />
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button className="p-1 rounded hover:bg-gray-100" onClick={handlePrevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-medium text-sm">{format(currentMonth, 'MMMM, yyyy')}</span>
        <button className="p-1 rounded hover:bg-gray-100" onClick={handleNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      {renderCalendarDays()}

      {/* Who’s Off */}
      <div className="mt-4 mb-4">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">Who’s Off </h3>
        {/* <p className="text-xs text-gray-400 mb-2">{`${format(new Date(range?.start) , 'EEEE, dd MMM yyyy')} - ${format(new Date(range?.end) , 'EEEE, dd MMM yyyy')} ` }</p> */}
        {range?.start && (
  <p className="text-xs text-gray-400 mb-2">
    {format(new Date(range.start), 'EEEE, dd MMM yyyy')}
    {range?.end && ` - ${format(new Date(range.end), 'EEEE, dd MMM yyyy')}`}
  </p>
)}
        {/* <div className="space-y-2">

          
          {groupedLeaves.map((user, i) => (

            
            <div key={i} className="flex items-center gap-2">
              <img src={user?.employee?.profileImg?.length > 0 ? user?.employee?.profileImg[0] : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740" } className="w-6 h-6 rounded-full" alt={user.name} />
              <div>
                <p className="text-sm text-gray-800">{user?.employee?.firstName} {user?.employee?.lastName}</p>
                <p className="text-xs text-gray-400"> {format(user.startDate, 'dd MMM yyyy')} - {format(user.endDate, 'dd MMM yyyy')}</p>

              </div>
            </div>
          ))}
        </div> */}
        <div className="space-y-2">
  {groupedLeaves.length === 0 ? (
    <p className="text-xs text-gray-400">No absentees found</p>
  ) : (
    groupedLeaves.map((user, i) => (
      <div key={i} className="flex items-center gap-2">
        <img
          src={
            user?.employee?.profileImg?.length > 0
              ? user?.employee?.profileImg[0]
              : "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740"
          }
          className="w-6 h-6 rounded-full"
          alt={`${user?.employee?.firstName} ${user?.employee?.lastName}`}
        />
        <div>
          <p className="text-sm text-gray-800">
            {user?.employee?.firstName} {user?.employee?.lastName}
          </p>
          <p className="text-xs text-gray-400">
            {format(user.startDate, 'dd MMM yyyy')} - {format(user.endDate, 'dd MMM yyyy')}
          </p>
        </div>
      </div>
    ))
  )}
</div>

      </div>

      {/* Holiday Info */}
      <div className="mb-4">
  <h3 className="font-semibold text-sm text-gray-800 mb-1">Holiday</h3>

  {holiday?.length === 0 ? (
    <p className="text-xs text-gray-400">No holidays found</p>
  ) : (
    holiday.map((item, i) => (
      <div key={i}>
        <p className="text-xs text-gray-400">{formatDate(item?.holidayDate)}</p>
        <p className="text-xs text-rose-500">{item?.holidayName}</p>
      </div>
    ))
  )}
</div>


      {/* Birthdays */}
      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-1"> Birthdays</h3>
        {/* <p className="text-xs text-gray-400 mb-2">{format(new Date(), 'EEEE, dd MMM yyyy')}</p> */}
        {range?.start && (
  <p className="text-xs text-gray-400 mb-2">
    {format(new Date(range.start), 'EEEE, dd MMM yyyy')}
    {range?.end && ` - ${format(new Date(range.end), 'EEEE, dd MMM yyyy')}`}
  </p>
)}
        {

birthday?.length === 0 ? (
  <p className="text-xs text-gray-400">No Birthdays found</p>
) : (


          birthday?.map((item)=>(
            <div className="flex items-center gap-2">
            <img src={item?.profileImg[0]} className="w-6 h-6 rounded-full" alt={item?.firstName} />
            <div>
              <p className="text-sm text-gray-800">{item?.firstName}{item?.lastName} </p>
              <p className="text-xs text-gray-400">{format(new Date(item?.DOB), "MMM dd")}</p>
            </div>
          </div>
          ))
       ) }
       
      </div>
    </div>
  );
}
