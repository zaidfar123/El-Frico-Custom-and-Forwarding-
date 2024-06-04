import axiosInstance from "axiosIntance";
import axios from "axios";
import {BaseUrl} from "config";

const AxiosServices = {

    //OCR Documents
    getAxiosInstanceForFiles : () =>{
        const newAxiosInstance = axios.create({
            baseURL: BaseUrl, // Your base URL
            responseType : "blob"
          });
          
        return newAxiosInstance;
    },
    getOCR_FileList : async (model) => {
        return await axiosInstance.post("/api/General/GetOCR_FileList",model);
    },
    getCustomerOCRFileNoDropdown : async (model) => {
        let response = await axiosInstance.post("/api/Customer/GetCustomerOCRFileNoDropdown",model);
        return response?.data?.data || [];
    },
    getCustomerAllFileNoDropdown : async (model) => {
        let response = await axiosInstance.post("/api/Customer/GetCustomerAllFileNoDropdown",model);
        return response?.data?.data || [];
    },
    getTransportFileNoDropdown : async (model) => {
        let response = await axiosInstance.post("/api/Customer/GetFileNoFroTransportDropdown",model);
        return response?.data?.data || [];
    },
    convertURLtoImage : async (url) => {
        return await axiosInstance.post(`/api/General/ImageConverttoBase64?URL=${url}`);
    },
    getAgencyList : async () => {
        return await axiosInstance.get(`/api/General/GetAgencyList`);
    },
    SetupgetAgencyList : async () => {
        return await axiosInstance.get(`/api/General/SetupGetAgencyList`);
    },
    getPaymentPurposeDropdown : async () => {
        return await axiosInstance.get(`/api/General/PaymentPurposeDropdown`);
    },
    insertClearingDetail : async (model) => {
        return await axiosInstance.post(`/api/General/InsertClearance`,model);
    },
    getClearingList : async (model) => {
        return await axiosInstance.post(`/api/General/GetClearanceList`,model);
    },
    getGDList : async (model) => {
        return await axiosInstance.post(`/api/General/GetClearingListForGD`,model);
    },
    downloadDocument : async (model) => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return await newAxiosInstance.post(`/api/General/ExcelClearingByID`,model);
    },
    downloadAllDocument : async () => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return await newAxiosInstance.post(`/api/General/ExcelClearingAllRecord`);
    },
    downloadClearingPDF : async (Id) => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return await newAxiosInstance.get(`/api/General/GenerateCLearingPDF?ClearingID=`+Id);
    },
    downloadAllClearingPDF : async (Id) => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return await newAxiosInstance.get(`/api/General/GenerateCLearingSummaryPDF`);
    },
    downloadGDPDF : async (Id) => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return await newAxiosInstance.get(`/api/General/GenerateCLearingGDPDF?ClearingID=`+Id);
    },
    insertOCR_File : async (model) => {
        return await axios({
            url: `${BaseUrl}/api/General/InsertOCR_File`,
            method: 'POST',
            data: model,
            headers: {
              'Content-Type': "multipart/form-data"
            }
        });
    },
    insertOther_File : async (model) => {
        return await axios({
            url: `${BaseUrl}/api/FieldManagement/InsertOthersDoc`,
            method: 'POST',
            data: model,
            headers: {
              'Content-Type': "multipart/form-data"
            }
        });
    },
    insertAdvancePayorder : async (model) => {
        return await axios({
            url: `${BaseUrl}/api/Customer/InsertAdvancePayorder`,
            method: 'POST',
            data: model,
            headers: {
              'Content-Type': "multipart/form-data"
            }
        });
    },
    getfileDetailforClearing : async (model) => {
        return await axiosInstance.post(`/api/Customer/GetfileDetailforClearing`,model);
    },
    getWharfList : async () => {
        return await axiosInstance.get(`/api/General/WharfDropDown`);
    },
    getShedList : async () => {
        return await axiosInstance.get(`/api/General/ShedDropDown`);
    },
    getConversionList : async (model) => {
        return await axiosInstance.post(`/api/Configuration/GetConversionRateList`,model);
    },
    getTextFromBase64Image : async (model) => {
        return await axiosInstance.post(`/api/Customer/GetTextFromBase64Image`,model);
    },
    insertClearingAgencyAmount : async (model) => {
        return await axiosInstance.post(`/api/Configuration/InsertClearingAgencyAmount`,model);
    },
    getCustomDuty : async (model) => {
        return await axiosInstance.post(`/api/Configuration/GetCustomDuty`,model);
    },
    updateCustomDuty : async (model) => {
        return await axiosInstance.put(`/api/Configuration/UpdateCustomDuty`,model);
    },
    getConversionRateList : async (model) => {
        return await axiosInstance.post(`/api/Configuration/GetConversionRateList`,model);
    },
    insertConversionRate : async (model) => {
        return await axiosInstance.post(`/api/Configuration/InsertConversionRate`,model);
    },
    getClearingAgency : async (model) => {
        return await axiosInstance.post(`/api/Configuration/GetClearingAgencyList`,model);
    },
    approveClearing : async (model) => {
        return await axiosInstance.put(`/api/General/ApprovedRejectClearingRFP`,model);
    },

    //Authentication

    loginUser : async (model) => {
        return await axiosInstance.post(`/api/User/UserLogin`,model);
    },
    resendOTP : async (model) => {
        return await axiosInstance.post(`/api/User/ResendOTP`,model);
    },
    verifyOTPLogin : async (model) => {
        return await axiosInstance.post(`/api/User/VerifyOTPForLogin`,model);
    },
    getUserScreen : async (model) => {
        return await axiosInstance.post(`/api/User/RoleAccessScreen`,model);
    },

    //User

    getAllUserList : async (model) => {
        return await axiosInstance.post(`/api/User/GetUserList`,model);
    },
    insertUser : async (model) => {
        return await axiosInstance.post(`/api/User/InsertUser`,model);
    },
    updateUser : async (model) => {
        return await axiosInstance.put(`/api/User/UpdateUser`,model);
    },
    deactivateUser : async (model) => {
        return await axiosInstance.post(`/api/User/DeActivatedUser`,model);
    },
    changePassword : async (model) => {
        return await axiosInstance.post(`/api/User/ChangePassword`,model);
    },
    getRoles : async () => {
        return await axiosInstance.get(`/api/General/RoleDropDown`);
    },

    //Customer

    getCustomerList : async (model) => {
        return await axiosInstance.post(`/api/Customer/GetCustomerList`,model);
    },
    insertCustomer : async (model) => {
        return await axiosInstance.post(`/api/Customer/InsertCustomer`,model);
    },
    updateCustomer : async (model) => {
        return await axiosInstance.put(`/api/Customer/UpdateCustomer`,model);
    },

    //Expense
    searchCustomer : async (model) => {
        let response = await axiosInstance.post(`/api/Customer/GetCustomerDropdown`,model);
        return response?.data?.data || [];
    },
    searchExpense : async (model) => {
        let response = await axiosInstance.post(`/api/ExpenseManagement/GetExpenseCategoryDropdown`,model);
        return response?.data?.data || [];
    },
    getCustomType : async () => {
        return await axiosInstance.get(`/api/General/GetCustomTypeList`);
    },
    getShipmentTypeDetail : async (model) => {
        return await axiosInstance.post(`/api/General/GetShipmentTypeDetail`,model);
    },
    getCargoTypeDetail : async (model) => {
        return await axiosInstance.post(`/api/General/GetCargoTypeDetail`,model);
    },
    getshipmentDetailList: async (model) => {
        model.customTypeID = 0
        return await axiosInstance.post(`/api/General/ShipmentDetailList`,model);
    },
    getCollectorateList: async (model) => {
        model.customTypeID = 0
        return await axiosInstance.post(`/api/General/CollectorateList`,model);
    },
    getCargoTypeList: async (model) => {
        model.cargoTypeID = 0
        return await axiosInstance.post(`/api/General/CargoTypeDetailList`,model);
    },
    getCargoType : async () => {
        return await axiosInstance.get(`/api/General/GetCargoType`);
    },
    getItemCategory : async () => {
        return await axiosInstance.get(`/api/General/GetItemCategory`);
    },
    getTerminal : async () => {
        return await axiosInstance.get(`/api/General/GetTerminal`);
    },
    getBankList : async () => {
        return await axiosInstance.get(`/api/General/BankDropDown`);
    },
    getBankSetupList : async (model) => {
        return await axiosInstance.post(`/api/General/BankList`,model);
    },
    getTerminalList : async (model) => {
        return await axiosInstance.post(`/api/General/TerminalList`,model);
    },
    getAgencySetupList : async (model) => {
        return await axiosInstance.post(`/api/General/AgenciesList`,model);
    },
    getItemCategoryList : async (model) => {
        return await axiosInstance.post(`/api/General/ItemCategoryList`,model);
    },
    getCargoList : async (model) => {
        return await axiosInstance.post(`/api/General/CargoTypeList`,model);
    },
    insertBank : async (model) => {
        return await axiosInstance.post(`/api/General/InsertBank`,model);
    },
    deleteBank : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedBank`,model);
    },
    deleteCollectorate : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedCollectorate`,model);
    },
    deleteTerminal : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedTerminal`,model);
    },
    deleteItemCategory : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedItemCategory`,model);
    },
    deleteCargoType : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedCargoTypeDetail`,model);
    },
    deleteCargo : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedCargoType`,model);
    },
    deleteShipmentDetails : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedShipmentDetail`,model);
    },
    deleteAgency : async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedAgency`,model);
    },
    updateTerminal : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateTerminal`,model);
    },
    updateAgency : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateAgency`,model);
    },
    updateShipmentDetails : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateShipmentDetail`,model);
    },
    updateCargo : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateCargo`,model);
    },
    updateCargoType : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateCargoDetail`,model);
    },
    updateCollectorate : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateCollectorate`,model);
    },
    updateBank : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateBank`,model);
    },
    updateItemCategory : async (model) => {
        return await axiosInstance.put(`/api/General/UpdateItemCategory`,model);
    },
    insertAgency : async (model) => {
        return await axiosInstance.post(`/api/General/InsertAgency`,model);
    },
    insertTerminal : async (model) => {
        return await axiosInstance.post(`/api/General/InsertTerminal`,model);
    },
    insertItemCategory : async (model) => {
        return await axiosInstance.post(`/api/General/InsertItemCategory`,model);
    },
    insertCargo : async (model) => {
        return await axiosInstance.post(`/api/General/InsertCargo`,model);
    },
    insertShipmentDetail : async (model) => {
        return await axiosInstance.post(`/api/General/InsertShipmentDetail`,model);
    },
    insertCollectorate : async (model) => {
        return await axiosInstance.post(`/api/General/InsertCollectorate`,model);
    },
    insertCargoType : async (model) => {
        return await axiosInstance.post(`/api/General/InsertCargoDetail`,model);
    },
    getRFPstatus : async () => {
        return await axiosInstance.get(`/api/General/RFPStatusDropDown`);
    },
    getConsigneestatus : async () => {
        return await axiosInstance.get(`/api/General/ConsigneeStatusDropDown`);
    },
    getCollectorate : async (model) => {
        return await axiosInstance.post(`/api/General/GetCollectorate`,model);
    },
    getCustomerFileNo : async (model) => {
        let response = await axiosInstance.post(`/api/Customer/GetCustomerFileNo`,model);
        return response?.data?.data || [];
    },
    getCustomerDetailForExpense : async (model) => {
        return await axiosInstance.post(`/api/Customer/GetCustomerDetailForExpense`,model);
    },
    insertDailyExpense : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/InsertDailyExpense`,model);
    },
    getDailyExpenseList : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/GetDailyExpenseList`,model);
    },
    getUserList : async () => {
        return await axiosInstance.get(`/api/User/UserDropDown`);
    },
    assignedExpenseAmount : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/AssignedExpenseAmount`,model);
    },
    approvedRejectExpense : async (model) => {
        return await axiosInstance.put(`/api/ExpenseManagement/ApprovedRejectExpenseCategory`,model);
    },
    getAssignedAmountExpenseList : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/GetAssignedAmountExpenseList`,model);
    },
    geDailyExpenseEmpList : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/GetDailyExpenseEmpList`,model);
    },
    getDailyExpenseFileList : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/GetDailyExpenseFileList`,model);
    },
    getDailyExpenseEmpList : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/GetDailyExpenseListEmployee`,model);
    },

    //Setup

    getExpenseCategoryList : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/GetExpenseCategoryList`,model);
    },
    insertExpenseCategory : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/InsertExpenseCategory`,model);
    },
    insertPaymentPurpose : async (model) => {
        return await axiosInstance.post(`/api/General/InsertPaymentPurpose`,model);
    },
    insertReimbursementCategory : async (model) => {
        return await axiosInstance.post(`/api/Customer/InsertReimbursmentCategory`,model);
    },
    updateExpenseCategory : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/UpdateExpenseCategory`,model);
    },
    updateReimbursementCategory : async (model) => {
        return await axiosInstance.post(`/api/Customer/UpdateReimbursmentCategory`,model);
    },
    deActivatedExpenseCategory : async (model) => {
        return await axiosInstance.post(`/api/ExpenseManagement/DeActivatedExpenseCategory`,model);
    },
    deActivatedPaymentPurpose: async (model) => {
        return await axiosInstance.post(`/api/General/DeActivatedPaymentPurpose`,model);
    },
    deActivatedReimbursementCategory : async (model) => {
        return await axiosInstance.post(`/api/Customer/DeActivatedReimbursmentCategory`,model);
    },
    getReimbursmentCategoryList : async (model) => {
        return await axiosInstance.post(`/api/Customer/GetReimbursmentCategoryList`,model);
    },
    getReimbursmentCategoryDropdown : async (model) => {
        let response = await axiosInstance.post(`/api/Customer/GetReimbursmentCategoryDropdown`,model);
        return response?.data?.data || [];
    },
    getPaymentPurposeList : async (model) => {
        return await axiosInstance.post(`/api/General/PaymentPurposeList`,model);
    },

    //webok MGMT
    getWebokList : async (model) => {
        return await axiosInstance.post(`/api/Webok/GetWebokList`,model);
    },
    getConsigneeStatus : async () => {
        return await axiosInstance.get(`/api/Webok/GetConsigneeStatusDropDown`);
    },
    updateConsigneeStatus : async (model) => {
        return await axiosInstance.put(`/api/Webok/ChangeWebokConsigneeStatus`,model);
    },
    insertHistoryConsignee : async (model) => {
        return await axiosInstance.put(`/api/Webok/InsertHistoryWebokConsigneeStatus`,model);
    },

    //field team
    getFieldList : async (model) => {
        return await axiosInstance.post(`/api/FieldManagement/GetFieldDOCList`,model);
    },
    
    //Download Any File By URL
    getFileByURL : async (url) => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return newAxiosInstance.get(`/api/General/DownloadFileFromUrl?url=${url}`);
    },

    //BIlling
    getCutomerBillingList : async (model) => {
        return axiosInstance.post(`/api/Customer/GetCustomerBillByFileNo`,model);
    },
    getGeneratedBillingList : async (model) => {
        return axiosInstance.post(`/api/Customer/GetBillDetailList`,model);
    },

    createCutomerBill : async (model) => {
        var newAxiosInstance = AxiosServices.getAxiosInstanceForFiles()
        return newAxiosInstance.post(`/api/Customer/CreateCustomerBill`,model);
    },
    getTransferCategoryList : async () => {
        return axiosInstance.get(`/api/General/TransferCategoryDropDown`);
    },
    getAdvancePayorderList : async (model) => {
        return axiosInstance.post(`/api/Customer/AdvancePayorderList`,model);
    },
    getBillDetail : async (model) => {
        return axiosInstance.post(`/api/Customer/BillDetailDropDown`,model);
    },

    //Transport

    getTransportList : async (model) => {
        return axiosInstance.post(`/api/Webok/GetTransporterList`,model);
    },
    getDropdowntransporterList : async () => {
        return axiosInstance.get(`/api/General/TransporterDropDown`);
    },
    assignTransport : async (model) => {
        return axiosInstance.post(`/api/Webok/AssignedTransport`,model);
    },

    //Reimbursement
    insertReimbursmentCategoryAmount : async (model) => {
        return axiosInstance.post(`/api/Configuration/InsertReimbursmentCategoryAmount`,model);
    },

    //Dashboard
    getCustomerStatus : async (model) => {
        return axiosInstance.post(`/api/Dashboard/CustomerStatus`,model);
    },
    getScanningDocumentationStatus : async (model) => {
        return axiosInstance.post(`/api/Dashboard/ScanningDocumentationStatus`,model);
    },
    getFileStatus : async (model) => {
        return axiosInstance.post(`/api/Dashboard/FileStatus`,model);
    },
    getRFPDashboardStatus : async (model) => {
        return axiosInstance.post(`/api/Dashboard/RFPStatus`,model);
    },
    getConsigneeDashboardStatus : async (model) => {
        return axiosInstance.post(`/api/Dashboard/ConsigneeStatus`,model);
    },
    getExpenseStatus : async (model) => {
        return axiosInstance.post(`/api/Dashboard/ExpenseStatus`,model);
    },
}
export default AxiosServices;