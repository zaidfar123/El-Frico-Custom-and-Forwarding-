// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconUsers
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const customer = {
    id: 'customer',
    title: <FormattedMessage id="Customer Management" />,
    type: 'group',
    children: [
        {
            id: 'customer',
            title: <FormattedMessage id="Customer List" />,
            type: 'item',
            url: '/CustomerList',
            icon: icons.IconUsers,
            breadcrumbs: false
        },
    ]
};

export default customer;
