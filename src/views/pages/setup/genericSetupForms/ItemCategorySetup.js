import AxiosService from "service";
import GenericSetup from "../genericSetupList";

export default function ItemCategorySetup() {

    const columnConfig = [
        { name: 'Item Category Name', col: 'itemCategoryName' },
        { name: 'Status', col: 'isActive' },
    ];

    return (
        <GenericSetup
            columnConfig={columnConfig}
            ButtonLabel={"Add Item Category"}
            CardTitle={"Item Category List"}
            name={"itemCategoryName"}
            label={"Item Category"}
            DeleteService={AxiosService.deleteItemCategory}
            DeleteId={"itemCategoryID"}
            InsertService={AxiosService.insertItemCategory}
            UpdateService={AxiosService.updateItemCategory}
            GetService={AxiosService.getItemCategoryList}
        />
    )

}