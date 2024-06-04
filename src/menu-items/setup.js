// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSettingsAutomation } from '@tabler/icons';

// constant
const icons = {
    IconSettingsAutomation
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const customer = {
    id: 'setup',
    title: <FormattedMessage id="Setup" />,
    type: 'group',
    children: [
        {
            id: 'expensecat',
            title: <FormattedMessage id="Expense Category List" />,
            type: 'item',
            url: '/ExpenseCategoryList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'configuration',
            title: <FormattedMessage id="Configuration" />,
            type: 'item',
            url: '/Configuration',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'Reimbursement',
            title: <FormattedMessage id="Reimbursement Category List" />,
            type: 'item',
            url: '/ReimbursementCategoryList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'paymentPurpose',
            title: <FormattedMessage id="Payment Purpose List" />,
            type: 'item',
            url: '/paymentPurposeList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'shipmentdetails',
            title: <FormattedMessage id="Shipment Details List" />,
            type: 'item',
            url: '/ShipmentDetailsList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'CargoSetup',
            title: <FormattedMessage id="Cargo List" />,
            type: 'item',
            url: '/CargoDetailList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'CargoTypeSetup',
            title: <FormattedMessage id="Cargo Type List" />,
            type: 'item',
            url: '/CargoTypeList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'BankSetup',
            title: <FormattedMessage id="Bank List" />,
            type: 'item',
            url: '/BankList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'TerminalSetup',
            title: <FormattedMessage id="Terminal List" />,
            type: 'item',
            url: '/TerminalList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'CollectorateSetup',
            title: <FormattedMessage id="Collectorate List" />,
            type: 'item',
            url: '/CollectorateList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'AgencySetup',
            title: <FormattedMessage id="Agency List" />,
            type: 'item',
            url: '/AgencyList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        {
            id: 'ItemCategorySetup',
            title: <FormattedMessage id="Item Category List" />,
            type: 'item',
            url: '/ItemCategoryList',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
        // {
        //     id: 'ItemCategorySetup',
        //     title: <FormattedMessage id="User Assignment" />,
        //     type: 'item',
        //     url: '/UserAssignmentScreen',
        //     icon: icons.IconSettingsAutomation,
        //     breadcrumbs: false
        // },
    ]
};

export default customer;
