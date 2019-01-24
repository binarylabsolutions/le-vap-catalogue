window.hs = ( typeof window.hs == "undefined" ) ? {} : window.hs;

window.hs.appDataProvider = (function () {

	var storage = window.localStorage;
	
	var id_feilds = {
		entity  : "id",
		product  : "product_id",
	}
	var __p = {

		_setData: function(data,dataSet){
			storage.setItem(dataSet, JSON.stringify(data) );
		},
		_setElement: function(key,val,dataSet) {
			var d = __p._getData(dataSet);
			d = ( d ) ? d : {};
			d[key] = val;
			__p._setData(d,dataSet);
		},
		_getData: function(dataset) {
			var data = storage.getItem(dataset);
			
			return  ( data ) ?  JSON.parse(data) : null;
		},
		_getElement: function(key,dataset) {
			if ( typeof key == "undefined") return null;

			var data = storage.getItem(dataset);
			
			if ( typeof data == "undefined") return null;

			data = JSON.parse(data);
			
			if ( typeof data[key] == "undefined") return null;
			
			return  data[key];
		},
		
		// set complate data
		setData : function(__data) {
			__p._setData(__data,"hs_app_catalog");
		},
		setDataElement : function(key,val) {
			__p._setElement(key,val,"hs_app_catalog")
		},
		// set complate cinfig
		setConfig : function(__data) {
			__p._setData(__data,"hs_app_catalog_config");
		},
		setConfigElement : function(key,val) {
			__p._setElement(key,val,"hs_app_catalog_config")
		},
		
		setImage : function(__data) {
			__p._setData(__data,"hs_app_catalog_image");
		}
	};

	var functions = {

		getData : function() {

			return  __p._getData("hs_app_catalog")
		},
		getImage : function() {
			return  __p._getData("hs_app_catalog_image")
		},
		getImageElement : function(key) {
			return  __p._getElement(key , "hs_app_catalog_image")
		},
		getDataElement : function(key) {
			return __p._getElement(key , "hs_app_catalog")
		},
		getConfig : function() {
			return  __p._getData("hs_app_catalog_config")
		},
		getConfigElement : function(key) {
			return __p._getElement(key , "hs_app_catalog_config");
		},
		isDataAvailable: function() {
			
			__data = functions.getData();
			if ( __data && Object.keys(__data).length ) return 1;
			return 0;
		},
		downloadData: function(callback) {
			
			postobj = {};
			var __data = functions.getData();
			if ( functions.isDataAvailable() ) {
				// sending post details
				$.each(__data,function(k,dd){
					if ( typeof id_feilds[k] != "undefined") {
						var id_feild = id_feilds[k];
						postobj[k] = [];
						$.each(dd,function(kk,elem){
							obj = {revision_id: elem.revision_id};
							obj[id_feild] =  elem[id_feild];
							postobj[k].push(obj)
						});

					}
					
				})
				
				
			}
			$.ajax({
				method: "post",
				url : "https://inventory.le-vap.com/index.php/open_api/capp/get_capp_data",
				data : postobj,
			}).done(function(d){
				
				__data = ( __data ) ? __data : {};
				
				d = JSON.parse(d);

				$.each(d,function(table,list) {

					__data[table] = ( typeof __data[table] == "undefined" ) ? {}: __data[table];
					

					if ( typeof id_feilds[table]  != "undefined") {
						id_feild = id_feilds[table];

						$.each(list, function(k,elem){

							__data[table][ table + "_" + elem[id_feild] ] = elem;
						})

					} else {
						__data[table] = list;
					}
				});

				var img_feilds = ["background","background_for_brand","background_for_flavour","image","image_for_brand","image_for_flavour","thumbnail"]
				var $imgKeys = [];
				var $imgsToDownload = {};
				$.each(d,function(some,ls) {
					$.each(ls,function(kk,elem) {
						$.each(img_feilds, function(ind,img_key){
							if ( typeof elem[img_key] != "undefined"  && elem[img_key] && elem[img_key].length ) {
								$imgsToDownload[ elem[img_key] ] = "";
								$imgKeys.push(elem[img_key])
							}
						})
						
					})
				});

				var img_index = 0;
				final_callback = function() {
					console.log("final_callback")
					console.log ( $imgsToDownload );
					__p.setImage($imgsToDownload);

					callback(d);
					
				}
				imgDwonloader = function() {
					
					
					var img_url = $imgKeys[img_index];
					if ( typeof img_url == "undefined" ) {final_callback(); return;}
					
					

					postobj = {url : img_url }
					$.ajax({
						method: "post",
						url : "https://inventory.le-vap.com/index.php/open_api/capp/get_capp_image_base_64",
						data : postobj,
					}).done(function(d) {

						
						if ( d.length ) {
							$imgsToDownload[img_url] = d;
						}
						img_index++;
						
						imgDwonloader();
					})
				}
				imgDwonloader();

				__p.setData(__data);
				__data = functions.getData();
				var current_time = new Date()
				__p.setConfigElement("last_update", window.hs.utilities.date.getDateString(current_time.getTime()) )
				

			});
		}
	}

	function appDataProvider() {

	}
	hs.$.each(functions,function(k,v) {
		appDataProvider.prototype[k] = v;
	})

	return appDataProvider;
}());
