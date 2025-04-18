sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], (Controller, MessageBox, MessageToast, Filter, FilterOperator) => {
    "use strict";
    const sUriOdataV2 = "/odata/v2/backend";
    const sUriOdataV4 = "/odata/v4/backend";

    return Controller.extend("com.sap.nodedemouimodule.controller.View1", {
        onInit() {
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);
            this._oBundleI18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        onSearch: function () {
            const oFilterBar = this.getView().byId("idFilterBar")
            var aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl(),
                    aSelectedKeys = oControl.getSelectedKeys(),
                    aFilters = aSelectedKeys.map(function (sSelectedKey) {
                        return new Filter({
                            path: oFilterGroupItem.getName(),
                            operator: FilterOperator.Contains,
                            value1: sSelectedKey
                        });
                    });

                if (aSelectedKeys.length > 0) {
                    aResult.push(new Filter({
                        filters: aFilters,
                        and: false
                    }));
                }

                return aResult;
            }, []);
            const oTable = this.getView().byId("idTableLibri")
            oTable.getBinding("items").filter(aTableFilters);
        },
        onDeleteBook: function (oEvent) {
            const oBook = oEvent.getSource().getBindingContext("odataV2").getObject()
            MessageBox.warning(this._oBundleI18n.getText("warning.ConfirmDeleteBook"), {
                actions: ["Annulla", "Conferma"],
                emphasizedAction: "Conferma",
                onClose: function (sAction) {
                    if(sAction == 'Conferma'){
                        const oModel = this.getView().getModel("odataV2"),
                            sEntitySet = "/deleteLibro",
                            sMethod = "POST",
                            oUrlParameters = { ID: oBook.ID}
                        this._deleteBooks(oModel, sEntitySet, sMethod, oUrlParameters)
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        },
        _deleteBooks: async function(oModel, sEntitySet, sMethod, oUrlParameters){
            const result = this.backendAction(oModel, sEntitySet, sMethod, oUrlParameters)
            console.log(result)
        }
    });
});