var appDP = new hs.appDataProvider();

var my_mvc = new hs.mvc({
	deafultController: (appDP.isDataAvailable()) ?"allflavours" : "nodata",
	baseView : "#my_mvc",
	options : {
		animateElement : "#innerContent",
		animationStyle : "slideUp",
	}
});

my_mvc.register.modelSet({

	allflavours : function() {
		var storage = window.localStorage;
		res = storage.getItem("allflavours");
		if ( res == null ) {

		}
		return [
			{name : "Flavour a", key:"flav1",flavourid: 21,productSet: [1,2,3,4,5,6], background: "",logo: "imgs/icon.jpg",},
			{name : "Flavour b", key:"flav2",flavourid: 22,productSet: [1,2,3,4,5,6], background: "",logo: "imgs/icon.jpg",},
			{name : "Flavour c", key:"flav3",flavourid: 23,productSet: [1,2,3,4,5,6], background: "",logo: "imgs/icon.jpg",},
			{name : "Flavour j", key:"flav4",flavourid: 24,productSet: [1,2,3,4,5,6], background: "",logo: "imgs/icon.jpg",},
			{name : "Flavour i", key:"flav5",flavourid: 25,productSet: [1,2,3,4,5,6], background: "",logo: "imgs/icon.jpg",},
		]
		
	},
	config: function() {

	}
});

my_mvc.register.abstractControllerSet({
	base_contoller : function() {

		data = {};
		
		if ( appDP.isDataAvailable() ) {

			console.log("data");

		} else {

			my_mvc.callController("nodata");
			console.log("no data");

		}
		return data;
	},
})
my_mvc.register.controllerSet({

	allbrands: {
		extends : "base_contoller",
		init : function (data,$prams) {

			data.some_elem = my_mvc.load.model();
			data.content = "allbrands_template"
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	allflavours: {
		extends : "base_contoller",
		init : function (data,$prams) {

			data.allflavours = my_mvc.load.model("allflavours");
			data.heading ="some heading";
			data.para ="some para in details";

			data.content = "allflavours_template"
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	brand: {
		extends : "base_contoller",
		init : function (data,$prams) {

			data.some_elem = my_mvc.load.model();
			data.content = "brand_template"

			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	flavour: {
		extends : "base_contoller",
		init : function (data,$prams) {

			data.some_elem = my_mvc.load.model();
			data.content = "flavour_template"
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	product: {
		extends : "base_contoller",
		init : function (data,$prams) {

			data.some_elem = my_mvc.load.model();
			data.content = "product_template"
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {

		},

	},
	nodata: {
		extends : "base_contoller",
		init : function (data,$prams) {
			data.content = "nodata_template"
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function() {
			
			$(".re-index-element").click(function() {
				window.hs.appDataProvider.downloadData();
				// download all brands
				
				// download all flavours

				// download all products 
				
				// download all images

			})
			
			
		},

	},
	settings: {
		extends : "base_contoller",
		init : function (data,$prams) {

			data.some_elem = my_mvc.load.model();
			data.content = "settings_template";

			var subview = ( typeof $prams.subview == "undefined" ) ? "general" : $prams.subview 
			data.subview = "settings_" + subview + "_template";
			
			my_mvc.load.view( "baseview" , data);
		},
		after_render: function(data,$prams) {
			if ( $prams.subview == "reindex") {
				console.log ( $(".re-index-element") );
				$(".re-index-element").click(function() {

				})
			}
			
		},
	}
});


$(document).ready(function(){
	my_mvc.init();	
})
