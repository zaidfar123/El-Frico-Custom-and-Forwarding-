import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function BankSetup() {

    const columnConfig = [
        { name: 'Bank Name', col: 'bankName' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Bank"}
            CardTitle={"Bank List"}
            name={"bankName"}
            label={"Bank"}
            InsertService={AxiosService.insertBank}
            UpdateService={AxiosService.updateBank}
            DeleteService={AxiosService.deleteBank}
            DeleteId={"bankID"}
            GetService={AxiosService.getBankSetupList}
        />
    )

}