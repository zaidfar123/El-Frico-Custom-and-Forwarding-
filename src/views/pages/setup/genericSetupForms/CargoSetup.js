import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function CargoSetup() {

    const columnConfig = [
        { name: 'Cargo Name', col: 'cargoTypeName' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Cargo"}
            CardTitle={"Cargo List"}
            name={"cargoTypeName"}
            label={"Cargo Name"}
            DeleteService={AxiosService.deleteCargo}
            DeleteId={"cargoTypeID"}
            InsertService={AxiosService.insertCargo}
            UpdateService={AxiosService.updateCargo}
            GetService={AxiosService.getCargoList}
        />
    )

}