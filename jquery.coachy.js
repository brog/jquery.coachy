/*
 Copyright 2011 Javier Alejandro Figueroa

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function($) {
	if (typeof(Raphael) == 'undefined') {
		console.log("jQuery Coachy: I need Raphael JS in order to work. http://raphaeljs.com")
		return;
	}

	Raphael.fn.arrow = function (x1, y1, x2, y2, size, stroke) {
        var cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0;
        var curve = 200;
        if (x1 > x2 && y1 > y2) { //arrow diag from bottom right to top left 
        	cx1 = x1 - curve; cy1 = y1; cx2 = x2; cy2 = y2 + curve;	
        } else if (x1 < x2 && y1 < y2) { //arrow diag from top left to bottom right 
        	cx1 = x1 + curve; cy1 = y1; cx2 = x2; cy2 = y2 - curve;	
        } else if (x1 > x2 && y1 < y2) { //arrow diag from top right to bottom left
        	cx1 = x1 - curve; cy1 = y1; cx2 = x2; cy2 = y2 - curve;
        } else if (x1 < x2 && y1 > y2) { //arrow diag from bottom left to top right 
        	cx1 = x1 + curve; cy1 = y1; cx2 = x2; cy2 = y2 + curve;
        } else if (y1 == y2 && x1 != x2) { //straight horizontal line
        	cx1 = x1; cy1 = y1 - 100; cx2 = x2; cy2 = y2 - 100;
        } else if (y1 != y2 && x1 == x2) { //straight vertical line
        	cx1 = x1 + 100; cy1 = y1; cx2 = x2 + 100; cy2 = y2;
        }else if (y1 == y2 && x1 == x2) { //dot
        	cx1 = x1; cy1 = y1; cx2 = x2; cy2 = y2;
        }
        
		var linePath = this.path("M" + x1 + " " + y1 + " C" + cx1 + " " + cy1 + " " + cx2 + " " + cy2 + " " + x2 + " " + y2).attr({"stroke-width": "1px", stroke: stroke});
		var point = linePath.getPointAtLength(linePath.getTotalLength() - 10);
		var angle = Raphael.angle(point.x, point.y, x2, y2);
		var arrowPath = this.path("M" + x2 + " " + y2 + " L" + ((x2 - 10) - size) + " " + (y2 - size) + " L" + ((x2 - 10)  - size)  + " " + (y2 + size) + " L" + x2 + " " + y2 ).rotate((angle+180),x2,y2).attr({"fill": stroke, "stroke": stroke,"stroke-width":"1px"});
		return [linePath,arrowPath];
	}
	
	$.fn.extend({
		coachy: function(options) {
			var id = "__jquerycoachy__" + parseInt(Math.random() * 10);
			var defaults = {
				on: "click",
				off: "mouseover",
				arrow: {
					x1: $(window).width() / 2,
					y1: $(window).height() / 2,
					x2: 30,
					y2: 30
				},
				zindex: "-999999",
				opacity: 0.8,
				theme: "white",
				message: "Hey there!"
			};

			var options = $.extend(defaults, options);

			$(document).bind(options.on, function() {
				var x1 = options.arrow.x1, y1 = options.arrow.y1, x2 = options.arrow.x2, y2 = options.arrow.y2;
				var windowX = $(window).width();
				var windowY = $(window).height();
				
				var div = $("<div />").attr("id", id);
				div.css({
					"position": "absolute", 
					"top":0, 
					"left":0, 
					"z-index" : options.zindex, 
					"background": options.theme == "white" ? "black" : "white", 
					"opacity": options.opacity,
					"pointer-events": " none"
				});

				$("body").append(div);
				
				var paper = new Raphael(document.getElementById(id),windowX,windowY);
				paper.arrow(x1,y1,x2,y2,5, options.theme);

				var offsetX = (x1 < x2) ? offsetX = -30 : offsetX = 30;
				var offsetY = (y1 < y2) ? offsetY = -30 : offsetY = 30;

				paper.text(x1 + offsetX, y1 + offsetY, options.message).attr({
					font:"Helvetica",
					"font-size": "25px",
					stroke: options.theme,
					fill: options.theme
				});
				
				var esc;
				var interval;
				$(document).mousemove(function() {
					if (!esc || esc == null) {
						clearInterval(interval);
						esc = paper.text(windowX - 100, windowY - 70, "Esc to dismiss").attr({
							font:"Helvetica",
							"font-size": "20px",
							stroke: options.theme,
							fill: options.theme
						});
						
						interval = setInterval(function(){
							if (esc) {
								esc.remove();
								esc = null;
							}
						}, 5000);
					}
				});

				$(this).unbind(options.on);
				$("#" + id + " > svg").css("pointer-events", " none");
			});
			
			return this.each( function() {
				var o = options;
				var obj = $(this);
				obj.bind(o.off, function(e) {
					$("#" + id).remove();
				});
				
				$(document).bind("keypress", function(e){
					var code = (e.keyCode ? e.keyCode : e.which);
					if (code == 27) {
						$("#" + id).remove();
					}
				})
			});
		}
	});
})(jQuery);