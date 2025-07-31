
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import ProfileHeader from "../layout/ProfileHeader";
import { Pagination } from "@mui/material";
import api from "../../helpers/Api";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees, setFilterValues, setRefresh } from "../../redux/employeeSlice";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import Toastify from "../../helpers/Toastify";

export default function AllEmployee() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { filterOptions, isRefresh, isLoading, userData } = useSelector(
    (state) => state.employee
  );

  const [designations, setDesignations] = useState(null);
  const [name, setName] = useState("");
  const [itemsPerPage] = useState(10);
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("");
  const [item,setItem] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [deleteLoading,setDeleteLoading] = useState(false)

 

  const fetchDesignations = async () => {
    const { data, status } = await api.getDesignations();

    if (status === 200) {
      setDesignations(data?.data);
    }
  };

  const handleSearch = (e) => {
    setName(e.target.value);
    dispatch(setFilterValues({ name: e.target.value, page: 1 }));
  };

  const handleDesignationChange = (e) => {
    console.log(e.target.value, "dessi");

    setDesignation(e.target.value);
    dispatch(setFilterValues({ designation: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    dispatch(setFilterValues({ status: e.target.value, page: 1 }));
  };

  const handlePageChange = (event, page) => {
    console.log("page", page);
    dispatch(setFilterValues({ page }));
  };

  const calculateShowingRange = () => {
    const start = (userData?.currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(
      userData?.currentPage * itemsPerPage,
      userData?.totalEmployees
    );
    return { start, end };
  };


  const handleDeleteClick = (id) => {
    setEmployeeId(id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteSubmit = async () => {
    setDeleteLoading(true)
    try {
      const {data,status} = await api.deleteEmployee(employeeId)

      if(status === 200){
        dispatch(setRefresh())
        Toastify.success("Employee Deleted successfully")
        setModalOpen(false);
        
      }
      
    } catch (error) {
        Toastify.error(error.response.data.message || `something went wrong`);
      
    }
    finally{
      setDeleteLoading(false)
    }
    // handleDelete(employeeId);
  };

  const { start, end } = calculateShowingRange();

  useEffect(() => {
    fetchDesignations();
  }, []);

  useEffect(() => {
    dispatch(getEmployees(filterOptions));
  }, [filterOptions, dispatch, isRefresh]);

  console.log(userData, "employeeData");

  return (
    <MainLayout>
      <ProfileHeader 
      name="All Employees"
      breadcrumbs={["All Employee Information"]}
      />
      <div className="container mx-auto p-4">
        <div className="flex flex-col border border-[#D9D9D9] rounded-[8px] p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                  placeholder="Search employee"
                  value={name}
                  onChange={(e) => handleSearch(e)}
                />
              </div>
              <div className="flex space-x-2">
                <select
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={designation}
                  onChange={handleDesignationChange}
                >
                  <option value="">All Departments</option>
                  {/* {designations &&
                    designations.map((designation, index) => (
                      <option key={index} value={designation._id}>
                        {designation.designation}
                      </option>
                    ))} */}
                     {designations &&
                  designations
                    .filter((d) => d.designation !== "SUPERADMIN")
                    .map((designation, index) => (
                      <option key={index} value={designation._id}>
                        {designation.designation}
                      </option>
                    ))}
                </select>

                <select
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="">All Status</option>
                  <option value="PERMENENT">Permanent</option>
                  <option value="TEMPORARARY">Temporary</option>
                  <option value="INTERN">Intern</option>
                  <option value="NOTICEPERIOD">Notice Period</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center text-white bg-[#2563EB] rounded-lg px-4 py-2 text-sm font-medium"
              onClick={()=>navigate("/newEmployee")}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              New Employee
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : userData && userData.employees && userData.employees.length === 0 ? (
            <div className="flex justify-center items-center text-gray-500 w-100% h-100">
              No Data Found
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Employee Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Employee ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Branch
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Designation
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData?.employees?.map((employee, index) => (
                      <tr key={index}>
                        <td className="py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              {employee?.profileImg?.[0] ? (
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={employee.profileImg[0]}
                                  alt={employee.firstName}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold"
                                style={{
                                  display: employee?.profileImg?.[0]
                                    ? "none"
                                    : "flex",
                                }}
                              >
                                {employee?.firstName?.[0]?.toUpperCase() || "U"}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {`${employee?.firstName} ${employee?.lastName}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee?.branch?.map((branch, index) => (
                            <div key={index}>{branch.name}</div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee?.designation?.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee?.employeeType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-[4px] bg-[#7152F31A] text-blue-600">
                            {employee?.employeeType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=>navigate(`/viewEmployee/${employee._id}`)}>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              ></path>
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={()=>navigate(`/editEmployee/${employee._id}`)} >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              ></path>
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 cursor-pointer"   onClick={() => handleDeleteClick(employee._id)}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <DeleteModal
        isOpen={isModalOpen}
        close={handleModalClose}
        handleSubmit={handleDeleteSubmit}
        heading="Confirm Deletion"
        description="Are you sure you want to delete this employee?"
        loading={deleteLoading}
      />
              </div>

              {userData?.employees?.length > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {start}-{end} out of {userData?.totalEmployees} results
                  </div>
                  <Pagination
                    count={userData?.totalPages}
                    page={filterOptions?.page}
                    onChange={handlePageChange}
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={0}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        margin: "0 4px",
                        border: "1px solid #E0E2E7",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontFamily: `'Public Sans', sans-serif`,
                      },
                      "& .Mui-selected": {
                        color: "#fff",
                        backgroundColor: "#1D83F8 !important",
                      },
                      "& .MuiPaginationItem-root:hover": {
                        color: "#fff",
                        backgroundColor: "#1D83F8",
                      },
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}