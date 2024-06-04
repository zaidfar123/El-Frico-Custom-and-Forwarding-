// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconListDetails } from '@tabler/icons';

// constant
const icons = {
    IconListDetails
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const fieldteam = {
    id: 'team',
    title: <FormattedMessage id="Field Team Management" />,
    type: 'group',
    children: [
        {
            id: 'team',
            title: <FormattedMessage id="Field Team List" />,
            type: 'item',
            url: '/FieldTeamList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
    ]
};

export default fieldteam;
