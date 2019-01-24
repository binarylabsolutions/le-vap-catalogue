var appDP = new hs.appDataProvider();


var isDataAvailable = appDP.isDataAvailable();

var my_mvc = new hs.mvc({
	deafultController: (isDataAvailable) ? "allflavours" : "nodata",
	baseView : "#my_mvc",
	options : {
		animateElement : "#innerContent",
		animationStyle : "slideUp",
	}
});

var dd = my_mvc.load.model("capp");
dd

my_mvc.register.modelSet({

	capp :  {
		_entityFlavour :1,
		_entityBrand :0,
		_setup_images : function(elem) {
			var img_feilds = ["background","background_for_brand","background_for_flavour","image","image_for_brand","image_for_flavour","thumbnail"];
			for (var ii = 0; ii < img_feilds.length; ii++) {
				var img_key = img_feilds[ii];
				if ( typeof elem[img_key] != "undefined"  && elem[img_key] && elem[img_key].length ) { 
					uri = elem[img_key];
					elem[ img_key + "_uri" ] = uri;

					elem[img_key] = "data:image/png;base64," + appDP.getImageElement(uri);
				}
					
			}
			return elem;
		},
		_setup_images_on_set: function(dataset){

			var img_feilds = ["background","background_for_brand","background_for_flavour","image","image_for_brand","image_for_flavour","thumbnail"]
			for (var i = 0; i < dataset.length; i++) {
				dataset[i] = this._setup_images(dataset[i]);
			}
			return dataset
		},
		_getEntityList :function(pram) {

			var entity  = appDP.getDataElement("entity");
			returnitems = [];
			for (var key in entity) {
				var condition = ( typeof pram == "undefined" ) ? 1 : ( entity[key].entity_type == pram.toString()); 
				if ( condition ) {
					returnitems.push(entity[key])	
				}
			}
			return this._setup_images_on_set(returnitems)
			
		},
		allFlavours : function() {
			return this._getEntityList( this._entityFlavour )
		},
		allBrands : function() {
			return this._getEntityList( this._entityBrand )
		},
		allconfig: function() {
			return appDP.getConfig();
		},
		configElement: function(pram) {
			return appDP.getConfigElement(pram.name);
		},
		getProduct: function($id) {

			if ( typeof $id == "undefined" ) return null;
			var products = appDP.getDataElement("product");

			if ( !products && typeof products["product_" +  $id ] == "undefined" ) return null;
			
			return this._setup_images( products["product_" +  $id ] );
		},
		getEntity: function($id) {

			if ( typeof $id == "undefined" ) return null;
			var data = appDP.getDataElement("entity");
			if ( !data && typeof data["entity_" + $id] == "undefined" ) return null;
			
			return this._setup_images( data["entity_" + $id] );
		},

		getProductsByEntity: function($id) {
			
			var products_ids = [];
			var relation = appDP.getDataElement("relation");
			for (var i = 0; i < relation.length; i++) {
				if ( relation[i].id.toString() == $id.toString() ) {
					products_ids.push( relation[i].product_id ) 
				}
			}
			var products = [];
			for (var i = 0; i < products_ids.length; i++) {
				var p = this.getProduct( products_ids[i] );
				
				if ( p ) {
					products.push( p );
				}
			}
			
			return products;
			
		}

	},
	

});

my_mvc.register.abstractControllerSet({
	base_contoller : function() {

		data = {};
		if ( appDP.isDataAvailable() ) {
			
		} else {

			my_mvc.callController("nodata");
			return false;

		}
		return data;
	},
})
my_mvc.register.controllerSet({

	allbrands: {
		extends : "base_contoller",
		init : function (data,$prams) {
			
			var capp =  my_mvc.load.model("capp");
			
			data.heading = "All brands";
			data.para = "view all brands";
			data.allbrandsList = capp.allBrands();

			console.log(data.allbrandsList);

			data.content = "allbrands_template";

			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},
	},
	allflavours: {
		extends : "base_contoller",
		init : function (data,$prams) {

			var capp =  my_mvc.load.model("capp");
			
			data.allflavoursList = capp.allFlavours();
			console.log(data.allflavoursList);
			data.heading ="All Flavours";
			data.para ="some para in details";

			data.content = "allflavours_template";

			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	brand: {
		extends : "base_contoller",
		init : function (data,$prams) {
			
			var capp =  my_mvc.load.model("capp");
			var entity = capp.getEntity($prams.id);

			data.name = entity.name;
			data.productList = capp.getProductsByEntity($prams.id);
			
			data.content = "brand_template";

			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	flavour: {
		extends : "base_contoller",
		init : function (data,$prams) {
			console.log("$prams",$prams)
			
			var capp =  my_mvc.load.model("capp");
			var entity = capp.getEntity($prams.id);

			data.name = entity.name
			data.productList = capp.getProductsByEntity($prams.id);
			

			data.content = "flavour_template";
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	product: {
		extends : "base_contoller",
		init : function (data,$prams) {
			
			var capp =  my_mvc.load.model("capp");
			var product = capp.getProduct($prams.id);
			

			data.name  = product.name;
			data.description  = product.description;
			data.image  = product.image;


			data.content = "product_template"
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	nodata: {
		init : function (data,$prams) {
			data.content = "nodata_template"
			my_mvc.load.view( "baseview" , data);
		},
		
		after_render: function() {

			$(".re-index-element").click(function() {

				$(".msg-holder").append("<p>downloading Data... Please wait.</p>");
				appDP.downloadData(function() {
					$(".msg-holder").append("<p>download complete.</p>");
					$(".msg-holder").append("<p>opening application</p>");
					setTimeout(function(){
						my_mvc.callController("allflavours")
					},2000)
				});

			})
			
			
		},

	},
	settings: {
		extends : "base_contoller",
		init : function (data,$prams) {

			var capp = my_mvc.load.model("capp");

			var last_update = capp.configElement({name : "last_update"})
			data.reindex = last_update;
			data.content = "settings_template";

			var subview = ( typeof $prams.subview == "undefined" ) ? "general" : $prams.subview 
			data.subview = "settings_" + subview + "_template";
			
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function(data,$prams) {
			if ( $prams.subview == "reindex") {
				$(".re-index-element").click(function() {
					appDP.downloadData(function() {

					});
				})
			}
			
		},
	}
});


$(document).ready(function(){
	my_mvc.init();	
})
