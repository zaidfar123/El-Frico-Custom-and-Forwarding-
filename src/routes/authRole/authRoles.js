export const authRoles = {
    // sa: ['SuperAdmin'], // Only Super Admin has access
    // filer: ['Filer'], // Only SA & Admin has access
    // verifiers: ['FirstVerifier' , 'SecondVerifier', 'Approver', 'Verifier'], // Only SA & Admin & Editor has access
    // distributor: ['distributor'], // Everyone has access
    // finance: ['FinanceExecutive'], // Everyone has access
    // claimManager: ['Claim Manager'], // Everyone has access
    // verifiersDis : ['FirstDistributorVerifier','SecondDistributorVerifier', 'finaldistributorapprover', 'Field User','SuperAdmin'],
    // fielduser : ['Field User'],
    admins : ['Sub Admin','Admin'],
    // all : ['Sub Admin','Admin','Verifier','distributor','Filer','FirstVerifier', 'SecondVerifier' , 'Approver' , 'FirstDistributorVerifier','SecondDistributorVerifier', 'finaldistributorapprover', 'Field User', 'SuperAdmin', 'Claim Manager','FinanceExecutive','Scanning Operator'],
    all : ['Sub Admin', 'Admin', 'Approver' , 'Scanning Operator', 'RFP Coordinator', 'Accounts Coordinator', 'Billing Coordinator', 'Delivery Coordinator', 'Document Uploader', 'Customer'],

}
