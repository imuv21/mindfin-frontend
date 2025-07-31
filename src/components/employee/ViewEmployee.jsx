import { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { BriefcaseIcon, CalendarIcon, ClockIcon, CurrencyIcon, DocumentIcon, LocationIcon, LockIcon, PersonIcon } from '../../Svg';
import MainLayout from '../layout/MainLayout';
import { ChevronDownIcon, Download, Eye, FileText } from 'lucide-react';
import ProfileHeader from '../layout/ProfileHeader';
import DocumentModal from './DocumentModal';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../helpers/Api';
import Toastify from '../../helpers/Toastify';
import { formatAttendence, formatDate, formatLeave, getISTTimeOnly } from '../../helpers/conversion';


export default function ViewEmployee() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Personal Info');
    const [employee, setEmployee] = useState([])
    const [attentence, setAttentence] = useState([])
    const [leave, setLeave] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [attentenceLoading,setAttentenceLoading] = useState(false)
    const [leaveLoading,setLeaveLoading] = useState(false)
    // const lea
    
console.log(employee,"employee");



    const tabs = [
        { id: 'Personal Info' },
        { id: 'Profession Info' },
        { id: 'Documents' },
        { id: 'Branch  Access' },
        { id: 'Payroll' },
        { id: 'Attendance' },
        { id: 'Leaves' }
    ];

    const personalinfo = [
        { label: 'Full Name', value: `${employee?.firstName} ${employee?.lastName}` },
        { label: 'Gender', value: `${employee?.gender}` },
        { label: 'Date of Birth', value: `${formatDate(employee?.DOB)}` }, //31 Jan 1997
        { label: 'Marital Status', value: `${employee?.maritalStatus}` },
        { label: 'Nationality', value: `${employee?.nationality}` },
        { label: 'Blood group', value: `${employee?.bloodgroup}` },
        { label: 'Email Address', value: `${employee?.email}` },
        { label: 'Phone number', value: `${employee?.phone}` },
    ];
    const address = [
        { label: 'Country', value: `${employee?.nationality}` },
        { label: 'City', value: `${employee?.city}` },
        { label: 'State/Province', value: `${employee?.state}` },
        { label: 'Postal Code', value: `${employee?.state}` },
    ];

    const profinfo = [
        { label: 'Employee Id', value: `${employee?.employeeId}` },
        { label: 'User Name', value: `${employee?.userName}` },
        { label: 'Employee Type', value: `${employee?.employeeType}` },
        { label: 'Email Id', value: `${employee?.professionalEmail}` },
        // { label: 'Branch', value: 'Branch 1' },
        {
            label: 'Branch',
            value: employee?.branch?.length
                ? employee.branch.map(b => b.name).join('\n')
                : '-',
        },
        { label: 'Destination', value: `${employee?.designation?.designation}` },
        { label: 'Working Days', value: `${employee?.workingDays}` },
        { label: 'Joining Date', value: `${formatDate(employee?.dateOfJoin)}` },
        { label: 'Leave Date', value: `${formatDate(employee?.dateOfLeave)}` },
        { label: 'Office Location', value: `${employee?.attendenceLoacation}` },
    ];

    const bankinfo = [
        { label: 'Bank Name', value: `${employee?.bankName}` },
        { label: 'Account Name', value: `${employee?.accountName}` },
        { label: 'Branch', value: `${employee?.bankBranchName}` },
        { label: 'Account Number', value: `${employee?.accountNo}` },
        { label: 'SWIFT/BIC', value: `${employee?.SWIFT}` },
        { label: 'IBAN', value: `${employee?.IBAN}` },
        { label: 'IFSC Code', value: `${employee?.IFSC}` },
    ];

    const salaryinfo = [
        { label: 'Salary', value: `${employee?.salary}` },
        { label: 'Salary Start Date', value: `${formatDate(employee?.salaryStartDate)}` },
        { label: 'Salary End Date', value: `${formatDate(employee?.salaryEndDate)}` },
        { label: 'Attendance Location', value: `${employee?.attendenceLoacation}` },
        { label: 'Biometric/IP Address', value: `${employee?.bioMetricIp}` },
    ];


   

    const fetchEmployee = async () => {
        try {
        const {data,status} = await api.getAnEmployee(id)
            console.log(data,"viewdata");
            

        if(status ===200){
            setEmployee(data?.data)
        }
        } catch (error) {
            Toastify.error(error.response.data.message || `something went wrong`);
        }


    }

    const fetchAttendence = async () => {
        setAttentenceLoading(true)
        try {
            const { data, status } = await api.getEmployeeCumulativeAttenedence(id)

            // console.log(data,"attentence");

            if (status === 200) {
                setAttentence(data?.data?.data)
            }

        } catch (error) {
            Toastify.error(error.response.data.message || `something went wrong`);

        } finally {
            setAttentenceLoading(false)
        }
    }

    const fetchLeave = async () => {
        setLeaveLoading(true)
        try {
            const { data, status } = await api.getEmployeeCumulativeLeave(id)

            // console.log(data,"leave......");

            if (status === 200) {
                setLeave(data?.data?.data)
            }

        } catch (error) {
            Toastify.error(error.response.data.message || `something went wrong`);

        } finally {
            setLeaveLoading(false)

        }
    }

    const calculateLPA = (annualSalary) => {
        if (!annualSalary || isNaN(annualSalary)) return '-';
        const lpa = annualSalary / 100000;
        return `${lpa.toFixed(2)} LPA`;
    };

    useEffect(() => {
        fetchEmployee()
        fetchAttendence()
        fetchLeave()

    }, [id])


    // console.log(employee,'mone Employeee aahda!!');

    console.log(leave,"lve"); 
    console.log(attentence,"attendence"); 


    // const documents = [
    //     { name: 'Appointment letter', size: '50 Kb',value :`${employee?.appointmentLetter[0] || ''}` },
    //     { name: 'Salary slip', size: '50 Kb',value :`${employee?.salarySlip || ''} ` },
    //     { name: 'Reliving letter', size: '50 Kb',value :`${employee?.relivingLetter || ''}` },
    //     { name: 'Experience letter', size: '50 Kb',value :`${employee?.experienceLetter[0] || ''}` },
    //     { name: 'Aadhar Card', size: '50 Kb',value :`${employee?.aadharCard[0] || ''}` },
    //     { name: 'Pan Card', size: '50 Kb',value :`${employee?.panCard[0] || ''}` },

    // ];
    const documents = [
        {
          name: 'Appointment letter',
          size: '50 Kb',
          value: Array.isArray(employee?.appointmentLetter) ? employee.appointmentLetter[0] : '',
        },
        {
          name: 'Salary slip',
          size: '50 Kb',
          value: Array.isArray(employee?.salarySlip) ?  employee?.salarySlip[0] : '',
        },
        {
          name: 'Reliving letter',
          size: '50 Kb',
          value: Array.isArray(employee?.relivingLetter) ? employee?.relivingLetter :'',
        },
        {
          name: 'Experience letter',
          size: '50 Kb',
          value: Array.isArray(employee?.experienceLetter) ? employee.experienceLetter[0] : '',
        },
        {
          name: 'Aadhar Card',
          size: '50 Kb',
          value: Array.isArray(employee?.aadharCard) ? employee.aadharCard[0] : '',
        },
        {
          name: 'Pan Card',
          size: '50 Kb',
          value: Array.isArray(employee?.panCard) ? employee.panCard[0] : '',
        },
      ];

       const downloadFile = async (imageUrl) => {
              
                  const fileName = imageUrl?.split('/')?.pop()?.split('?')[0];
                      
              try {
              
              const response = await api.downloadPhoto(imageUrl);
      
              
              if (response.data instanceof Blob) {
                  const fileUrl = window.URL.createObjectURL(response.data);
                  const link = document.createElement('a');
                  link.href = fileUrl;
                  
                  link.download = fileName;
                  link.click();
                  window.URL.revokeObjectURL(fileUrl);
              } else {
                  console.error("Error while generating Barcode");
              }
              } catch (error) {
              console.log('Download failed:', error);
              }
          };
        
      
          const isPdf = (url) => /\.pdf($|\?)/i.test(url);

    
    return (
        <MainLayout>
            <ProfileHeader
       name={`${employee?.firstName} ${employee?.lastName}`}
         breadcrumbs={["All Employees",`${employee?.firstName} ${employee?.lastName}`]}
            />
            <div className="container px-6 flex">
                {/* Profile Header */}
                <div className="w-68 bg-white border border-[#D9D9D9] rounded-[8px] mr-6 overflow-hidden p-6 text-sm font-medium text-gray-700">
                    {/* Profile Image & Info */}
                    <div className="flex flex-col items-center border-b border-[#D9D9D9] ">
                        <img
                            src={employee?.profileImg?.length > 0 ? employee?.profileImg[0] : "https://i.pravatar.cc/100?img=3"}   // Replace with actual image
                            alt="Profile"
                            className="w-20 h-20 rounded-full mb-3"
                        />
                        <h3 className="text-lg font-semibold text-gray-900"> {employee?.firstName} {employee?.lastName}</h3>
                        <p className="text-sm text-gray-500 mb-2">{employee?.designation?.designation}</p>
                        <div className="flex items-center text-green-500 text-sm font-medium mb-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span> Active
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 space-y-3  ">
                        <div className="flex justify-between ">
                            <span className="text-gray-400">Employee ID</span>
                            <span>{employee?.employeeId}</span>
                        </div>
                        <div className="flex justify-between  border-b border-[#D9D9D9] ">
                            <span className="text-gray-400 mb-2">User ID</span>
                            <span>{employee?.userName}</span>
                        </div>
                        {/* <div className="flex justify-between">
                            <span className="text-gray-400">Branch</span>
                            {employee?.branch?.map((branch, index) => (
                            <div key={index}>{branch.name}</div>
                          ))}
                        </div> */}
                        <div className="flex justify-between items-start">
                            <span className="text-gray-400">Branch</span>
                            <div className="flex flex-col items-end">
                                {employee?.branch?.map((branch, index) => (
                                    <div key={index} className="text-gray-600">
                                        {branch.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Destination</span>
                            <span>{employee?.designation?.designation}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Employment</span>
                            <span>{employee?.employeeType}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#D9D9D9]">
                            <span className="text-gray-400 mb-2">Salary</span>
                            <span>{calculateLPA(employee?.salary)}</span>
                        </div>
                    </div>

                    {/* Manager Info */}
                    <div className="mt-6">
                        <span className="text-gray-400 text-sm">Manager</span>
                        <div className="flex items-center mt-2">
                            <img
                                src="https://i.pravatar.cc/40?img=5"
                                alt="Manager"
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="text-gray-700 text-sm font-medium">Bogdan Krivenchenko</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center">
                            Actions
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>

                <div>
                    <div className="border border-[#D9D9D9] rounded-[8px]">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`py-4 px-2 mx-3 text-sm font-medium flex items-center whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    {tab.id}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'Personal Info' && (
                            <div className="space-y-4 ">
                                {/* Personal Information Section */}
                                <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                                <PersonIcon />
                                            </div>
                                            <h2 className="text-lg font-medium">Personal Information</h2>
                                        </div>
                                        <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-600">
                                        {personalinfo.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="font-normal text-gray-400">{item.label}</span>
                                                <span className="font-medium text-gray-800">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                                <LocationIcon />
                                            </div>
                                            <h2 className="text-lg font-medium">Address</h2>
                                        </div>
                                        <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-600 mb-4">
                                        <div className="flex justify-between ">
                                            <span className="font-normal text-gray-400">Primary Address</span>
                                            <span className="font-medium text-gray-800">{employee?.address}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16 text-sm text-gray-600">
                                        {address.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="font-normal text-gray-400">{item.label}</span>
                                                <span className="font-medium text-gray-800">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Profession Info' && (
                            <div>
                                <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                                <BriefcaseIcon />
                                            </div>
                                            <h2 className="text-lg font-medium">Profession Info</h2>
                                        </div>
                                        <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-600">
                                        {profinfo.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-gray-400">{item.label}</span>
                                                {/* <span className="font-medium text-gray-800">{item.value}</span> */}
                                                <span className="font-medium text-gray-800 whitespace-pre-line">{item.value}</span>

                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                                <BriefcaseIcon />
                                            </div>
                                            <h2 className="text-lg font-medium">Bank Information</h2>
                                        </div>
                                        <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-600">
                                        {bankinfo.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-gray-400">{item.label}</span>
                                                <span className="font-medium text-gray-800">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                                <BriefcaseIcon />
                                            </div>
                                            <h2 className="text-lg font-medium">Salary info</h2>
                                        </div>
                                        <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-600">
                                        {salaryinfo.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-gray-400">{item.label}</span>
                                                <span className="font-medium text-gray-800">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Documents' && (
                            <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center">
                                        <div className="bg-blue-600 text-white rounded-full p-1 mr-2">

                                            <DocumentIcon />
                                        </div>
                                        <h2 className="text-lg font-medium">Document</h2>
                                    </div>
                                    <button className="text-blue-600 bg-transparent text-sm px-3 py-1 rounded">
                                        Upload New
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* {documents.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-blue-50 p-4 rounded-xl "
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-white p-2 rounded-lg ">
                                                    <FileText className="text-blue-500 w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.size}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 text-gray-500">
                                                <button onClick={() => setOpen(true)}>
                                                    <Eye className="w-4 h-4 hover:text-blue-600" />
                                                </button>
                                                <DocumentModal
                                                    open={open}
                                                    handleClose={() => setOpen(false)}
                                                    documentName="Aadhar Card.pdf"
                                                    imageUrl="/assets/pan-card.png" // replace with actual image
                                                    imageUrl={doc.value} // replace with actual image
                                                />
                                                <button>
                                                    <Download className="w-4 h-4 hover:text-blue-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))} */}

{documents
  ?.filter((doc) => doc.value) // only include docs with non-empty value
  ?.map((doc, index) => (
    <div
      key={index}
      className="flex items-center justify-between bg-blue-50 p-4 rounded-xl "
    >
      <div className="flex items-center space-x-4">
        <div className="bg-white p-2 rounded-lg ">
          <FileText className="text-blue-500 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{doc?.name}</p>
          {/* <p className="text-xs text-gray-400">{doc.size}</p> */}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-gray-500">
        <button 
onClick={() => {
    setSelectedDoc(doc); // set document to preview
    setOpen(true);
  }}        >
          <Eye className="w-4 h-4 hover:text-blue-600" />
        </button>
      
<button
  onClick={() => {
    const sanitizedUrl = doc?.value?.trim().toLowerCase(); // remove extra spaces and ensure case

   

    if (sanitizedUrl.endsWith('.pdf')) {
      window.open(doc.value, '_blank'); // open pdf in new tab
    } else {
      downloadFile(sanitizedUrl); // download image
    }
  }}
>
  <Download className="w-4 h-4 hover:text-blue-600" />
</button>

      </div>
    </div>
))}

                                </div>
{selectedDoc && (
  <DocumentModal
    open={open}
    handleClose={() => {
      setOpen(false);
      setSelectedDoc(null);
    }}
    documentName={selectedDoc.name}
    imageUrl={selectedDoc.value}
  />
)}

                            </div>

                        )}

                        {activeTab === 'Branch  Access' && (
                            <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                            <LockIcon />
                                        </div>
                                        <h2 className="text-lg font-medium">Bank Information</h2>
                                    </div>
                                    <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Bank Name</p>
                                        <p className="font-medium">{employee?.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Account Name</p>
                                        <p className="font-medium">{employee?.accountName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Branch</p>
                                        <p className="font-medium">{employee?.bankBranchName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Account Number</p>
                                        <p className="font-medium">{employee?.accountNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">SWIFT/BIC</p>
                                        <p className="font-medium">{employee?.SWIFT}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">IBAN</p>
                                        <p className="font-medium">{employee?.IBAN}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">IFSC code</p>
                                        <p className="font-medium">{employee?.IFSC}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Payroll' && (
                            <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                            <CurrencyIcon />
                                        </div>
                                        <h2 className="text-lg font-medium">Salary Info</h2>
                                    </div>
                                    <button className="text-blue-600 text-sm cursor-pointer" onClick={()=>navigate(`/editEmployee/${id}`)}>Edit</button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Salary</p>
                                        <p className="font-medium">{employee?.salary}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Salary end date</p>
                                        <p className="font-medium">{formatDate(employee?.salaryEndDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Salary start date</p>
                                        <p className="font-medium">{formatDate(employee?.salaryStartDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Account/UPI address</p>
                                        <p className="font-medium">{employee?.accountNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Attendance location</p>
                                        <p className="font-medium">{employee?.attendenceLoacation}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* {activeTab === 'Attendance' && (
                            <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                        <ClockIcon />
                                    </div>
                                    <h2 className="text-lg font-medium">Attendance</h2>
                                </div>

                                <div className="overflow-x-auto mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {
                                            
                                            
                                            attentence?.map((record, index) => (
                                                <tr key={index}>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">{formatAttendence( record.createdAt)}</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-900">{record?.checkIn || '-'}</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-900">{record?.checkOut || '-'}</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-900">{record?.break || '-'}</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-900">{record?.workingHours || '-'}</td>
                                                    <td className="py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'ONTIME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {record?.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        )} */}
                        {activeTab === 'Attendance' && (
                            <div className="bg-white border border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                        <ClockIcon />
                                    </div>
                                    <h2 className="text-lg font-medium">Attendance</h2>
                                </div>

                                <div className="overflow-x-auto mt-4">
                                    {attentenceLoading ? (
                                        <div className="flex justify-center items-center text-gray-500">
                                            <CircularProgress />
                                        </div>) : attentence?.length === 0 ? (
                                            <div className="text-center py-10 text-gray-500">No attendance records found.</div>
                                        ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {attentence.map((record, index) => (
                                                    <tr key={index}>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatAttendence(record.createdAt)}
                                                        </td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-900">{ getISTTimeOnly (record?.checkIn) || '-'}</td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-900">{getISTTimeOnly(record?.checkOut )|| '-'}</td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-900">{record?.break || '-'}</td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-900">{record?.workingHours || '-'}</td>
                                                        <td className="py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'ONTIME'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {record?.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}


                        {/* {activeTab === 'Leaves' && (
                            <div className="bg-white  border  border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                        <CalendarIcon />
                                    </div>
                                    <h2 className="text-lg font-medium">Leaves</h2>
                                </div>

                                <div className="overflow-x-auto mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Manager</th>
                                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {
                                            // [
                                            //     { id: 1, from: 'July 01, 2023', duration: 'July 01 - July 05', days: '3 Days', manager: 'Mark Willows', status: 'Pending' },
                                            //     { id: 2, from: 'Apr 06, 2023', duration: 'Apr 06 - Apr 10', days: '4 Days', manager: 'Mark Willows', status: 'Approved' },
                                            //     { id: 3, from: 'Mar 12, 2023', duration: 'Mar 14 - Mar 16', days: '2 Days', manager: 'Mark Willows', status: 'Approved' },
                                            //     { id: 4, from: 'Feb 01, 2023', duration: 'Feb 22 - Feb 26', days: '5 Days', manager: 'Mark Willows', status: 'Approved' },
                                            //     { id: 5, from: 'Jan 01, 2023', duration: 'Jan 15 - Jan 19', days: '5 Days', manager: 'Mark Willows', status: 'Reject' }
                                            // ]
                                            
                                            leave
                                            .map((leave) => (
                                                <tr key={leave.id}>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">{ formatAttendence(leave?.startDate)}</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">{formatLeave(leave?.startDate,leave?.endDate)}</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">{leave?.duration} days</td>
                                                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">HR</td>
                                                    <td className="py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.leaveStatus === 'APPROVED' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                            {leave.leaveStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )} */}

                        {activeTab === 'Leaves' && (
                            <div className="bg-white border border-[#D9D9D9] rounded-[8px] p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-600 text-white rounded-full p-1 mr-2">
                                        <CalendarIcon />
                                    </div>
                                    <h2 className="text-lg font-medium">Leaves</h2>
                                </div>

                                <div className="overflow-x-auto mt-4">
                                    {leaveLoading ? (
                                        <div className="flex justify-center items-center text-gray-500">
                                            <CircularProgress />
                                        </div>
                                    ) : leave?.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">No leave records found.</div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Manager</th>
                                                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {leave.map((leave) => (
                                                    <tr key={leave.id}>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">{formatAttendence(leave?.startDate)}</td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">{formatLeave(leave?.startDate, leave?.endDate)}</td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">{leave?.duration} days</td>
                                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">HR</td>
                                                        <td className="py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.leaveStatus === 'APPROVED'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {leave.leaveStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div></div>
        </MainLayout>
    )
}

