// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconListDetails } from '@tabler/icons';

// constant
const icons = {
    IconListDetails
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const cargo = {
    id: 'cargo',
    title: <FormattedMessage id="Cargo Management" />,
    type: 'group',
    children: [
        {
            id: 'cargo',
            title: <FormattedMessage id="Cargo List" />,
            type: 'item',
            url: '/CargoList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
    ]
};

export default cargo;
