//@ui5-bundle com/sap/nodedemouimodule/Component-preload.js
sap.ui.require.preload({
	"com/sap/nodedemouimodule/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","com/sap/nodedemouimodule/model/models"],(e,t)=>{"use strict";return e.extend("com.sap.nodedemouimodule.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init(){e.prototype.init.apply(this,arguments);this.setModel(t.createDeviceModel(),"device");this.getRouter().initialize()}})});
},
	"com/sap/nodedemouimodule/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("com.sap.nodedemouimodule.controller.App",{onInit(){}})});
},
	"com/sap/nodedemouimodule/controller/View1.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("com.sap.nodedemouimodule.controller.View1",{onInit(){}})});
},
	"com/sap/nodedemouimodule/i18n/i18n.properties":'# This is the resource bundle for com.sap.nodedemouimodule\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=App UI\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n#XTIT: Main view title\ntitle=App UI',
	"com/sap/nodedemouimodule/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"com.sap.nodedemouimodule","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.17.3","toolsId":"122b6230-fb0e-453d-8aa6-f15e4e70ae1e"},"dataSources":{"odataV4":{"uri":"odata/v4/catalogo-servizio/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}},"odataV2":{"uri":"odata/v2/catalogo-servizio/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.134.1","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.sap.nodedemouimodule.i18n.i18n"}},"odataV4":{"dataSource":"odataV4","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"odataV2":{"dataSource":"odataV2","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","controlAggregation":"pages","controlId":"app","transition":"slide","type":"View","viewType":"XML","path":"com.sap.nodedemouimodule.view","async":true,"viewPath":"com.sap.nodedemouimodule.view"},"routes":[{"name":"RouteView1","pattern":":?query:","target":["TargetView1"]}],"targets":{"TargetView1":{"id":"View1","name":"View1"}}},"rootView":{"viewName":"com.sap.nodedemouimodule.view.App","type":"XML","id":"App","async":true}}}',
	"com/sap/nodedemouimodule/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"com/sap/nodedemouimodule/view/App.view.xml":'<mvc:View controllerName="com.sap.nodedemouimodule.controller.App"\n    displayBlock="true"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><App id="app"></App></mvc:View>',
	"com/sap/nodedemouimodule/view/View1.view.xml":'<mvc:View controllerName="com.sap.nodedemouimodule.controller.View1"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><Page id="page" title="{i18n>title}"></Page></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
