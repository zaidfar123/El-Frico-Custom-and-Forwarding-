import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function CargoTypeSetup() {

    const columnConfig = [
        { name: 'Cargo Type Name', col: 'cargoTypeDetailName' },
        { name: 'Cargo Name', col: 'cargoTypeName' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Cargo Type"}
            CardTitle={"Cargo Type List"}
            name={"cargoTypeDetailName"}
            label={"Cargo Type Name"}
            InsertService={AxiosService.insertCargoType}
            UpdateService={AxiosService.updateCargoType}
            GetService={AxiosService.getCargoTypeList}
            hasDropdown={true}
            DeleteService={AxiosService.deleteCargoType}
            DeleteId={"cargoTypeDetailID"}
            dropDownProps={{
                label: "Cargo",
                name: "cargoTypeID",
            }}
            dropDownService={AxiosService.getCargoType}
            options={{
                value: "cargoTypeID",
                label: "cargoTypeName",
            }}
        />
    )

}