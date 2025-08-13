sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/BusyIndicator",
        "sap/ui/core/Fragment",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    function (
        Controller,
        BusyIndicator,
        Fragment,
        MessageBox,
        Filter,
        FilterOperator
    ) {
        "use strict";
        /*
        const sUriOdataV2 = "/odata/v2/backend";
        const sUriOdataV4 = "/odata/v4/backend";*/

        return Controller.extend(
            "com.sap.testrenameuimodule.controller.BaseController", {
            onInit: function () { },
            backendAction: function (oModel, sPath, sMethod, oUrlParameters, sOperationType) {
                return new Promise(function (resolve, reject) {
                    const fnError = function (e) {
                        let sMessage;
                        try {
                            sMessage = JSON.parse(e.responseText).error.message.value;
                        } catch {
                            sMessage = e.message || "Unknown error";
                        }
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageBox.error(sMessage);
                        reject(e);
                    };
                    if (sOperationType === "function") {
                        oModel.callFunction(sPath, {
                            method: sMethod,
                            urlParameters: oUrlParameters,
                            success: resolve,
                            error: fnError
                        });
                    } else if (sOperationType === "update") {
                        oModel.update(sPath, oUrlParameters, {
                            merge: true,
                            success: resolve,
                            error: fnError
                        });
                    } else if (sOperationType === "create") {
                        oModel.create(sPath, oUrlParameters, {
                            success: resolve,
                            error: fnError
                        });
                    } else if (sOperationType === "remove") {
                        oModel.remove(sPath, {
                            success: resolve,
                            error: fnError
                        });
                    } else {
                        reject(new Error("Unsupported operation type"));
                    }
                });
            },

            oDataRead: function (sURL, sEntitySet, oFilter, urlParameters) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(sURL, true);
                var that = this;
                return new Promise(function (resolve, reject) {
                    oModel.read(sEntitySet, {
                        async: false,
                        urlParameters: urlParameters,
                        filters: [oFilter],
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (e) {

                            // try {
                            //     var sMessage = JSON.parse(e.responseText).error.message.value
                            // } catch (error) {
                            //     sMessage = "Errore generico."
                            // }
                            let sMessage = that._convertError(e);
                            MessageBox.error(sMessage);
                            reject(e);

                            BusyIndicator.hide();
                        },
                    });
                });
            },
            oDataCreate: function (sURL, sEntitySet, oEntry) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(sURL, true);
                var that = this;
                return new Promise(function (resolve, reject) {
                    oModel.create(sEntitySet, oEntry, {
                        success: function (oData, oResponse) {
                            resolve(oResponse);
                        },
                        error: function (e) {

                            // try {
                            //     var sMessage = JSON.parse(e.responseText).error.message.value
                            // } catch (error) {
                            //     sMessage = "Errore generico."
                            // }
                            let sMessage = that._convertError(e);
                            MessageBox.error(sMessage);
                            reject(e);
                            BusyIndicator.hide();
                        },
                    });
                });
            },
            oDataRemove: function (sURL, EntitySet) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(sURL);
                var that = this;
                return new Promise(function (resolve, reject) {
                    oModel.remove(EntitySet, {
                        success: function (oData, oResponse) {
                            resolve(oResponse);
                        },
                        error: function (e) {
                            let sMessage = that._convertError(e);
                            MessageBox.error(sMessage);
                            reject(e);
                            BusyIndicator.hide();
                        },
                    });
                });
            },
            oDataUpdate: function (sURL, EntitySet, oEntry) {
                var oModel = new sap.ui.model.odata.v2.ODataModel(sURL, {
                    defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put,
                });
                var that = this;
                return new Promise(function (resolve, reject) {
                    oModel.update(EntitySet, oEntry, {
                        success: function (data, response) {
                            resolve(response);
                        },
                        error: function (e) {
                            // try {
                            //     var sMessage = JSON.parse(e.responseText).error.message.value
                            // } catch (error) {
                            //     sMessage = "Errore generico."
                            // }
                            let sMessage = that._convertError(e);
                            MessageBox.error(sMessage);
                            reject(e);
                            BusyIndicator.hide();
                        },
                    });
                });
            },
            getFragmentControlById: function (sFragmentId, sSelectListId) {
                var sID = Fragment.createId(sFragmentId, sSelectListId);
                return sap.ui.getCore().byId(sID);
            },
            _convertError(oBackEndError) {
                try {
                    return JSON.parse(oBackEndError.responseText).error.message.value;
                } catch (oError) {
                    try {
                        if (oBackEndError.statusCode == "504") {
                            return "Sessione caduta: riaggiornare la pagina.";
                        } else {
                            return "Errore generico.";
                        }
                    } catch (oError) {
                        return "Errore generico.";
                    };
                };
            },
            download_file: function (fileURL, fileName) {
                // for non-IE
                var save = document.createElement('a');
                save.href = fileURL;
                save.target = '_blank';
                var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
                save.download = fileName || filename;
                if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search('Chrome') < 0) {
                    document.location = save.href;
                    // window event not working here
                } else {
                    var evt = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: false,
                    });
                    save.dispatchEvent(evt);
                    (window.URL || window.webkitURL).revokeObjectURL(save.href);
                }
            },
            onAnnullaDialog: function (oEvent, sIdDialog) {
                if (!sIdDialog) {
                    sIdDialog = oEvent.getSource().data("idDialog");
                }
                this.getView().byId(sIdDialog).close();
                this.getView().byId(sIdDialog).destroy();
            },
            _setBusyPage: function (bBusy) {
                if (bBusy) {
                    BusyIndicator.show(0)
                }
                else
                    BusyIndicator.hide()
            },
            _getFilterWithTokens: function (sPath, aTokens) {
                const orFilters = [];
                if (aTokens.length > 0) {
                    for (var i = 0; i < aTokens.length; i++) {
                        orFilters.push(
                            new Filter({
                                path: sPath,
                                operator: FilterOperator.Contains,
                                value1: aTokens[i].getProperty('key'),
                                caseSensitive: true,
                            })
                        );
                    }
                }
                return orFilters;
            },
            _getRowContext: function (oEvent) {
                return oEvent.getSource().getBindingContext("odataV2");
            }
        }
        );
    }
);
