window.hs = ( typeof window.hs == "undefined" ) ? {} : window.hs;

window.hs.appDataProvider = (function () {
	var storage = window.localStorage;
	var data = storage.getItem("hs_app_catalog");

	var functions = {
		isDataAvailable: function() {
			if ( data ) return 1;
			return 0;
		}
	}

	function appDataProvider() {

	}
	hs.$.each(functions,function(k,v) {
		appDataProvider.prototype[k] = v;
	})

	return appDataProvider;
}());
