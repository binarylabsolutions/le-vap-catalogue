window.hs = (typeof window.hs == "undefined" ) ? {} : window.hs;

if ( typeof window.jQuery != "undefined" ){ 
	window.hs.$ = window.jQuery;
}

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




/*utilities*/
window.hs.utilities = {};

window.hs.utilities.sanatize_string = function( s ) { return s.replace(/[^a-z0-9]/gi, '_').toLowerCase();   }
window.hs.utilities.sumObjects = function(base , update ) {
    r = {}
    window.hs.$.each(base , function(k,v){
        r[k] = (typeof update[k] != "undefined")  ? update[k] : base[k];
    });
    return r;
}
window.hs.utilities.replaceAll = function (find, replace, sub) {
    return sub.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
};

window.hs.utilities.downloadFile = function(data, filename, type) {
      var a = document.createElement("a"),
          file = new Blob([data], {type: type});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
          var url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
          }, 0); 
      }

}

window.hs.utilities.lightBox = function (p) {

    typesDefault = {"name" : "popup",}
    p            = (!p)             ? {} : p;
    p.heading    = (!p.heading)     ? "" : p.heading;
    p.subHeading = (!p.subHeading)  ? "" : p.subHeading;
    p.body       = (!p.body)        ? "" : p.body;
    p.lock       = (!p.lock)        ? 0  : p.lock;
    p.type       = (!p.type)        ? typesDefault  : p.type;



    $e = $(".hs-pop-up").length ?  $(".hs-pop-up").html("<div></div>").children() : $("<div class='hs-pop-up'><div></div></div>").insertBefore( $("body").children().first() ).children();
    

    $e.append("<header><h3>"+ p.heading +"</h3><p>"+p.subHeading+ "</p></header><div>"+p.body+"</div>")

    if (p.type.name == "conform") {
        $e.append("<br/><br/><br/><footer class='pop-up-footer-fixed'><div class='fr'><button class='type-confrom hs-true'> confrom </button><button class='type-confrom hs-false btn-hollow'> cancel </button></div></footer>")
        $e.find(".type-confrom").click(function(){
            if ( $(this).hasClass("hs-true") ) {
                p.type.succeed( p.type.succeedPrams );
            } else {
                p.type.failed();
            }
            $e.parent().remove();

        })
    }

    if ( !p.lock )
    $e.parent().click(function(e) { if ( $(e.target).is( $(this) )  ) $(this).remove();});

    return $e;
}
window.hs.utilities.notifyHtml = function(data) {
    defaultValues = {
    	container : "body",
    	type : "infomration",
    	interval : 3000,
    	body : "default msg",

    }
    data = window.hs.utilities.sumObjects(defaultValues, data);
    /*
	
    */
    var last = ( $(data.container).children().length ) ? 
        $(data.container).children().last() : 
        $(data.container).append("<div>").children().last();

    $var = $("<div style='display:none;' class='hs-html-notification box "+data.type+"'><p>"+data.body+"</p></div>").insertAfter( last );
    $var.slideDown();

    setTimeout(function(p){ 
        p.slideUp("normal", function() { $(this).remove(); } );
    }, data.interval , $var  );

}
window.hs.utilities.compareObjects = function(o1, o2){
    for(var p in o1){
        if(o1.hasOwnProperty(p)){
            if(o1[p] !== o2[p]) return false;
        }
    }
    for(var p in o2){
        if(o2.hasOwnProperty(p)){
            if(o1[p] !== o2[p]) return false;
        }
    }
    return true;
};

window.hs.utilities.wordSearch = function( SearchStr , content ) {

    sArray = SearchStr.split(" "); 
    totalMatch = 0;
    for (var i = 0; i< sArray.length ; i++) {
    	if ( content.toLowerCase().search( sArray[i] ) != -1 ) totalMatch++;
    }
    
    if ( totalMatch == 0 || sArray.length - totalMatch > 1 ) return 0;
    return 1;
}
window.hs.utilities.date= {}


window.hs.utilities.date.getUTCTimeString = function(timestamp){
	if ( timestamp.toString().length <= 13) {
		var pwr = 13 - timestamp.toString().length;
		timestamp = timestamp*Math.pow(10,pwr)
	}
	d = new Date(timestamp);
	h = d.getUTCHours() + "";
	m = d.getUTCMinutes() + "";
	s = d.getUTCSeconds() + "";
	
	h = (h.length <= 1) ? "0"+h : h
	m = (m.length <= 1) ? "0"+m : m
	s = (s.length <= 1) ? "0"+s : s

	return h + ":" + m + ":" + s
						
};
window.hs.utilities.date.getDateString = function(timestamp){
	if ( typeof timestamp == "undefined") return null;
	if ( timestamp.toString().length <= 13) {
		var pwr = 13 - timestamp.toString().length;
		timestamp = timestamp*Math.pow(10,pwr)
	}
	var d = new Date(timestamp);
	var str = d.getFullYear() + "-" + 
	    ("00" + (d.getMonth() + 1)).slice(-2) + "-" + 
	    ("00" + d.getDate()).slice(-2) + " " + 
	    ("00" + d.getHours()).slice(-2) + ":" + 
	    ("00" + d.getMinutes()).slice(-2) + ":" + 
	    ("00" + d.getSeconds()).slice(-2);
	return str
	    

						
};


/* big engis */

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

					if ( typeof data != "undefined" && typeof data[v] != "undefined" && typeof data[v] != "object" ) {

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
	function checkSameController(controllerName,$prams) {
		
		// if current_controller is not set up ,
		if ( private_data.current_controller.name.length == 0 ) { 
			var p = (typeof $prams == "undefined") ? {} : (typeof $prams.data == "undefined" )  ? {} : $prams.data;
			private_data.current_controller = {
				name : controllerName,
				prams : p,
			};
			return 0;
		}



		$nameIsSame = ( controllerName == private_data.current_controller.name ) ? 1 : 0;

		oldPramsData = private_data.current_controller.prams;
		$prams_clone = JSON.parse(JSON.stringify($prams.data));
		$pramIsSame  = hs.utilities.compareObjects(oldPramsData , $prams_clone ); 

		
		// updateing the previous details
		private_data.current_controller = {
			name : controllerName,
			prams : $prams_clone,
		};
		if ( $nameIsSame && $pramIsSame ) {
			return 1;
		}
		return 0;
	}
	function _callController($controller, $is_abstract = 0, $prams) {

		controllerSet =  ( $is_abstract == 0 ) ? controllers : abstractControllers;
		if ( typeof controllerSet[$controller] == "undefined" ) { 
			return {}
		} else {
			var _c = controllerSet[$controller];

			var returnelem;
			// if its a direct function or object
			if ( typeof _c.call != "undefined" ) {
				returnelem =  _c.call()
				
			} else {

				var returndata = {}
				if (  _c.extends ) {
					returndata =_callController( _c.extends, 1 );
				}
				if ( returndata ) {
					returnelem =  _c.init( returndata, $prams );
					if ( _c.after_render && typeof _c.after_render != "undefined" ) {
						_c.after_render(returndata, $prams);
					}
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
			model : function($name = null,$prams = null) {
				if ( !( $name &&  $name.length) ) return null
				if ( typeof models[$name] == "undefined" ) return null;
				var model = (function() {

					var _ths = models[$name];
					function mvc_model() {
						
					};
					hs.$.each(_ths,function(k,v) {
						if ( typeof v == "function" ) {
							v = v.bind(_ths);
							
						}
						if ( k.indexOf("_") != 0 ) {

							mvc_model.prototype[k] = v;
						}

					})
					return mvc_model;
				}())
				return new model();
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

			// get parameters
			$prams = {
				attrs : {},
				data : {}
			};
			for(i = 0; i< this.attributes.length; i++) {
				var attr = this.attributes[i];
				var name = attr.name;
				if ( name.indexOf("data-") != -1 ) { 
					var _name = name.replace("data-","") 
					$prams.data[_name] = attr.value
				}

				if ( name.indexOf("data-pram") != -1 ) {
					name = name.replace("data-pram-","") 
					$prams[name] = attr.value
				} else {
					$prams.attrs[name] = attr.value
				}
			  	
			}
			var isSameController = checkSameController($controller,$prams);
			if (isSameController) {
				console.log("calling same controller");
				return;
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
			
			$selecter = "";

			$($selecter).addClass("active_same_controller");
			
			$.each($prams.data,function(k,v) {
				$selecter += "[data-"+k+"='"+v+"']"
			})
			$($selecter).addClass("active_link");
		});

	}
	hs.$.each(functions,function(k,v) {
		mvc.prototype[k] = v;
	})

	return mvc;

}());