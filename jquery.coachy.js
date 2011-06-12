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

	Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
		var cx1 = Math.random() * 200, cy1 = Math.random() * 200, cx2 = Math.random() * 100, cy2 = Math.random() * 150;
		var linePath = this.path("M" + x1 + " " + y1 + " C" + cx1 + " " + cy1 + " " + cx2 + " " + cy2 + " " + x2 + " " + y2).attr("stroke-width", "1px");
		var point = linePath.getPointAtLength(linePath.getTotalLength() - size);
		var angle = Raphael.angle(point.x, point.y, x2, y2);
		var arrowPath = this.path("M" + x2 + " " + y2 + " L" + ((x2 - 10) - size) + " " + (y2 - size) + " L" + ((x2 - 10)  - size)  + " " + (y2 + size) + " L" + x2 + " " + y2 ).rotate((angle+180),x2,y2).attr("fill","black").attr("stroke-width", "1px");
		return [linePath,arrowPath];
	}
	
	$.fn.extend({
		coachy: function(options) {

			var defaults = {
				on: "click",
				off: "click",
				arrow: {
					x1: $(window).width() / 2,
					y1: $(window).height() / 2,
					x2: 30,
					y2: 30
				},
				message: "Hey there!"
			};

			var options = $.extend(defaults, options);

			$(document).bind(options.on, function() {
				var x1 = options.arrow.x1, y1 = options.arrow.y1, x2 = options.arrow.x2, y2 = options.arrow.y2;
				var paper = new Raphael(0,0,$(window).width(),$(window).height());
				paper.arrow(x1,y1,x2,y2,5);

				var offsetX = (x1 < x2) ? offsetX = -30 : offsetX = 30;
				var offsetY = (y1 < y2) ? offsetY = -30 : offsetY = 30;

				paper.text(x1 + offsetX, y1 + offsetY, options.message).attr({
					font:"Helvetica",
					"font-size": "25px"
				});

				$("svg").css("pointer-events", " none");
				$(this).unbind(options.on);
			});
			return this.each( function() {
				var o = options;
				var obj = $(this);
				obj.one(o.off, function() {
					$("svg").remove();
				});
			});
		}
	});
})(jQuery);