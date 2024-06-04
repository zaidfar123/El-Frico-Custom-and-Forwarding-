import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';
import Loadable from 'ui-component/Loadable';

const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
const ClearingList = Loadable(lazy(() => import('views/pages/documents/ClearingList')));
const OcrDocument = Loadable(lazy(() => import('views/pages/documents/ocr')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    // return useRoutes([{ path: '/', element: <OcrDocument /> },  MainRoutes]);
}
