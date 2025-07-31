import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../../helpers/Api";
import Toastify from "../../helpers/Toastify";
import { setPayrollRefresh } from "../../redux/payrollSlice";



const EditPayRollPopup = ({ open, handleClose,id }) => {
  const dispatch = useDispatch();
  const { designations } = useSelector((state) => state.employee);

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchloading,setFetchLoading] = useState(false)
  

  const schema = yup.object().shape({
    paymentName: yup.string().required("Payment name is required"),
    designation: yup.string().required("Designation is required"),
    generatedDate: yup.date().required("Generated date is required"),
    paymentYear: yup.string().required("Payment year is required"),
    paymentMonth: yup.string().required("Payment month is required"),
    status: yup.string().required("Payment Status is required"),
  });

  const {
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    touched,
    setValues,
    resetForm
  } = useFormik({
    initialValues: {
      paymentName: "",
      designation: "",
      generatedDate: null,
      paymentYear: "",
      paymentMonth: "",
      status: "",
      _id:''
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { data, status } = await api.updateAPayRoll(values);
        if (status === 200) {
        //   dispatch(setRefresh());
          Toastify.success("Payroll Updated successfully");
          dispatch(setPayrollRefresh())
          resetForm()
          setSelectedDate(null)
          handleClose();
        }
      } catch (error) {
        Toastify.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  console.log(values,"balue");
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear().toString();

    setFieldValue("paymentMonth", month);
    setFieldValue("paymentYear", year);
  };

  const handleCancel = ()=>{
    resetForm()
    setSelectedDate(null)
    handleClose()
  }

  const fetchData = async()=>{
    try {
        setFetchLoading(true)
        const {data,status} = await api.getAPayRoll(id)

        if(status === 200){
            setValues({
                paymentName:data?.data?.paymentName || '',
                designation:data?.data?.designation || '',
                generatedDate:data?.data?.generatedDate || null,
                paymentYear:data?.data?.paymentYear || '',
                paymentMonth:data?.data?.paymentMonth || '',
                status:data?.data?.status || '',
                _id:data?.data?._id || '',


            })
        }

    } catch (error) {
        //  Toastify.error(error.response.data.message || `something went wrong`);
                  handleClose()
        
    }finally{
        setFetchLoading(false)

    }
  }

  useEffect(()=>{
          fetchData()
      },[id])

      const getDateFromMonthYear = (monthName, year) => {
        if (!monthName || !year) return null;
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); // "March 1, 2025" -> 2
        return new Date(year, monthIndex); // e.g., new Date(2025, 2)
      };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          borderBottom: "1px solid #A2A1A81A",
          fontSize: "20px",
          color: "#16151C",
          fontWeight: "600",
        }}
      >
        Edit Payroll
      </DialogTitle>

      <DialogContent>

        {
            fetchloading?
            <CircularProgress/> :
            <Box pt={3}>
            {/* Payment Name & Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="w-full">
                <label className="block text-sm text-gray-700 mb-1">Payment Name</label>
                <input
                  type="text"
                  name="paymentName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.paymentName}
                  className={`w-full p-2 pl-4 text-[16px] border ${
                    errors.paymentName && touched.paymentName
                      ? "border-red-500"
                      : "border-[#A2A1A833]"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter payment name"
                />
                {errors.paymentName && touched.paymentName && (
                  <FormHelperText error>{errors.paymentName}</FormHelperText>
                )}
              </div>
  
              <div className="relative w-full">
                <label className="block text-sm text-gray-700 mb-1">Designation</label>
                <select
                  name="designation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.designation}
                  className={`w-full p-2 pl-4 pr-8 text-[16px] border ${
                    errors.designation && touched.designation
                      ? "border-red-500"
                      : "border-[#A2A1A833]"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-700`}
                >
                  <option value="" disabled>
                    Select Designation
                  </option>
                  {designations &&
                    designations
                      .filter((d) => d.designation !== "SUPERADMIN")
                      .map((designation, index) => (
                        <option key={index} value={designation._id}>
                          {designation.designation}
                        </option>
                      ))}
                </select>
                <ChevronDown className="absolute right-2 top-[44px] -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                {errors.designation && touched.designation && (
                  <FormHelperText error>{errors.designation}</FormHelperText>
                )}
              </div>
            </div>
  
            {/* Payment Month & Date Generated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="relative w-full">
                <label className="block text-sm text-gray-700 mb-1">
                  Payment Month & Year
                </label>
                <DatePicker
                  selected={getDateFromMonthYear(values.paymentMonth, values.paymentYear)}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="w-full p-2 pl-4 border border-gray-200 rounded-md focus:outline-none bg-white"
                  placeholderText="Select Month & Year"
                />
                <ChevronDown className="absolute right-2 top-[44px] -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                {(errors.paymentMonth && errors.paymentYear) && (
                  <FormHelperText error>
                    {errors.paymentMonth || errors.paymentYear}
                  </FormHelperText>
                )}
              </div>
  
              <div className="relative w-full">
                <label className="block text-sm text-gray-700 mb-1">Date Generated</label>
                <DatePicker
                  id="generatedDate"
                  name="generatedDate"
                  selected={values.generatedDate}
                  onChange={(date) => setFieldValue("generatedDate", date || null)}
                  onBlur={handleBlur}
                  placeholderText="Generated date"
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                   popperPlacement="bottom-start"
                   portalId="root-portal"
                  className={`w-full p-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                    errors.generatedDate && touched.generatedDate
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-md`}
                />
                <CalendarDays className="absolute right-3 top-9 text-[#A3A3A3] pointer-events-none" size={18} />
                {errors.generatedDate && touched.generatedDate && (
                  <FormHelperText error>{errors.generatedDate}</FormHelperText>
                )}
              </div>
            </div>
  
            {/* Payment Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">Payment Status</label>
                <select
                  name="status"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.status}
                  className={`w-full p-2 pl-4 pr-8 text-[16px] border ${
                    errors.status && touched.status
                      ? "border-red-500"
                      : "border-[#A2A1A833]"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-gray-700`}
                >
                  <option value="" disabled>
                    Select Payment Status
                  </option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>
                <ChevronDown className="absolute right-2 top-[44px] -translate-y-1/2 h-4 w-4 text-[#16151C] pointer-events-none" />
                {errors.status && touched.status && (
                  <FormHelperText error>{errors.status}</FormHelperText>
                )}
              </div>
            </div>
          </Box>
        }
       
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{ px: 4, py: 1.5, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#2563EB",
            px: 4,
            py: 1.5,
            textTransform: "none",
            ml: 2,
          }}
        >
          {loading ? <CircularProgress color="white" size={28}/> : "Edit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPayRollPopup;

