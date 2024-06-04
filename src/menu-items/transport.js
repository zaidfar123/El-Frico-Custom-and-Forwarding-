// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconListDetails } from '@tabler/icons';

// constant
const icons = {
    IconListDetails
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const transport = {
    id: 'transport',
    title: <FormattedMessage id="Transportation Management" />,
    type: 'group',
    children: [
        {
            id: 'transport',
            title: <FormattedMessage id="Transport List" />,
            type: 'item',
            url: '/TransportList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
    ]
};

export default transport;
