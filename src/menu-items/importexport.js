// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconScan,IconListDetails,IconSettingsAutomation,IconFileUpload } from '@tabler/icons';

// constant
const icons = {
    IconScan,
    IconListDetails,
    IconSettingsAutomation,
    IconFileUpload
};
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const importexport = {
    id: 'importexport',
    title: <FormattedMessage id="Import & Export Management" />,
    type: 'group',
    children: [
        {
            id: 'UploadDocument',
            title: <FormattedMessage id="Upload Document" />,
            type: 'item',
            url: '/UploadDocument',
            icon: icons.IconFileUpload,
            breadcrumbs: false
        },
        {
            id: 'scandocuments',
            title: <FormattedMessage id="Scan Document" />,
            type: 'item',
            url: '/ScanDocuments',
            icon: icons.IconScan,
            breadcrumbs: false
        },
        {
            id: 'ClearingList',
            title: <FormattedMessage id="Clearing List" />,
            type: 'item',
            url: '/ClearingList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
        {
            id: 'GDList',
            title: <FormattedMessage id="Goods Declaration List" />,
            type: 'item',
            url: '/GDList',
            icon: icons.IconListDetails,
            breadcrumbs: false
        },
        {
            id: 'agencysetup',
            title: <FormattedMessage id="Clearing Agency" />,
            type: 'item',
            url: '/ClearingAgency',
            icon: icons.IconSettingsAutomation,
            breadcrumbs: false
        },
     
    ]
};

export default importexport;
