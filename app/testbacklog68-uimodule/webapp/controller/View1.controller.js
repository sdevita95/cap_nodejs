sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], (Controller, JSONModel, MessageBox, MessageToast, Filter, FilterOperator) => {
    "use strict";
    const sUriOdataV2 = "/odata/v2/backend";
    //const sUriOdataV4 = "/odata/v4/backend";

    return Controller.extend("com.sap.testbacklog68uimodule.controller.View1", {
        onInit() {
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);
            this._oBundleI18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.getView().setModel(new JSONModel({}), "viewModel")
        },
        _onRouteMatched: function () {
            const uiModel = new sap.ui.model.json.JSONModel({
                editBook: null
            });
            this.getView().setModel(uiModel, "ui");
        },
        onSearch: function () {
            const oFilterBar = this.getView().byId("idFilterBar")
            var aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl(),
                    aSelectedKeys = oControl.getSelectedKeys(),
                    aFilters = aSelectedKeys.map(function (sSelectedKey) {
                        const isNumber = !isNaN(Number(sSelectedKey));
                        return new Filter({
                            path: oFilterGroupItem.getName(),
                            operator: isNumber ? FilterOperator.EQ : FilterOperator.Contains,
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
                    if (sAction == 'Conferma') {
                        const oModel = new sap.ui.model.odata.v2.ODataModel(sUriOdataV2, {
                            defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put,
                        });
                        const sEntitySet = "/deleteLibro",
                            sMethod = "POST",
                            oUrlParameters = { ID: oBook.ID }
                        this._deleteBooks(oModel, sEntitySet, sMethod, oUrlParameters)
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        },
        _deleteBooks: async function (oModel, sEntitySet, sMethod, oUrlParameters) {
            const result = await this.backendAction(oModel, sEntitySet, sMethod, oUrlParameters, "function")
            MessageBox.success(result.deleteLibro.message)
            this._refreshDataTable();
        },
        onCreateBook: function () {
            const viewModel = this.getView().getModel("viewModel")
            viewModel.setProperty("/currentDialog", {
                Titolo: "",
                CopieDisponibili: 1,
                AutoreID: "",
                GenereID: ""
            })
            const oView = this.getView(),
                oDialog = sap.ui.xmlfragment(oView.getId(), "com.sap.testbacklog68uimodule.view.fragment.View1.Dialog.AggiungiLibro", this);
            oView.addDependent(oDialog);
            oDialog.open();
        },
        _confirmCreateBook: async function (oEvent) {
            const sIdDialog = oEvent.getSource().data("idDialog");
            const viewModel = this.getView().getModel("viewModel")
            const oModel = new sap.ui.model.odata.v2.ODataModel(sUriOdataV2, {
                defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put,
            });
            const sEntitySet = "/addLibro",
                sMethod = "POST",
                oUrlParameters = viewModel.getProperty("/currentDialog")
            this._createBooks(oModel, sEntitySet, sMethod, oUrlParameters, sIdDialog)
        },
        _createBooks: async function (oModel, sEntitySet, sMethod, oUrlParameters, sIdDialog) {
            const result = await this.backendAction(oModel, sEntitySet, sMethod, oUrlParameters, "function")
            MessageBox.success(result.addLibro.message)
            this.onAnnullaDialog(null, sIdDialog)
            this._refreshDataTable();
        },
        _refreshDataTable: function () {
            const oTable = this.byId("idTableLibri");
            if (oTable) {
                oTable.getBinding("items").refresh(true);
            }
        },
        onEditBook: function (oEvent) {
            const ctx = this._getRowContext(oEvent);
            const bookId = ctx.getProperty("ID");
            this.getView().getModel("ui").setProperty("/editBook", bookId);
        },
        onChangeSelect: function (oEvent) {
            const oSelect = oEvent.getSource();
            const sChangePath = oSelect.data().path
            const sKey = oSelect.getSelectedKey();
            const oContext = oSelect.getBindingContext("odataV2");
            oContext.setProperty(sChangePath, sKey);
        },
        _confirmEditBook: async function (oEvent) {
            const oModel = this.getView().getModel("odataV2");
            const ctx = this._getRowContext(oEvent);
            const sEntitySet = "/updateLibro",
                sMethod = "POST",
                oUrlParameters = {
                    ID: ctx.getProperty("ID"),
                    Genere_ID: ctx.getProperty("Genere_ID")
                };
            try {
                const result = await this.backendAction(oModel, sEntitySet, sMethod, oUrlParameters, "function");
                this.getView().getModel("ui").setProperty("/editBook", null);
                MessageBox.success(result.updateLibro.message)
                this._refreshDataTable()
            } catch (e) {
            }
        },
        onCancelEdit: function (oEvent) {
            const ctx = this._getRowContext(oEvent);
            const oModel = this.getView().getModel("odataV2");
            oModel.resetChanges([ctx.getPath()]);
            this.getView().getModel("ui").setProperty("/editBook", null);
        },
    });
});