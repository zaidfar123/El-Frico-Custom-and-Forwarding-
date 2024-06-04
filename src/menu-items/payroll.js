// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconUsers
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const payroll = {
    id: 'payroll',
    title: <FormattedMessage id="Payroll Management" />,
    type: 'group',
    children: [
        {
            id: 'payroll',
            title: <FormattedMessage id="List" />,
            type: 'item',
            url: '/',
            icon: icons.IconUsers,
            breadcrumbs: false
        },
    ]
};

export default payroll;
