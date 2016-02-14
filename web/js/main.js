//colors
var red = "#CC294F";
var bg = "#2C1944";
var dgrey = "#444859";
var lgrey = "#CCBBB6";
var beige = "#EED7CD";

var bodyDistance = 75;

//orbital times from http://www.sjsu.edu/faculty/watkins/orbital.htm
var bodies = [
    sun = {size:50, color: "#FFCC69", alt: ""},
    mercury = {size: 5, color: "#CDBBBD", orbitalTime: 0.2409, alt: "Mercury"},
    venus = {size: 8, color: "#F1E8BD", orbitalTime: 0.616, alt: "Venus"},
    earth = {size: 9, color: "#203D84", orbitalTime: 1, alt: "Earth"},
    mars = {size: 7, color: "#EF8C74", orbitalTime: 1.9, alt: "Mars"},
    jupiter = {size: 20, color: "#E5AD63", orbitalTime: 12.0, alt: "Jupiter"},
    saturn = {size: 15, color: "#F3D6A2", orbitalTime: 29.5, alt: "Saturn"},
    uranus = {size: 12, color: "#BFDAFF", orbitalTime: 84, alt: "Uranus"},
    neptune = {size: 14, color: "#3956E0", orbitalTime: 165, alt: "Neptune"}
];

function init() {
    var stage = new createjs.Stage("canvas");
    stage.enableMouseOver(60);

    stage.canvas.height = window.innerWidth;
    stage.canvas.width = window.innerWidth;

    $('html, body').animate({
        scrollTop: (stage.canvas.width/2) - (window.innerHeight/2)
    }, 1500);

    var center = {
        x: stage.canvas.width / 2,
        y: stage.canvas.height / 2
    };

    for (var i = 0; i < bodies.length; i++) {
        var path;
        path = new createjs.Shape();
        path.graphics.setStrokeStyle(1, "round");
        path.graphics.beginStroke(dgrey).drawCircle(0, 0, bodyDistance * i);
        stage.addChild(path);
        path.x = center.x;
        path.y = center.y;
        if (i == 0) path.alpha = 0;


        var body = bodies[i];
        var circle = new createjs.Shape();
        circle.graphics.beginFill(body.color).drawCircle(0, 0, body.size);
        circle.x = center.x;
        circle.y = center.y;
        circle.regX = bodyDistance * i; //set rotational center
        stage.addChild(circle);
        body.object = circle;

        var text = new createjs.Text(body.alt, "12pt avenir next", "#CCBBB6");
        text.x = circle.x - bodyDistance * i;
        text.y = circle.y;
        text.textBaseline = "alphabet";
        text.alpha = 0;
        stage.addChild(text);
        circle.text = text;

        path.planet = circle;

        circle.addEventListener("mouseover", function(e) {
            e.target.text.alpha = 1;
        });
        circle.addEventListener("mouseout", function(e) {
            e.target.text.alpha = 0;
        });
        path.addEventListener("mouseover", function(e) {
            e.target.planet.text.alpha = 1;
        });
        path.addEventListener("mouseout", function(e) {
            e.target.planet.text.alpha = 0;
        });
    }

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onTick);

    stage.update();

    function onTick() {
        for (var i = 0; i < bodies.length; i++) {
            var object = bodies[i].object;
            object.rotation += 1 / bodies[i].orbitalTime;
        }
        stage.update();
    }
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}
