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
		//prepare canvas with width and height of container
		container.selectAll('svg').remove();

        require.config({
	        paths: {
				'async': 'sap/bi/bundles/com/costinggeek/googlemaps/com_costinggeek_googlemaps-src/js/async'
	        }
        });

        // add DIV but make sure it's done only once
        if( $('body').children('#cg_map').length < 1 ) {

	        content  = '<div id="cg_map" width="100%" height="100%"></div>';

        	var elems = document.getElementsByTagName('*');
	        for( i in elems )
	        {
		        if((' ' + elems[i].className + ' ').indexOf(' ' + 'v-m-root' + ' ') > -1) {
			        elems[i].innerHTML = content;
		        }
	        }
        }

        // create asynchronous call to google maps api
        require(['async!https://maps.googleapis.com/maps/api/js?v=3.exp&language=en&sensor=false'], function ( ) {
	        // call google maps API after everything is loaded
	        load_gmap();
        });

        // set global variable accessible by all sub-functions
        var my_map;
        var my_LatLng;
        var my_LatLngBounds;

        // function to show popup when markers are clicked	
        function attach_details( my_marker, my_description, my_quantity ) {

	        var infowindow = new google.maps.InfoWindow(
	        { 
		        content: '<div id="infoWindow"><b>' + my_description + ':</b> ' + my_quantity + '</div>'
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

	        my_map = new google.maps.Map(document.getElementById('cg_map'),
		        mapOptions);

	        // convert all data to markers
	        var j = 0;
	        for ( var i = 0; i < data.length; i++ )
	        {
		        if( data[i].Latitude != undefined &&  data[i].Longitude != undefined )
		        {
			        add_marker_lat_long( data[i].Description, data[i].Latitude,  data[i].Longitude, data[i].Quantity );
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