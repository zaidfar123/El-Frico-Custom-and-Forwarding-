// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconWallet,IconExchange,IconListDetails } from '@tabler/icons';

// constant
const icons = {
    IconWallet,
    IconExchange,
    IconListDetails
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const expense = {
    id: 'expense',
    title: <FormattedMessage id="Expense Management" />,
    type: 'group',
    children: [
        {
            id: 'expenseform',
            title: <FormattedMessage id="Expense Distribution" />,
            type: 'item',
            url: '/ExpenseDistribution',
            icon: icons.IconExchange,
            breadcrumbs: false
        },
        {
            id: 'expenselist',
            title: <FormattedMessage id="Expense Distribution List" />,
            type: 'item',
            url: '/ExpenseDistributionList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
        {
            id: 'dailyexpenseform',
            title: <FormattedMessage id="Daily Expense" />,
            type: 'item',
            url: '/DailyExpense',
            icon: icons.IconWallet,
            breadcrumbs: false
        },
        {
            id: 'expenseList',
            title: <FormattedMessage id="Expense List" />,
            type: 'item',
            url: '/ExpenseList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },

    ]
};

export default expense;
