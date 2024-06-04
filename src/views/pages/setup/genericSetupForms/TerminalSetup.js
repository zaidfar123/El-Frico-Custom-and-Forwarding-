import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function TerminalSetup() {

    const columnConfig = [
        { name: 'Terminal Name', col: 'terminalName' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Terminal"}
            CardTitle={"Terminal List"}
            name={"terminalName"}
            label={"Terminal"}
            DeleteService={AxiosService.deleteTerminal}
            DeleteId={"terminalID"}
            InsertService={AxiosService.insertTerminal}
            UpdateService={AxiosService.updateTerminal}
            GetService={AxiosService.getTerminalList}
        />
    )

}