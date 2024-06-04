import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function ShipmentDetails() {

    const columnConfig = [
        { name: 'Shipment Type Detail', col: 'shipmentTypeDetailName' },
        { name: 'Custom Type', col: 'customType' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Shipment Detail"}
            CardTitle={"Shipment Details List"}
            name={"shipmentTypeDetailName"}
            label={"Shipment Detail"}
            InsertService={AxiosService.insertShipmentDetail}
            UpdateService={AxiosService.updateShipmentDetails}
            GetService={AxiosService.getshipmentDetailList}
            hasDropdown={true}
            DeleteService={AxiosService.deleteShipmentDetails}
            DeleteId={"shipmentTypeDetailID"}
            dropDownProps={{
                label: "Custom Type",
                name: "customTypeID",
            }}
            dropDownService={AxiosService.getCustomType}
            options={{
                value: "customTypeID",
                label: "customType",
            }}
        />
    )

}