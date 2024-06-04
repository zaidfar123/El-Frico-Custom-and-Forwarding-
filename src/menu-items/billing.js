// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconListDetails,IconSettingsAutomation } from '@tabler/icons';

// constant
const icons = {
    IconListDetails,IconSettingsAutomation
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const billing = {
    id: 'billing',
    title: <FormattedMessage id="Billing & Accounts Management" />,
    type: 'group',
    children: [
        {
            id: 'billing',
            title: <FormattedMessage id="Customer Bill List" />,
            type: 'item',
            url: '/CustomerBillList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
        {
            id: 'advance',
            title: <FormattedMessage id="PayOrder List" />,
            type: 'item',
            url: '/AdvancePayOrderList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
        // {
        //     id: 'pay',
        //     title: <FormattedMessage id="Bill List" />,
        //     type: 'item',
        //     url: '/PayBillList',
        //     icon: icons.IconListDetails,
        //     breadcrumbs: false
        // },
        {
            id: 'pay',
            title: <FormattedMessage id="Bill List" />,
            type: 'item',
            url: '/GeneratedBillList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
        {
            id: 'ReimbursementCategory',
            title: <FormattedMessage id="Reimbursement Category" />,
            type: 'item',
            url: '/ReimbursementCategory',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
    ]
};

export default billing;
