{activeTab === 'documents' && (
    <div className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Appointment Letter */}
            <div className="border border-gray-200 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Upload Appointment Letter</div>
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-1">
                        Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                    </p>
                    <p className="text-xs text-center text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                    </p>
                </div>
            </div>

            {/* Salary Slip */}
            <div className="border border-gray-200 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Upload Salary Slip</div>
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-1">
                        Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                    </p>
                    <p className="text-xs text-center text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                    </p>
                </div>
            </div>

            {/* Relieving Letter */}
            <div className="border border-gray-200 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Upload Relieving Letter</div>
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-1">
                        Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                    </p>
                    <p className="text-xs text-center text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                    </p>
                </div>
            </div>

            {/* Experience Letter */}
            <div className="border border-gray-200 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Upload Experience Letter</div>
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-1">
                        Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                    </p>
                    <p className="text-xs text-center text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                    </p>
                </div>
            </div>

            {/* Aadhar Card */}
            <div className="border border-gray-200 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Upload Aadhar Card</div>
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-1">
                        Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                    </p>
                    <p className="text-xs text-center text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                    </p>
                </div>
            </div>

            {/* PAN Card */}
            <div className="border border-gray-200 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Upload PAN Card</div>
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm text-center text-gray-600 mb-1">
                        Drag & Drop or <span className="text-blue-500">choose file</span> to upload
                    </p>
                    <p className="text-xs text-center text-gray-400">
                        Supported formats: JPEG, PNG, PDF
                    </p>
                </div>
            </div>
        </div>

        <div className="flex justify-end mt-8 space-x-3">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                Cancel
            </button>
            <button className="px-4 py-2 bg-[#2563EB] text-white rounded hover:bg-blue-600">
                Next
            </button>
        </div>
    </div>
)}