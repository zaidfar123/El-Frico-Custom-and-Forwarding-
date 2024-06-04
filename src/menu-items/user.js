// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconUsers
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const user = {
    id: 'user',
    title: <FormattedMessage id="User Management" />,
    type: 'group',
    children: [
        {
            id: 'UserList',
            title: <FormattedMessage id="User List" />,
            type: 'item',
            url: '/UserList',
            icon: icons.IconUsers,
            breadcrumbs: false
        },
    ]
};

export default user;
