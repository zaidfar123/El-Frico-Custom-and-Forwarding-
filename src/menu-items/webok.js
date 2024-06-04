// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconReport } from '@tabler/icons';

// constant
const icons = {
    IconReport
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const webok = {
    id: 'webok',
    title: <FormattedMessage id="Webok Status Management" />,
    type: 'group',
    children: [
        {
            id: 'webok',
            title: <FormattedMessage id="Daily Status Report" />,
            type: 'item',
            url: '/DailyStatusReportList',
            icon: icons.IconReport,
            breadcrumbs: false
        },
    ]
};

export default webok;
