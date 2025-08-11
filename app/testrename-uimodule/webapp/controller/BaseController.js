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
            backendAction: function (oModel, sEntitySet, sMethod, oUrlParameters) {
                return new Promise(function (resolve, reject) {
                    oModel.callFunction(sEntitySet, {
                        method: sMethod,
                        urlParameters: oUrlParameters,
                        success: function (res) {
                            resolve(res);
                        },
                        error: function (e) {
                            const sMessage = JSON.parse(e.responseText).error.message.value;
                            BusyIndicator.hide();
                            MessageBox.error(sMessage);
                            reject(e);
                        }.bind(this),
                    });
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
            }
        }
        );
    }
);
