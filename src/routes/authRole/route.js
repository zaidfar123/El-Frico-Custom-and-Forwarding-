import { lazy } from 'react';
import { authRoles } from './authRoles'

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

const OcrDocument = Loadable(lazy(() => import('views/pages/documents/ocr')));
const UploadDocument = Loadable(lazy(() => import('views/pages/documents/UploadDocument')));
const ClearingList = Loadable(lazy(() => import('views/pages/documents/ClearingList')));
const GDList = Loadable(lazy(() => import('views/pages/documents/GDList')));
const DailyStatusReportList = Loadable(lazy(() => import('views/pages/webokMGMT/DailyStatusReportList')));
const UserList = Loadable(lazy(() => import('views/pages/user/UserList')));
const CustomerList = Loadable(lazy(() => import('views/pages/customer/CustomerList')));
const ExpenseCategoryList = Loadable(lazy(() => import('views/pages/setup/expenseCategory/expenseCategoryList')));
const Configuration = Loadable(lazy(() => import('views/pages/setup/Configuration')));
const ClearingAgency = Loadable(lazy(() => import('views/pages/setup/Configuration/ClearingAgency')));
const ReimbursementCategory = Loadable(lazy(() => import('views/pages/setup/Configuration/ReimbursementCategory')));
const ReimbursementCategoryList = Loadable(lazy(() => import('views/pages/setup/reimbursementCategory/reimbursementCategoryList')));
const PaymentPurposeList = Loadable(lazy(() => import('views/pages/setup/PaymentPurpose/paymentPurposeList')));
const Profile = Loadable(lazy(() => import('views/pages/user/Profile')));
const DailyExpense = Loadable(lazy(() => import('views/pages/expense/DailyExpense')));
const ExpenseDistribution = Loadable(lazy(() => import('views/pages/expense/ExpenseDistribution')));
const ExpenseDistributionList = Loadable(lazy(() => import('views/pages/expense/ExpenseDistributionList')));
const ExpenseList = Loadable(lazy(() => import('views/pages/expense/ExpenseList')));
const FieldTeamList = Loadable(lazy(() => import('views/pages/field_team/FieldTeamList')));
const CargoList = Loadable(lazy(() => import('views/pages/cargo/CargoList')));
const CustomerBillList = Loadable(lazy(() => import('views/pages/billing/CustomerBillList')));
const AdvancePayOrderList = Loadable(lazy(() => import('views/pages/billing/AdvancePayOrderList')));
const PayBillList = Loadable(lazy(() => import('views/pages/billing/PayBillList')));
const GeneratedBillList = Loadable(lazy(() => import('views/pages/billing/GeneratedBillList')));
const TransportList = Loadable(lazy(() => import('views/pages/transport/TransportList')));
const DashboardDefault = Loadable(lazy(() => import('views/pages/dashboard')));

const BankList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/BankSetup')));
const ShipmentDetailsList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/ShipmentDetailsSetup')));
const TerminalList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/TerminalSetup')));
const CollectorateList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/CollectorateSetup')));
const CargoTypeList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/CargoTypeSetup')));
const Cargo_List = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/CargoSetup')));
const AgencyList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/AgencySetup')));
const ItemCategoryList = Loadable(lazy(() => import('views/pages/setup/genericSetupForms/ItemCategorySetup')));
const UserAssignmentScreen = Loadable(lazy(() => import('views/pages/setup/userScreen')));

const Routes =
    [
        // {
        //     path: '/',
        //     element: <DashboardDefault />,
        //     role: authRoles.all
        // },
        {
            path: '/',
            element: <DashboardDefault />,
            role: authRoles.all
        },
        {
            path: '/ScanDocuments',
            element: <OcrDocument />,
            role: authRoles.all
        },
        {
            path: '/ClearingList',
            element: <ClearingList />,
            role: authRoles.all
        },
        {
            path: '/GDList',
            element: <GDList />,
            role: authRoles.all
        },
        {
            path: '/UserList',
            element: <UserList />,
            role: authRoles.all
        },
        {
            path: '/CustomerList',
            element: <CustomerList />,
            role: authRoles.all
        },
        {
            path: '/UserProfile',
            element: <Profile />,
            role: authRoles.all
        },
        {
            path: '/ExpenseCategoryList',
            element: <ExpenseCategoryList />,
            role: authRoles.all
        },
        {
            path: '/DailyExpense',
            element: <DailyExpense />,
            role: authRoles.all
        },
        {
            path: '/ExpenseList',
            element: <ExpenseList />,
            role: authRoles.all
        },
        {
            path: '/UploadDocument',
            element: <UploadDocument />,
            role: authRoles.all
        },
        {
            path: '/Configuration',
            element: <Configuration />,
            role: authRoles.all
        },
        {
            path: '/DailyStatusReportList',
            element: <DailyStatusReportList />,
            role: authRoles.all
        },
        {
            path: '/ExpenseDistribution',
            element: <ExpenseDistribution />,
            role: authRoles.all
        },
        {
            path: '/ExpenseDistributionList',
            element: <ExpenseDistributionList />,
            role: authRoles.all
        },
        {
            path: '/FieldTeamList',
            element: <FieldTeamList />,
            role: authRoles.all
        },
        {
            path: '/CargoList',
            element: <CargoList />,
            role: authRoles.all
        },
        {
            path: '/CustomerBillList',
            element: <CustomerBillList />,
            role: authRoles.all
        },
        {
            path: '/AdvancePayOrderList',
            element: <AdvancePayOrderList />,
            role: authRoles.all
        },
        {
            path: '/PayBillList',
            element: <PayBillList />,
            role: authRoles.all
        },
        {
            path: '/GeneratedBillList',
            element: <GeneratedBillList />,
            role: authRoles.all
        },
        {
            path: '/TransportList',
            element: <TransportList />,
            role: authRoles.all
        },
        {
            path: '/ReimbursementCategoryList',
            element: <ReimbursementCategoryList />,
            role: authRoles.all
        },
        {
            path: '/ClearingAgency',
            element: <ClearingAgency />,
            role: authRoles.all
        },
        {
            path: '/ReimbursementCategory',
            element: <ReimbursementCategory />,
            role: authRoles.all
        },
        {
            path: '/paymentPurposeList',
            element: <PaymentPurposeList />,
            role: authRoles.all
        },
        {
            path: '/BankList',
            element: <BankList />,
            role: authRoles.all
        },
        {
            path: '/ShipmentDetailsList',
            element: <ShipmentDetailsList />,
            role: authRoles.all
        },
        {
            path: '/TerminalList',
            element: <TerminalList />,
            role: authRoles.all
        },
        {
            path: '/CollectorateList',
            element: <CollectorateList />,
            role: authRoles.all
        },
        {
            path: '/CargoTypeList',
            element: <CargoTypeList />,
            role: authRoles.all
        },
        {
            path: '/CargoDetailList',
            element: <Cargo_List />,
            role: authRoles.all
        },
        {
            path: '/AgencyList',
            element: <AgencyList />,
            role: authRoles.all
        },
        {
            path: '/ItemCategoryList',
            element: <ItemCategoryList />,
            role: authRoles.all
        },
        {
            path: '/UserAssignmentScreen',
            element: <UserAssignmentScreen />,
            role: authRoles.all
        },
    ];

export default Routes;
