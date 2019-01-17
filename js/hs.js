window.hs = (typeof window.hs == "undefined" ) ? {} : window.hs;

window.hs.log = (!(typeof window.hs.log == "undefined" )) ? window.hs.log : {

	logging_enable : null,
	error_enable : null,
	warning_enable : null,

	initilize : function($msg) {

		if ( typeof localStorage == "undefined") {

			window.hs.log.logging_enable 	= 1;
			window.hs.log.error_enable 		= 1;
			window.hs.log.warning_enable 	= 1;

		} else {

			var i = localStorage.getItem("hs_logging");
			var e = localStorage.getItem("error_enable");
			var w = localStorage.getItem("warning_enable");

			window.hs.log.logging_enable 	= ( !i ) ? 0 : i;
			window.hs.log.error_enable 		= ( !e ) ? 1 : e;
			window.hs.log.warning_enable 	= ( !w ) ? 0 : w;
			
			if ( !l ) localStorage.setItem("hs_logging", window.hs.log.logging_enable );
			if ( !e ) localStorage.setItem("hs_logging", window.hs.log.error_enable   );
			if ( !w ) localStorage.setItem("hs_logging", window.hs.log.warning_enable );
		}
		
	},
	i: function($msg) {
		var x = window.hs.log.logging_enable;
		if ( typeof x == "null") window.hs.log.initilize();
		if ( x ) {
			console.log($msg)
		}
	},
	e: function($msg) {
		var x = window.hs.log.error_enable;
		if ( typeof x == "null") window.hs.log.initilize();
		if ( x ) {
			console.error($msg)
		}
	},
	w: function($msg) {
		var x = window.hs.log.warning_enable;
		if ( typeof x == "null") window.hs.log.initilize();
		if ( x ) {
			console.warn($msg)
		}
	},
} ;

window.hs.templateEngin = {

		identifiers : {
			dataTag : /\{\!\{[a-zA-Z_.]+\}\}/gm,
			tag : /\{\!\{[a-zA-Z_]+((\ +[a-zA-Z_]+=[^ '"]+)|(\ +[a-zA-Z_]+='[^']*')|(\ +[a-zA-Z_]+="[^"]*")|(\ +[a-zA-Z_]+))*\ *\}\}/gm,
			all_elem : /\{\!\{[a-zA-Z_]+((\ +[a-zA-Z_]+=[^ '"]+)|(\ +[a-zA-Z_]+='[^']*')|(\ +[a-zA-Z_]+="[^"]*")|(\ +[a-zA-Z_]+))*\ *\}\}/gm,
		},
		exect_match : {
			dataTag : /^\{\!\{[a-zA-Z_.]+\}\}$/gm,
			tag : /^\{\!\{[a-zA-Z_]+((\ +[a-zA-Z_]+=[^ '"]+)|(\ +[a-zA-Z_]+='[^']*')|(\ +[a-zA-Z_]+="[^"]*")|(\ +[a-zA-Z_]+))*\ *\}\}$/gm,
		},
		functionSet : {
			mvc_loop : function(attr,$data) {
				
				var $html = "";
				if ( typeof attr.data != "undefined" && typeof $data[attr.data] != "undefined" ) {
					
					$.each($data[attr.data], function(k,dd) {
						var $obj = hs.templateEngin.getTemplateObject(attr.template);
						$obj = hs.templateEngin.parse($obj,dd);
						$html += hs.templateEngin.getHtmlStr($obj)
					});
				}
				
				return $html;
			},
			mvc_load: function(attr,$data) {
				

				var passData =  ( typeof attr.data != "undefined" && typeof $data[attr.data] != "undefined" ) ? $data[attr.data] : $data

				var $obj = hs.templateEngin.getTemplateObject(attr.template);
				
				var $obj2 = hs.templateEngin.parse($obj,passData);

				
				return hs.templateEngin.getHtmlStr($obj2)
			}
		},
		
		getTemplateObject : function($n) {
			$str = $("#" + $n).html();
			if (!( /<[a-z][\s\S]*>/i.test( $str ) )) {
				$str = '<div>' + $str + '</div>';
			} 
			return $($str);

		},
		getHtmlStr : function($n) {
			
			return $('<div>').append($n.clone()).html();

		},
		parser : {
			// recognize the object as dataTag, tag, html attrbute
			recognizeObject: function(str) {
				for (var key in  hs.templateEngin.exect_match) {
				    if ( hs.templateEngin.exect_match.hasOwnProperty(key)) {

				    	hs.templateEngin.exect_match[key].lastIndex = 0;
				    	var result = hs.templateEngin.exect_match[key].test(str) ;
				    	
				    	if ( result ) {
				    		
				    		return key;
				    	}
				    }
				}
				
			},
			// get string with dataTags and evaluate them
			parseString: function($exp_str , $dataSet, $preval) {

				$preval = (typeof $preval == "undefined") ? "" : $preval;
				$.each( $dataSet , function(k,v) {
					
					if ( typeof v == "object") {
						$exp_str = hs.templateEngin.parser.parseString($exp_str , v ,$preval + k + "." )
					} else {
						$reg = new RegExp('{!{'+ $preval + k+'}}', 'gm');
						$exp_str = $exp_str.replace( $reg , v);	
					}
					
				})
				return $exp_str;
			},
			// parse one dataTags
			dataTag: function(exp_str,data) {
				v = exp_str.substr(3);
				v = v.substr(0,v.length-2);
				if ( v.split(".").length > 1 ) {
					ss = v.split(".");
					tempObj = data;
					for (var i = 0; i < ss.length; i++) {
						
						if (  typeof tempObj[ ss[i] ] != "undefined" ) {
							tempObj = tempObj[ ss[i] ]
						} else {
							return exp_str;
						}
					}
					exp_str = exp_str.replace( hs.templateEngin.identifiers.dataTag , tempObj );
				
				} else {

					if ( typeof data[v] != "undefined" && typeof data[v] != "object" ) {

						exp_str = exp_str.replace( hs.templateEngin.identifiers.dataTag , data[v]);		
					}
				}
				
				return exp_str;
				
			},
			_parseTagAttribute: function(str,data) {
				spacer = /\ *\=\ */gm;
				str = str.replace(spacer, "=");
				set = str.split(" ");
				attrSet = {};
				for (var i = 0; i < set.length; i++) {
					attr = set[i];
					if ( attr.length == 0) continue;
					if ( attr.indexOf("=") == -1 ) {
						attrSet[attr] = 1;
					} else {
						attr = attr.split("=");

						key = attr[0];
						value =  attr[1];

						if ( ['"',"'"].indexOf( value[0] ) != -1 ) {
							value = value.substr(1);
						}
						if ( ['"',"'"].indexOf( value[value.length-1] ) != -1 ) {
							value = value.substr(0,value.length-1);
						}

						
						attrSet[key] = hs.templateEngin.parser.parseString(value,data ) ;
					}
				}
				return attrSet;
			
			},
			tag: function(exp_str,data) {

				var raw_str =  exp_str.substr(3);
				raw_str = raw_str.substr(0,raw_str.length-2);
				raw_str = raw_str.trim();

				var actionName = raw_str.split(" ")[0];
				actionName = actionName.toLowerCase();

				
				if ( actionName.substr(0,3) != "mvc" ) return "";


				raw_str = raw_str.replace(actionName, "");
				attributes = hs.templateEngin.parser._parseTagAttribute(raw_str,data)
				
				var $return_str = "";

				if ( typeof hs.templateEngin.functionSet[actionName] != "undefined") {
					$return_str = hs.templateEngin.functionSet[actionName](attributes,data );
					
				}
				return $return_str;
			},

		},
		/*
			understant the element
			if its data 
		*/
		parse: function(obj , data) {

			var $str = hs.templateEngin.getHtmlStr(obj);
			
			counter = 0;
			
			$condition = 1;

			while( $condition ) {

				hs.templateEngin.identifiers.all_elem.lastIndex = 0;
				var resultSet = hs.templateEngin.identifiers.all_elem.exec($str);

				if ( !resultSet ) {
					$condition = 0;
					continue;
				}
				
				var rr = resultSet;

				var result = rr[0].trim();
				
				var text = "";

				recognizeObject = hs.templateEngin.parser.recognizeObject(result);

				switch (recognizeObject) {
					case "tag":
						text = hs.templateEngin.parser.tag(result,data);
						
					break;
					case "dataTag":
						text = hs.templateEngin.parser.dataTag(result,data);
						
					break;
				}
				
				var startindex = rr.index
				var endIndex = rr.index + rr[0].length;
				
				$str = $str.substr(0,startindex) + text + $str.substr(endIndex)
				

				counter++;
				if ( counter > 100) break;
				
				
			}
			return $($str);
		}
		
}

hs.mvc = (function(){

	var initial_error_status = 0;
	var error = [];
	$dependencies = ["jQuery"];
	for (var i = 0; i < $dependencies.length; i++) {
		d= $dependencies[i]
		if ( typeof window[d] == "undefined" ) {
			initial_error_status = 1;
			error[error.length] = d + " is required ! ";
		}
	}
	
	if (initial_error_status) {
		function error_construct ($d) {
			hs.log.e({"error" :error});
			return {};
		};
		return error_construct
	}
	
	window.hs.$  = (typeof window.hs.$ == "undefined" ) ? window.jQuery : window.hs.$;

	var private_data = {
		_data :{},
		settings : {},
		models_data : {},
		current_controller : {name : "",prams: []}
	}
	var abstractControllers = {};
	var controllers = {};

	var models = {};
	var data_providers = {};

	
	
	/* private functions */
	function _callController($controller, $is_abstract = 0, $prams) {

		controllerSet =  ( $is_abstract == 0 ) ? controllers : abstractControllers;

		if ( $is_abstract == 0 ) {

			if ( private_data.current_controller.name.length == 0 ) {
				private_data.current_controller = {
					name : $controller,
					prams : $prams,
				};
			} else {
				var contollername = private_data.current_controller.name;
				console.log($prams)
				if ( contollername == private_data.current_controller.name ) {
					console.log("calling same controller")
					return;
				}
			}

			
		}
		if ( typeof controllerSet[$controller] == "undefined" ) { 
			return {}
		} else {
			var _c = controllerSet[$controller];

			var returnelem;
			// if its a direct function or object
			if ( typeof _c.call != "undefined" ) {
				returnelem =  _c.call()
				
			} else {

				
				data = ( _c.extends ) ? _callController( _c.extends, 1 )  : {};
				returnelem =  _c.init( data, $prams );
				
				if ( _c.after_render && typeof _c.after_render != "undefined" ) {
					_c.after_render(data, $prams);
				}
			}

			return returnelem;
		}
	}
	function callAbstractContoller( $name  ) {
		return _callController($name , 1)
	}
	function callController ($name , $prams ) {

		return _callController($name , 0, $prams)
	};
	

	/* public function */
	var functions = {

		register : {
			contorller : function($c , $d , type = 1) {

				var con = (type) ? controllers : abstractControllers

				// check if contoller exist;
				if ( typeof con[ $c ] != "undefined" ) {

					hs.log.i("contoller already exist !");
				
				} else {

					con[ $c ] = {
						extends 		: null,
						init 			: null,
						after_render 	: null,
					}
					
					if ( typeof $d.call == "function" ) {

						con[ $c ].init = $d;

					} else {

						if (!( typeof $d.extends == "undefined" ||  $d.extends.length == 0 )) {
							
							if ( typeof abstractControllers[$d.extends]  == "undefined" ) {
								hs.log.i("undefined abstractControllers exist!");
							} else {
								con[ $c ].extends 	= $d.extends
							}
						}

						if ( typeof $d.init == "undefined" ||  typeof $d.init.call == "undefined" ) {
							
							hs.log.e("exit ! no controller init " );
							delete con[ $c ];
							return 0;

						} else {
							con[ $c ].init 	= $d.init
							
						}
						
						if (!( typeof $d.after_render == "undefined" ||  typeof $d.after_render.call == "undefined" )) {
							
							con[ $c ].after_render 	= $d.after_render
							
						}
					}
					
					
				}
			},
			controllerSet : function($set) {
				ths = this

				hs.$.each($set,function($k ,$v ) {
					ths.contorller($k ,$v)
				})
			},
			abstractControllerSet : function($set) {
				ths = this

				hs.$.each($set,function($k ,$v ) {
					ths.contorller($k ,$v , 0)
				})
			},
			abstractController : function($c , $d) {
				this.contorller($c , $d, 0);

			},
			model : function($c , $d) {
				// check if contoller exist;
				if ( typeof models[ $c ] != "undefined" ) {
					console.log("contoller already exist ! updating contoller");
				} else {
					models[ $c ] = $d
				}
			},
			modelSet : function($set) {
				ths = this
				hs.$.each($set,function($k ,$v ) {
					ths.model($k ,$v)
				})
			},

		},
		load : {
			model : function($name = null,$alies = null) {
				if ( !( $name &&  $name.length) ) return null
				if ( typeof models[$name] == "undefined" ) return null;
				return models[$name].call();
			},
			view: function(elem, data ) {
				
				_e = $(private_data._data.baseView)
				
				obj = $( $("#"+elem).html() );

				obj = hs.templateEngin.parse(obj,data);
				
				
				
				obj = $('<div>').append(obj);
				$str = obj.html();
				//$str = hs.templateEngin.parser.parseString($str ,data  );

				_e.html($str)
				
			}
		},

		setDeafultController : function($controller) {
			if ( $controller && $controller.length ) {
				private_data._data.deafultController = $controller;	
			}
			
		},
		setBaseView : function(baseview) {
			if ( baseview && baseview.length ) {
				private_data._data.baseView = baseview;	
			}
			
		},
		setOptions: function(opt) {
			ths =this;
			defaults =  {
				animationStyle : "slidesleft",
				animateElement : ths.getBaseView(),
			}
			for (var key in defaults) {
			    if (defaults.hasOwnProperty(key)) {
			       	opt[key] = (typeof opt[key] == "undefined")  ? defaults[key] : opt[key];
			    }
			}
			private_data._data.opt = opt;	
		},
		getOptions: function() {
			return private_data._data.opt
		},
		getBaseView: function() {
			
			return private_data._data.baseView;
		},
		getDeafultController : function() {
			return private_data._data.deafultController;
		},
		init : function () {
			callController( private_data._data.deafultController  );
		},
		callController : function($name , $prams = []) {
			callController ($name , $prams );
		},
		/* remove later */
		getEverything : function() {
			console.log("private_data",private_data);
			console.log("abstractControllers",abstractControllers);
			console.log("controllers",controllers);
			console.log("models",models);
			console.log("data_providers",data_providers);
		}
	}

	// constructor function
	function mvc($data) {
		
		functions.setDeafultController( $data.deafultController );
		functions.setBaseView( $data.baseView );
		functions.setOptions($data.options);


		$(document).on("click" , "[data-mvc_controller]", function () {
			var options = functions.getOptions();
			// running controller function
			$controller = $(this).attr("data-mvc_controller");

			if ( typeof controllers[$controller] == "undefined" ) {
				console.log("no controller exist");
				return 0;
			}

			
			//animateElement
			// get parameters
			$prams = {
				attrs : {},
			};
			for(i = 0; i< this.attributes.length; i++) {
				attr = this.attributes[i];
				name = attr.name;
				if ( name.indexOf("data-pram") != -1 ) {
					name = name.replace("data-pram-","") 
					$prams[name] = attr.value
				} else {
					$prams.attrs[name] = attr.value
				}
			  	
			   	
			}
			// add class active 
			$(".active_link").removeClass("active_link");
			$(".active_same_controller").removeClass("active_same_controller");

			elem = $(options.animateElement);
			
			elem.animate({opacity: 0,top: "-20px"}, 200, function() {
			  	
			  	callController($controller,$prams);

			  	elem = $(options.animateElement);
			  	elem.css({opacity: 0,top: "-20px"});

			  	elem.animate({opacity: 1,top: "0px"}, 200, function() {

			  	})
			});
			
			$selecter = "[data-mvc_controller='"+$controller+"']";

			$($selecter).addClass("active_same_controller");

			$.each($prams,function(k,v) {
				if ( k != "attrs") {
					$selecter += "[data-pram-"+k+"='"+v+"']"
				}
			})
			$($selecter).addClass("active_link");
		});

	}
	hs.$.each(functions,function(k,v) {
		mvc.prototype[k] = v;
	})

	return mvc;

}());