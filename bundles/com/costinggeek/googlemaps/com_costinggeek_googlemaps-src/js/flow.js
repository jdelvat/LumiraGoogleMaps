/*<<dependency*/
define("com_costinggeek_googlemaps-src/js/flow", [ "com_costinggeek_googlemaps-src/js/module" ], function(moduleFunc) {
/*dependency>>*/
    var flowRegisterFunc = function(){
		var flow = sap.viz.extapi.Flow.createFlow({
			id : 'com.costinggeek.googlemaps',
			name : 'Google Maps',
			dataModel : 'sap.viz.api.data.CrosstableDataset',
			type : 'DIV'
		});
		var element  = sap.viz.extapi.Flow.createElement({
			id : 'com.costinggeek.googlemapsmodule',
			name : 'Google Maps Module',
		});
		element.implement('sap.viz.elements.common.BaseGraphic', moduleFunc);
		/*Feeds Definition*/
		//ds1: Latitude, Longitude, Description
		var ds1 = {
		    "id": "com.costinggeek.googlemapsmodule.DS1",
		    "name": "Latitude / Longitude / Desc",
		    "type": "Dimension",
		    "min": 1,
		    "max": 2,
		    "aaIndex": 1,
		    "minStackedDims": 1,
		    "maxStackedDims": Infinity
		};
		//ms1: Quantity
		var ms1 = {
		    "id": "com.costinggeek.googlemapsmodule.MS1",
		    "name": "Quantity",
		    "type": "Measure",
		    "min": 1,
		    "max": Infinity,
		    "mgIndex": 1
		};
		element.addFeed(ds1);
		element.addFeed(ms1);
		flow.addElement({
			'element':element,
			'propertyCategory' : 'Google Maps Module'
		});
		sap.viz.extapi.Flow.registerFlow(flow);
    };
    flowRegisterFunc.id = 'com.costinggeek.googlemaps';
    return {
        id : flowRegisterFunc.id,
        init : flowRegisterFunc
    };
});