	window.hs = (typeof window.hs == "undefined" ) ? {} : window.hs;
	
	window.hs.log = (!(typeof window.hs.log == "undefined" )) ? window.hs.log : {

		logging_enable : null,
		error_enable : null,
		warning_enable : null,

		initilize : function($msg) {

			if ( typeof localStorage == "undefined") {

				window.hs.log.logging_enable = 1;
				window.hs.log.error_enable = 1;
				window.hs.log.warning_enable = 1;

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
		}
		var abstractControllers = {};
		var controllers = {};

		var models = {};
		var data_providers = {};

		/*

			view function
				put data value


		*/
		templateEngin = {

			identifiers : {
				dataTag : /\{\!\{[a-zA-Z_.]+\}\}/gm,
				tag : /\{\!\{[a-zA-Z_]+((\ +[a-zA-Z_]+=[^ '"]+)|(\ +[a-zA-Z_]+='[^']*')|(\ +[a-zA-Z_]+="[^"]*")|(\ +[a-zA-Z_]+))*\ *\}\}/gm,
				all_elem : /\{\!\{[a-zA-Z_]+((\ +[a-zA-Z_]+=[^ '"]+)|(\ +[a-zA-Z_]+='[^']*')|(\ +[a-zA-Z_]+="[^"]*")|(\ +[a-zA-Z_]+))*\ *\}\}/gm,
			},
			exect_match : {
				dataTag : /^\{\!\{[a-zA-Z_.]+\}\}$/gm,
				tag : /^\{\!\{[a-zA-Z_]+((\ +[a-zA-Z_]+=[^ '"]+)|(\ +[a-zA-Z_]+='[^']*')|(\ +[a-zA-Z_]+="[^"]*")|(\ +[a-zA-Z_]+))*\ *\}\}$/gm,
			},
		
			parseIterator: function($obj,$data) {

				$obj.find("[data-mvc_loop]").each(function() {
					elm = $(this);
					$dataSetName = elm.attr("data-mvc_loop");
					$templateName = elm.attr("data-mvc_loop_template");

					
					$templageObj = $("#"+ $templateName);
					

					if ( !$templageObj.length ) return

					$.each( $data[$dataSetName] , function (k,_data) {
						$template_clone_str = templateEngin.getHtmlStr($templageObj)
						$child_html = templateEngin.parser.parseString($template_clone_str , _data);
						elm.append($child_html);
					});

					$(this).removeAttr("data-mvc_loop").attr("data-mvc_loaded" , $dataSetName )
				});

				return $obj;
			
			},

			
			functionSet : {
				mvc_loop : function(attr,$data) {
					
					var $html = "";
					if ( typeof attr.data != "undefined" && typeof $data[attr.data] != "undefined" ) {
						
						$.each($data[attr.data], function(k,dd) {
							var $obj = templateEngin.getTemplateObject(attr.template);
							$obj = templateEngin.parse($obj,dd);
							$html += templateEngin.getHtmlStr($obj)
						});
					}
					
					return $html;
				},
				mvc_load: function(attr,$data) {
					

					var passData =  ( typeof attr.data != "undefined" && typeof $data[attr.data] != "undefined" ) ? $data[attr.data] : $data

					var $obj = templateEngin.getTemplateObject(attr.template);
					
					var $obj2 = templateEngin.parse($obj,passData);

					
					return templateEngin.getHtmlStr($obj2)
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
					for (var key in  templateEngin.exect_match) {
					    if ( templateEngin.exect_match.hasOwnProperty(key)) {

					    	templateEngin.exect_match[key].lastIndex = 0;
					    	var result = templateEngin.exect_match[key].test(str) ;
					    	
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
							$exp_str = templateEngin.parser.parseString($exp_str , v ,$preval + k + "." )
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
						exp_str = exp_str.replace( templateEngin.identifiers.dataTag , tempObj );
					
					} else {

						if ( typeof data[v] != "undefined" && typeof data[v] != "object" ) {

							exp_str = exp_str.replace( templateEngin.identifiers.dataTag , data[v]);		
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

							
							attrSet[key] = templateEngin.parser.parseString(value,data ) ;
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
					attributes = templateEngin.parser._parseTagAttribute(raw_str,data)
					
					var $return_str = "";

					if ( typeof templateEngin.functionSet[actionName] != "undefined") {
						$return_str = templateEngin.functionSet[actionName](attributes,data );
						
					}
					return $return_str;
				},

			},
			/*
				understant the element
				if its data 
			*/
			parse: function(obj , data) {

				var $str = templateEngin.getHtmlStr(obj);
				
				counter = 0;
				
				$condition = 1;

				while( $condition ) {

					templateEngin.identifiers.all_elem.lastIndex = 0;
					var resultSet = templateEngin.identifiers.all_elem.exec($str);

					if ( !resultSet ) {
						$condition = 0;
						continue;
					}
					
					var rr = resultSet;

					var result = rr[0].trim();
					
					var text = "";

					recognizeObject = templateEngin.parser.recognizeObject(result);

					switch (recognizeObject) {
						case "tag":
							text = templateEngin.parser.tag(result,data);
							
						break;
						case "dataTag":
							text = templateEngin.parser.dataTag(result,data);
							
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
		/* private functions */
		function _callController($controller, $is_abstract = 0, $prams) {

			controllerSet =  ( $is_abstract == 0 ) ? controllers : abstractControllers;

			if ( typeof controllerSet[$controller] == "undefined" ) { 
				return {}
			} else {
				var _c = controllerSet[$controller];

				if ( typeof _c.call != "undefined" ) {

					return _c.call();

				} else {
				
					data = ( _c.extends ) ? _callController( _c.extends, 1 )  : {};
					data =  _c.init(data, $prams);
					return data;
				}
				
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
						if ( !typeof $d.call == "undefined" ) {
							
							con.init = $d;

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

					obj = templateEngin.parse(obj,data);
					
					
					
					obj = $('<div>').append(obj);
					$str = obj.html();
					//$str = templateEngin.parser.parseString($str ,data  );

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
			getBaseView: function() {
				
				return private_data._data.baseView;
			},
			getDeafultController : function() {
				return private_data._data.deafultController;
			},
			
			init : function () {
				callController( private_data._data.deafultController  );
			},
			/* remove later */
			getEverything : function() {
				console.log(private_data);
				console.log(abstractControllers);
				console.log(controllers);
				console.log(models);
				console.log(data_providers);
			}
		}

		function mvc($data) {
			
			functions.setDeafultController( $data.deafultController );
			functions.setBaseView( $data.baseView );


			$(document).on("click" , "[data-mvc_controller]", function () {

				// running controller function
				$controller = $(this).attr("data-mvc_controller");

				if ( typeof controllers[$controller] == "undefined" ) {
					console.log("no controller exist");
					return 0;
				}
				
				
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

				callController($controller,$prams);
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