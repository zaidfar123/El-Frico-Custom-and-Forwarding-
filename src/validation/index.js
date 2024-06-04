import * as yup from "yup";


export const changePassword = yup.object().shape({
    oldPassword: yup
        .string()
        .required('Current Password is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    RePassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
});
export const userInsert = yup.object().shape({
    userName: yup
        .string()
        .required('username is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('email is required'),
    mobileno: yup
        .string()
        .required('cell number is required'),
    city: yup
        .string()
        .required('city is required'),
    address: yup
        .string()
        .required('address is required'),
    state: yup
        .string()
        .required('state is required'),
    postalCode: yup
        .string()
        .required('postal code is required'),
    roleID: yup
        .string()
        .required('Role is required')
        .notOneOf(['0'], 'Role is required'),
});
export const customerInsert = yup.object().shape({
    customerName: yup
        .string()
        .required('customer name is required'),
    customerEmail: yup
        .string()
        .email('Invalid email format')
        .required('email is required'),
    customerMobileNo: yup
        .string()
        .required('phone is required'),
    customerAddress: yup
        .string()
        .required('address is required'),
    state: yup
        .string()
        .required('state is required'),
    city: yup
        .string()
        .required('city is required'),
    ntn: yup
        .string()
        .required('NTN is required'),
});
export const expensecateoryInsert = yup.object().shape({
    expenseCategoryName: yup
        .string()
        .required('Expense Category is required'),
});
export const paymentPurposeInsert = yup.object().shape({
    paymentPurpose: yup
        .string()
        .required('Payment Purpose is required'),
});
export const reimbursmentCategoryInsert = yup.object().shape({
    reimbursmentCategoryName: yup
        .string()
        .required('Reimbursement Category is required'),
});
export const genericSetup = yup.object().shape({
    setupValue: yup
        .string()
        .required('this is a required field'),
});

export const expenseList = yup.object().shape({
    expenseCategoryID: yup
        .string()
        .required('Expense Category is required')
        .nullable(),
    amount: yup
        .string()
        .required('Amount is required')
        .matches(/^[1-9][0-9]*$/, 'Invalid amount.'),
    file: yup
        .string()
        .required('File is required')
        .nullable(),
});

export const dailyExpense = yup.object().shape({
    customerID: yup
        .string()
        .required('Customer is required')
        .notOneOf(['0'], 'Customer is required'),
    fileNo: yup
        .string()
        .required('File No is required')
        .nullable(),
    dailyExpenseCategoryModels: yup
        .mixed()
        .required('Daily Expense is required')
        .nullable(),
});

export const agencyConfiguration = yup.object().shape({
    // customerID: yup
    //     .string()
    //     .required('Customer is required')
    //     .notOneOf(['0'], 'Customer is required'),
    // fileNo: yup
    //     .string()
    //     .required('File No is required')
    //     .nullable(),
    agenciesClearingRequestModels: yup
        .mixed()
        .required('Agency List is required')
        .nullable(),
});


export const reimbursementConfiguration = yup.object().shape({
    // customerID: yup
    //     .string()
    //     .required('Customer is required')
    //     .notOneOf(['0'], 'Customer is required'),
    // fileNo: yup
    //     .string()
    //     .required('File No is required')
    //     .nullable(),
    reAmountMapModels: yup
        .mixed()
        .required('List is required')
        .nullable(),
});

export const expenseDistribution = yup.object().shape({
    amount: yup
        .string()
        .required('Amount is required'),
});

export const clearingProduct = yup.object().shape({
    grossWeight: yup
        .string()
        .required('Gross Weight is required'),
    item: yup
        .string()
        .required('Product is required'),
    noOfPkgs: yup
        .string()
        .required('Quantity is required'),
    netWeight: yup
        .string()
        .required('Net Weight is required'),
    harmonizedSystemCode: yup
        .string()
        .required('HS Code is required'),
});
export const clearingAgency = yup.object().shape({
    agencyID: yup
        .string()
        .required('Agency is required')
        .notOneOf(['0'], 'Agency is required'),
    amount: yup
        .string()
        .required('Amount is required'),
});
export const reimbursementCategory = yup.object().shape({
    reimbursmentCategoryID: yup
        .string()
        .required('Reimbursement Category is required')
        .notOneOf(['0'], 'Reimbursement Category is required'),
    amount: yup
        .string()
        .required('Amount is required'),
});
export const clearingForm = yup.object().shape({
    consignee: yup
        .string()
        .required('Consignee is required'),
    totalAmount: yup
        .string()
        .required('Total Amount is required'),
    billOfLading: yup
        .string()
        .required('Bill of Lading is required'),
    vessel: yup
        .string()
        .required('Vessel is required'),
    voyNo: yup
        .string()
        .required('Voyage No is required'),
    portofLoading: yup
        .string()
        .required('Port of Loading is required'),
    portofDischarge: yup
        .string()
        .required('Port of Discharge is required'),
    InvoiceNo: yup
        .string()
        .required('Invoice No is required'),
    freightForward: yup
        .string()
        .required('Freight Forwarder is required'),
    shipperName: yup
        .string()
        .required('Shipper Name Forward is required'),
    // shippingLine: yup
    //     .string()
    //     .required('Shipping Line is required'),
    shippingTerm: yup
        .string()
        .required('Shipping Term is required'),
    freightTerm: yup
        .string()
        .required('Freight Term is required'),
    lC_Number: yup
        .string()
        .required('LC No is required'),
    wharfID: yup
        .string()
        .required('Wharf is required')
        .notOneOf(['0'], 'Wharf is required'),
    shedID: yup
        .string()
        .required('Shed is required')
        .notOneOf(['0'], 'Shed is required'),
    conversionUnitID: yup
        .string()
        .required('Currency Conversion is required')
        .notOneOf(['0'], 'Currency Conversion is required'),
    insertItemModels: yup
        .mixed()
        .required('Product is required')
        .nullable(),

});
export const uploadDocuments = yup.object().shape({
    customerID: yup
        .string()
        .required('Customer is required')
        .notOneOf(['0'], 'Customer is required'),
    file: yup
        .string()
        .required('File is required')
        .nullable(),
});


export const customBreakup = yup.object().shape({
    insurancePercentage: yup
        .string()
        .required('this is a required field.'),
    landingChargesPercentage: yup
        .string()
        .required('this is a required field.'),
    customDutyPercentage: yup
        .string()
        .required('this is a required field.'),
    regultoryDutyPercentage: yup
        .string()
        .required('this is a required field.'),
    salesTaxPercentage: yup
        .string()
        .required('this is a required field.'),
    advanceITaxPercentage: yup
        .string()
        .required('this is a required field.'),
    sdChargesRs: yup
        .string()
        .required('this is a required field.'),
    excisePercentage: yup
        .string()
        .required('this is a required field.'),
    taxationCharges: yup
        .string()
        .required('this is a required field.'),
    conversionRate: yup
        .string()
        .required('this is a required field.'),
});
export const conversionRate = yup.object().shape({
    conversionUnitName: yup
        .string()
        .required('this is a required field.'),
    conversionRate: yup
        .string()
        .required('this is a required field.'),
});

export const shipmentDetails = yup.object().shape({
    shipmentTypeID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    bankID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    shipmentTypeDetailID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    cargoTypeID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    cargoTypeDetailID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    itemCategoryID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    terminalID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    collectorateID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    count: yup
        .string()
        .required('this is a required field.'),
});

export const advancePayOrder = yup.object().shape({
    customerID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    TransferCategoryID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    ocrid: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    AdvanceAmount: yup
        .string()
        .required('this is a required field.'),
});

export const addTransport = yup.object().shape({
    customerID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    clearingID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
    transporterID: yup
        .string()
        .required('this is a required field.')
        .notOneOf(['0'], 'this is a required field.'),
});