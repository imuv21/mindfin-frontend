
import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import MainLayout from "./../../components/layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchLeadById,
    clearSelectedLead,
    updateCreditManagerLead,
} from "../../redux/creditSlice";
import { formatDate } from "./../../helpers/conversion";
import Toastify from "./../../helpers/Toastify";
import api from "../../helpers/Api";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// ✅ Validation schema
const validationSchema = Yup.object({
    leadName: Yup.string().required("Full name is required"),
    phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    alternativePhone: Yup.string()
        .matches(/^\d{10}$/, "Alternate number must be 10 digits")
        .required("Alternate number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    location: Yup.string().required("Location is required"),
    loanType: Yup.string().required("Loan type is required"),
    loanAmount: Yup.number()
        .typeError("Loan amount must be a number")
        .required("Loan amount is required"),
    LeadCreatedDate: Yup.date().required("Date is required"),
});

const CibilLeadsEdit = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedLead, loadingLead, error } = useSelector(
        (state) => state.creditManager
    );

    // Loan Types
    const [loanTypes, setLoanTypes] = useState([]);
    const [loadingLoanTypes, setLoadingLoanTypes] = useState(false);

    // Load all loan types
    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                setLoadingLoanTypes(true);
                const res = await api.getAllLoanTypes();
                setLoanTypes(res.data?.data?.data || []);
            } catch (err) {
                Toastify.error("Failed to load loan types");
            } finally {
                setLoadingLoanTypes(false);
            }
        };
        fetchLoanTypes();
    }, []);

    // Load lead
    useEffect(() => {
        if (id) {
            dispatch(fetchLeadById(id));
        }
        return () => dispatch(clearSelectedLead());
    }, [dispatch, id]);

    // Error handling
    useEffect(() => {
        if (error) Toastify.error(error);
    }, [error]);

    const handleSave = async (values) => {
        try {
            await dispatch(updateCreditManagerLead({ id, updateData: values })).unwrap();
            Toastify.success("Lead updated successfully!");
            navigate("/cibil-credit-score");
        } catch (err) {
            const errorMsg =
                typeof err === "string"
                    ? err
                    : err?.message || "Failed to update lead";
            Toastify.error(errorMsg);
        }
    };

    return (
        <MainLayout>
            <Box className="p-4 sm:p-6">
                {/* Header */}
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-blue-600 mb-1">
                            Edit Lead
                        </h1>
                        <div className="flex flex-wrap items-center text-sm text-gray-500">
                            <span className="text-sm font-medium text-[#667085]">
                                CIBIL / CREDIT SCORE
                            </span>
                            <span className="mx-2">→</span>
                            <span className="text-sm font-medium text-black">
                                Edit Lead details
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            className="px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => navigate("/cibil-credit-score")}
                        >
                            Back
                        </button>
                    </div>
                </Box>

                {loadingLead ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", width: "100%" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: "#fff", width: "100%", maxWidth: 740 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ fontSize: "14px", color: "#0F172A" }}>
                            Personal Information
                        </Typography>

                        <Formik
                            initialValues={{
                                leadName: selectedLead?.leadName || "",
                                email: selectedLead?.email || "",
                                phone: selectedLead?.phone || "",
                                alternativePhone: selectedLead?.alternativePhone || "",
                                location: selectedLead?.location || "",
                                loanAmount: selectedLead?.loanAmount || "",
                                loanType: selectedLead?.loanType?._id || selectedLead?.loanType || "",
                                LeadCreatedDate: selectedLead?.LeadCreatedDate || "",
                            }}
                            enableReinitialize
                            validationSchema={validationSchema}
                            onSubmit={handleSave}
                        >
                            {({ values, handleChange, errors, touched }) => (
                                <Form>
                                    <Grid container spacing={2}>
                                        {/* Left column */}
                                        <Box sx={{ display: "flex", flexDirection: "column", width: "48%" }}>
                                            <TextField
                                                label="Lead Name"
                                                name="leadName"
                                                value={values.leadName}
                                                onChange={handleChange}
                                                error={touched.leadName && Boolean(errors.leadName)}
                                                helperText={touched.leadName && errors.leadName}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <TextField
                                                label="Email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <TextField
                                                label="Phone"
                                                name="phone"
                                                value={values.phone}
                                                onChange={handleChange}
                                                error={touched.phone && Boolean(errors.phone)}
                                                helperText={touched.phone && errors.phone}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <TextField
                                                label="Alternate Phone"
                                                name="alternativePhone"
                                                value={values.alternativePhone}
                                                onChange={handleChange}
                                                error={touched.alternativePhone && Boolean(errors.alternativePhone)}
                                                helperText={touched.alternativePhone && errors.alternativePhone}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Box>

                                        {/* Right column */}
                                        <Box sx={{ display: "flex", flexDirection: "column", width: "48%" }}>
                                            <TextField
                                                label="Location"
                                                name="location"
                                                value={values.location}
                                                onChange={handleChange}
                                                error={touched.location && Boolean(errors.location)}
                                                helperText={touched.location && errors.location}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <TextField
                                                label="Loan Amount"
                                                name="loanAmount"
                                                value={values.loanAmount}
                                                onChange={handleChange}
                                                error={touched.loanAmount && Boolean(errors.loanAmount)}
                                                helperText={touched.loanAmount && errors.loanAmount}
                                                fullWidth
                                                margin="normal"
                                            />

                                            {/* Loan Type Dropdown */}
                                            <FormControl fullWidth margin="normal" error={touched.loanType && Boolean(errors.loanType)}>
                                                <InputLabel id="loanType-label">Loan Type</InputLabel>
                                                <Select
                                                    labelId="loanType-label"
                                                    name="loanType"
                                                    value={values.loanType}
                                                    onChange={handleChange}
                                                    disabled={loadingLoanTypes}
                                                >
                                                    {loanTypes.map((loan) => (
                                                        <MenuItem key={loan._id} value={loan._id}>
                                                            {loan.loanName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {touched.loanType && errors.loanType && (
                                                    <Typography variant="caption" color="error">{errors.loanType}</Typography>
                                                )}
                                            </FormControl>

                                            <TextField
                                                label="Lead Created Date"
                                                name="LeadCreatedDate"
                                                type="date"
                                                value={values.LeadCreatedDate ? values.LeadCreatedDate.split("T")[0] : ""}
                                                onChange={handleChange}
                                                error={touched.LeadCreatedDate && Boolean(errors.LeadCreatedDate)}
                                                helperText={touched.LeadCreatedDate && errors.LeadCreatedDate}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Box>
                                    </Grid>

                                    {/* Save button */}
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loadingLead}
                                            sx={{
                                                backgroundColor: "#2664EB",
                                                textTransform: "none",
                                                "&:hover": { backgroundColor: "#1f54c7" },
                                            }}
                                        >
                                            {loadingLead ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                )}
            </Box>
        </MainLayout>
    );
};

export default CibilLeadsEdit;


