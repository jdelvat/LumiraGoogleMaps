/*<<dependency*/
define("com_costinggeek_googlemaps-src/js/render", ["com_costinggeek_googlemaps-src/js/utils/util"], function(util){
/*dependency>>*/ 
    /**
     * This function is a drawing function; you should put all your drawing logic in it.
     * it's called in moduleFunc.prototype.render
     * @param {Object} data - data set passed in
     * @param {Object} container - target DOM element (SVG or DIV) of the plot area to render in
     * @param {float} width - width of canvas
     * @param {float} height - height of canvas
     * @param {Array of color string} colorPalette - color palette
     * @param {Object} properties - properties of chart
     * @param {Object} dispatch - event dispatcher
     */
    var render = function(data, container, width, height, colorPalette, properties, dispatch) {
		
        require.config({
	        paths: {
				'com_costinggeek_googlemaps-async': 'sap/bi/bundles/com/costinggeek/googlemaps/com_costinggeek_googlemaps-src/js/async'
	        }
        });

        // add DIV but make sure it's done only once
        var mapsContainer = container.select('div');
        if (!mapsContainer.node()) {
        	mapsContainer = container.append('div').attr('width', '100%').attr('height', '100%').attr('class', 'com_costinggeek_googlemaps-cg_map');
        }

        // create asynchronous call to google maps api
        require(['com_costinggeek_googlemaps-async!https://maps.googleapis.com/maps/api/js?v=3.exp&language=en&sensor=false'], function ( ) {
	        // call google maps API after everything is loaded
	        load_gmap();
        });

		// MDL: Get the name of the dimension columns from dimension group: Latitude / Longitude / Desc
		var dimArr_latLongDesc = data.meta.dimensions('Latitude / Longitude / Desc');
		var dim_lattitude   = dimArr_latLongDesc[0];
		var dim_longitude   = dimArr_latLongDesc[1];
		var dim_description = dimArr_latLongDesc[2];
		// MDL: end

		// MDL: Get the name of the measure column from the measure group: Quantity
		var msrArr_Qty = data.meta.measures('Quantity');	
		var msr_Quantity = msrArr_Qty[0];
		// MDL: end

        // set global variable accessible by all sub-functions
        var my_map;
        var my_LatLng;
        var my_LatLngBounds;

        // function to show popup when markers are clicked	
        function attach_details( my_marker, my_description, my_quantity ) {

	        var infowindow = new google.maps.InfoWindow(
	        { 
		        content: '<div class="com_costinggeek_googlemaps-infoWindow"><b>' + my_description + ':</b> ' + my_quantity + '</div>'
	        });

        	google.maps.event.addListener( my_marker, 'click', function() {
        		infowindow.open( my_map, my_marker );
	        });

        }

        // function to place a marker on the map
        function add_marker_lat_long( my_description, my_lat, my_long, my_quantity ) {

        	my_LatLng = new google.maps.LatLng( my_lat, my_long );
        	my_LatLngBounds.extend( my_LatLng );

	        var my_marker = new google.maps.Marker({
		        map:      	my_map,
		        position: 	my_LatLng,
//        		icon:       icon_shop,
		        title:		my_description,
		        status: 	'active'
	        });

	        attach_details( my_marker, my_description, my_quantity );
        }

        // initialize the google map
        function load_gmap( ) {

	        my_LatLngBounds = new google.maps.LatLngBounds();

	        var my_center = new google.maps.LatLng( 49.2933, 8.6419 );

	        var mapOptions = { 
		        mapTypeId: google.maps.MapTypeId.ROADMAP,
		        center:    my_center,
		        zoom:		10
		        };

	        my_map = new google.maps.Map(mapsContainer.node(),
		        mapOptions);

	        // convert all data to markers
	        var j = 0;
	        for ( var i = 0; i < data.length; i++ )
	        {
				// MDL: Updated to use column names from data set.
				if( data[i][dim_lattitude] != undefined && data[i][dim_longitude] != undefined )
				// MDL: end
		        {
			        // MDL: Updated to use column names from data set.
					add_marker_lat_long( data[i][dim_description], data[i][dim_lattitude],  data[i][dim_longitude], data[i][msr_Quantity] );
					// MDL: end
			        j++;
		        }
	        }

        	// Auto center the map based on given markers
	        if( j > 0 )
	        {
		        my_map.fitBounds(    my_LatLngBounds );
		        my_map.panToBounds( my_LatLngBounds );
	        }
        }

    };

    return render; 
});