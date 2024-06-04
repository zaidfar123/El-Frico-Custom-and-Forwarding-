import dashboard from './dashboard';
import widget from './widget';
import application from './application';
import forms from './forms';
import elements from './elements';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';
import ocr from './ocr';
import user from './user';
import customer from './customer';
import setup from './setup';
import expense from './expense';
import cargo from './cargo';
import dataentry from './dataentry';
import transport from './transport';
import webok from './webok';
import payroll from './payroll';
import billing from './billing';
import fieldteam from './fieldteam';
import importexport from './importexport';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [dashboard,user,customer,importexport, cargo,expense,billing,fieldteam,webok,transport,payroll,setup,dataentry]
};

export default menuItems;
