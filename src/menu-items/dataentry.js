// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconUsers
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dataentry = {
    id: 'dataentry',
    title: <FormattedMessage id="Data Entry" />,
    type: 'group',
    children: [
        {
            id: 'dataentry',
            title: <FormattedMessage id="List" />,
            type: 'item',
            url: '/',
            icon: icons.IconUsers,
            breadcrumbs: false
        },
    ]
};

export default dataentry;
