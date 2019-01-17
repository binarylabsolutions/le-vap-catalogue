window.hs = ( typeof window.hs == "undefined" ) ? {} : window.hs;

window.hs.appDataProvider = (function () {
	var storage = window.localStorage;
	var data = storage.getItem("hs_app_catalog");

	var functions = {
		isDataAvailable: function() {
			if ( data ) return 1;
			return 0;
		},
		downloadData: function() {
			var fileTransfer = new FileTransfer();

			fileTransfer.download(
			    "https://inventory.le-vap.com/images/image/entity_product/decoded_Big-Foot_2048x-55.png",
			    "imgs",
			    function(entry) {
			        alert("download complete: " + entry.fullPath);
			    },
			    function(error) {
			        console.log("download error source " + error.source);
			        console.log("download error target " + error.target);
			        console.log("upload error code" + error.code);
			    }
			);
		}
	}

	function appDataProvider() {

	}
	hs.$.each(functions,function(k,v) {
		appDataProvider.prototype[k] = v;
	})

	return appDataProvider;
}());
