import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function AgencySetup() {

    const columnConfig = [
        { name: 'Agency Name', col: 'agencyName' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Agency"}
            CardTitle={"Agency List"}
            name={"agencyName"}
            label={"Agency"}
            InsertService={AxiosService.insertAgency}
            UpdateService={AxiosService.updateAgency}
            DeleteService={AxiosService.deleteAgency}
            DeleteId={"agencyID"}
            GetService={AxiosService.getAgencySetupList}
        />
    )

}