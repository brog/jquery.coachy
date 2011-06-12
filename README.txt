Usage:

$("#test").coachy({
	on: "custom",
	off: "mouseout",
	arrow: {
		x1: 345,
		y1: 100,
		x2: 50,
		y2: 50
	},
	message: "This is a coach message"
});

"on" is the event at wish your coach mark is supposed to activate
"off" is the event applicable to the selector, when trigger removes the coach mark
"x1, y1" tail of the arrow
"x2, y2" head of the arrow