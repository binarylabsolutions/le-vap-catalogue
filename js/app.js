var my_mvc = new hs.mvc({
		deafultController: "allflavours",
		baseView : "#my_mvc",
	});

	my_mvc.register.modelSet({
		allflavours : function() {
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
			init : function ($data,$prams) {

				data.some_elem = my_mvc.load.model();
				data.content = "product_template"
				my_mvc.load.view( "baseview" , data);
			},
			after_render: function() {

			},

		},
		settings: {
			extends : "base_contoller",
			init : function ($data,$prams) {

				data.some_elem = my_mvc.load.model();
				data.content = "settings_template";

				var subview = ( typeof $prams.subview == "undefined" ) ? "general" : $prams.subview 
				data.subview = "settings_" + subview + "_template";
				
				my_mvc.load.view( "baseview" , data);
			},
			after_render: function() {

			},
		}
	});


	$(document).ready(function(){
		my_mvc.init();	
	})
	