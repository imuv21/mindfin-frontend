
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
};

export const handleApiError = (error, rejectWithValue) => {
    if (error.response?.data) {
        return rejectWithValue({
            message: error.response.data.message || 'Request failed'
        });
    }
    return rejectWithValue({ message: "Something went wrong" });
};

export const statusDisplay = {
    "PENDING": "Pending",
    "INPROGRESS": "In Process",
    "CLOSED": "Closed",
    "DROPPED": "Dropped"
};

export const statusColors = {
    "PENDING": "status-pending",
    "INPROGRESS": "status-process",
    "CLOSED": "status-closed",
    "DROPPED": "status-dropped"
};