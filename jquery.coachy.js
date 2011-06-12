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
        var cx1 = x1 + 10, cy1 =  y1  - 10, cx2 = x2 + 10 , cy2 = y2 - 10;
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
				
				var paper = new Raphael(document.getElementById(id),$(window).width(),$(window).height());
				paper.arrow(x1,y1,x2,y2,5, options.theme);

				var offsetX = (x1 < x2) ? offsetX = -30 : offsetX = 30;
				var offsetY = (y1 < y2) ? offsetY = -30 : offsetY = 30;

				paper.text(x1 + offsetX, y1 + offsetY, options.message).attr({
					font:"Helvetica",
					"font-size": "25px",
					stroke: options.theme,
					fill: options.theme
				});

				$(this).unbind(options.on);
				$("#" + id + " > svg").css("pointer-events", " none");
			});
			return this.each( function() {
				var o = options;
				var obj = $(this);
				obj.bind(o.off, function() {
					$("#" + id).remove();
					$(this).unbind(o.off);
				});
			});
		}
	});
})(jQuery);