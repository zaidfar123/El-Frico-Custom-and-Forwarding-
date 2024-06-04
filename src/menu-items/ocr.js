// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconScan,IconListDetails,IconFileUpload } from '@tabler/icons';

// constant
const icons = {
    IconScan,
    IconListDetails,
    IconFileUpload
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ocr = {
    id: 'document',
    title: <FormattedMessage id="Documents" />,
    icon: <IconListDetails />,
    type: 'group',
    children: [
        {
            id: 'scandocuments',
            title: <FormattedMessage id="Scan Document" />,
            type: 'item',
            url: '/ScanDocuments',
            icon: icons.IconFileUpload,   
            breadcrumbs: false
        },
        {
            id: 'ClearingList',
            title: <FormattedMessage id="Clearing List" />,
            type: 'item',
            url: '/',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
    ]
};

export default ocr;
