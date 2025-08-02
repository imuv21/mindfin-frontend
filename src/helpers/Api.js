import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getToken = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        return token;
    } catch (error) {
        return null;
    }
};

class Api {
    constructor() {
        this.client = null;
        this.api_url = BASE_URL;
    }

    init = (type) => {

        let headers;
        headers = {
            Accept: "application/json",
        }
        if (type === "multipart/form-data") {
            headers = {
                ...headers,
                'Content-Type': 'multipart/form-data',
            };
        }

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: 31000,
            headers: headers,
        });
        this.client.interceptors.request.use(async (config) => {
            const token = await getToken();
            config.headers["Authorization"] = `Bearer ${token}`
            return config;
        }, (error) => {
            throw error;
        })
        return this.client;
    };
    

    // login
    generatePassword = (body) => {
        return this.init().post("/hr/generate-password", body)
    }
    verifyGeneratedPassword = (body) => {
        return this.init().post("/hr/verify-generate-password", body)
    }
    resentOtpGeneratePassword = (body) => {
        return this.init().post("/hr/resent-otp/generate-password", body)
    }
    resentOtpForgotPassword = (body) => {

        return this.init().post("/hr/resent-otp/forgot-password", body)
    }
    setNewPassword = (body) => {
        return this.init().post("/hr/reset-the-password", body)
    }
    forgotPassword = (body) => {
        return this.init().post("/hr/forgot-password", body)
    }
    verifyForgotPassword = (body) => {
        return this.init().post("/hr/verify-otp", body)
    }
    login = (body) => {
        return this.init().post("/hr/login", body)
    }
    branchLogin = (body) => {
        return this.init().post("/hr/branch-login", body)
    }
    WhoAmI = () => {
        return this.init().get("/hr/getUser")
    }


     sendInvitationLink = (body) => {
        return this.init().post("/hr/send-invite", body)
    }

    getOtp = (body) => {
        return this.init().post("/hr/get-otp", body)
    }

    verifyOtp = (body) => {
        return this.init().post("/hr/verify-otp", body)
    }

    setPassword = (body) => {
        return this.init().post("/hr/set-password", body);
    };

    addEmployee = (body) => {
        return this.init().post("/hr/add-employee", body)
    }


    //designation
    getDesignations = () => {
        return this.init().get("/super-admin/get-all-desigantions")
    }

    //branches
    getBranches = () => {
        return this.init().get("/super-admin/get-all-branch")
    }

    //employees
    getEmployees = (body) => {
        return this.init().get(`/hr/get-all-employees?${body}`)
    }
    editEmployee = (body) => {
        return this.init().put(`/hr/edit-employee/${body?._id}`, body)
    }
    deleteEmployee = (body) => {
        return this.init().put(`/hr/delete-employee/${body}`)
    }
    getAnEmployee = (body) => {
        return this.init().get(`/hr/get-details-employee/${body}`)
    }
    getEmployeeCumulativeAttendance = (body) => {
        return this.init().get(`/hr/get-cumulative-attendance/${body}`)
    }
    getEmployeeCumulativeLeave = (body) => {
        return this.init().get(`/hr/get-cumulative-leaves/${body}`)
    }
    getAllEmployees = () => {
        return this.init().get(`/hr/get-employeesForPayroll`)
    }


    //attendence
    getAttendence = (body) => {
        // console.log(body,"bodd");

        return this.init().get(`/hr/get-all-attendence?${body}`)
    }
    getMonthlyAttendence = (body) => {
        // console.log(body,"bodd");

        return this.init().get(`/hr/get-monthly-attendence?${body}`)
    }


    //designation & departments
    getAlldepartmentEmployees = (body) => {

        return this.init().get(`/hr/get-all-department?name=${body}`)
    }
    getSpecificDepartmentEmployees = (body) => {

        return this.init().get(`/hr/get-department-employees?${body}`)
    }


    //jobs
    addJob = (body) => {
        return this.init().post("/hr/create-job", body)
    }
    getJobs = (body) => {
        return this.init().get(`/hr/get-all-jobs?${body}`)
    }
    updatePublishStatus = (body) => {
        return this.init().put(`/hr/update-publish/${body}`)
    }
    updateJob = (body) => {
        console.log(body, "updatebody");

        return this.init().put(`/hr/update-job/${body._id}`, body)
    }
    getAJob = (body) => {
        return this.init().get(`/hr/get-job/${body}`)
    }
    getJobsForModal = (body) => {
        return this.init().get(`/hr/get-all-jobs-for-modal`)
    }



    //candidates
    getAllCandidates = (body) => {
        return this.init().get(`/hr/get-all-candidates?${body}`)
    }
    addCandidate = (body) => {
        return this.init().post(`/hr/create-candidates`, body)
    }
    getACandidate = (body) => {
        return this.init().get(`/hr/get-a-candidate/${body}`)
    }
    updateACandidate = (body) => {
        return this.init().put(`/hr/update-candidate/${body._id}`, body)
    }
    deleteACandidate = (body) => {
        return this.init().delete(`/hr/delete-candidate/${body}`)
    }

    //holidays
    addHoliday = (body) => {
        return this.init().post(`/hr/create-holiday`, body)
    }
    getAllHolidays = (body) => {
        return this.init().get(`/hr/get-all-holidays?${body}`)
    }
    getAHoliday = (body) => {
        return this.init().get(`/hr/get-a-holiday/${body}`)
    }
    updateAHoliday = (body) => {
        return this.init().put(`/hr/update-holiday/${body._id}`, body)
    }
    deleteAHoliday = (body) => {
        return this.init().delete(`/hr/delete-holiday/${body}`)
    }

    //leaves
    addLeave = (body) => {
        return this.init().post('/hr/create-leave', body)
    }
    getAllLeaves = (body) => {
        return this.init().get(`/hr/get-all-leaves?${body}`)
    }
    getALeave = (body) => {
        return this.init().get(`/hr/get-leave/${body}`)
    }
    updateLeave = (body) => {
        return this.init().put(`/hr/update-leave/${body._id}`, body)
    }
    deleteALeave = (body) => {
        return this.init().delete(`/hr/delete-leave/${body}`)
    }


    //pay-slip
    getEmployeeCounts = () => {
        return this.init().get(`/hr/get-employee-count`)
    }
    getAllBranchTaxes = () => {
        return this.init().get(`/super-admin/get-all-tax`)
    }
    addSalarySlip = (body) => {
        return this.init().post("/hr/create-pay-slip", body)
    }
    getAPaySlip = (body) => {
        return this.init().get(`/hr/get-payslip/${body}`)
    }
    getAllPaySlip = (body) => {
        return this.init().get(`/hr/get-all-pay-slip?${body}`)
    }
    updataAPaySlip = (body) => {
        return this.init().put(`/hr/update-payslip/${body._id}`, body)
    }
    deletePaySlip = (body) => {
        return this.init().delete(`/hr/delete-payslip/${body}`)
    }

    //pay-roll
    payRollCardData = () => {
        return this.init().get('/hr/get-salary-details')
    }
    addPayRoll = (body) => {
        return this.init().post("/hr/create-pay-roll", body)
    }
    getAPayRoll = (body) => {
        return this.init().get(`/hr/get-payroll/${body}`)
    }
    getAllPayRoll = (body) => {
        return this.init().get(`/hr/get-all-pay-roll?${body}`)
    }
    updateAPayRoll = (body) => {
        return this.init().put(`/hr/update-payroll/${body._id}`, body)
    }
    deleteAPayRoll = (body) => {
        return this.init().delete(`/hr/delete-payroll/${body}`)
    }



    //settings
    changeProPic = (body) => {
        return this.init().put(`/hr/change-image/${body._id}`, body)
    }


    //dashboard
    getbranchDatas = () => {
        return this.init().get(`/hr/get-branch-data`)
    }
    getWeeklyAttendanceGraph = () => {
        return this.init().get(`/hr/get-weekly-atendence`)
    }
    getCustomDateDetails = (body) => {
        return this.init().get(`/hr/custom-dates${body}`)
    }
    dashboardAttendence = (body) => {
        return this.init().get(`/hr/todays-attendence`)
    }



    // Data - entry
    addLead = (body) => {
        return this.init().post(`/tele-caller/add-leads`, body)
    }
    getAllLeads = (body) => {
        return this.init().get(`/tele-caller/get-all-leads?${body}`)
    }
    getALead = (body) => {
        return this.init().get(`/tele-caller/get-a-lead/${body}`)
    }
    updateALead = (body) => {
        return this.init().put(`/tele-caller/update-a-lead/${body._id}`, body)
    }
    deleteALead = (body) => {
        return this.init().delete(`/tele-caller/delete-a-lead/${body}`)
    }
    exportLead = (body) => {
        return this.init().get(`/tele-caller/export-lead?${body}`)
    }


    //upload-photo
    fileUpload = (data, config) => {
        return this.init('multipart/form-data').post("/hr/uploadFile", data)
    }
    downloadPhoto = (data) => {
        return this.init().get(`/hr/download-file?url=${data}`, { responseType: "blob" })
    }
};

const api = new Api();
export default api;
