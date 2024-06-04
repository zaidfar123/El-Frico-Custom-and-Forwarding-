import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function CollectorateSetup() {

    const columnConfig = [
        { name: 'Collectorate Name', col: 'collectorateName' },
        { name: 'Custom Type', col: 'customType' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Collectorate"}
            CardTitle={"Collectorate List"}
            name={"collectorateName"}
            label={"Collectorate Name"}
            InsertService={AxiosService.insertCollectorate}
            UpdateService={AxiosService.updateCollectorate}
            GetService={AxiosService.getCollectorateList}
            hasDropdown={true}
            DeleteService={AxiosService.deleteCollectorate}
            DeleteId={"collectorateID"}
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