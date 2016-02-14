//colors
var red = "#CC294F";
var bg = "#171a38";
var dgrey = "#444859";
var lgrey = "#CCBBB6";
var beige = "#EED7CD";

var bodyDistance = 85;

//orbital times from http://www.sjsu.edu/faculty/watkins/orbital.htm
var bodies = [
    sun = {size:45, color: "#FFAA69", alt: "Sun"},
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

    var rotateSpeed = 1;

    stage.canvas.height = window.innerWidth;
    stage.canvas.width = window.innerWidth;

    var pathOn = "turn on orbits";
    var pathOff = "turn off orbits";
    var pathToggle = $("#path-toggle");
    pathToggle.text(pathOff).click(function () {
        if (pathToggle.text() == pathOn) {
            pathToggle.text(pathOff);
            pathsOn();
        }
        else {
            pathToggle.text(pathOn);
            pathsOff();
        }
    });


    $('html, body').animate({
        scrollTop: (stage.canvas.width/2) - (window.innerHeight/2)
    }, 1500);

    var center = {
        x: stage.canvas.width / 2,
        y: stage.canvas.height / 2
    };

    background = new createjs.Shape();
    background.graphics.beginRadialGradientFill(["#171f44","#111432"], [.25,.75],
        center.x, center.y, 10, center.x, center.y, 1000).drawCircle(center.x, center.y, 1500);
    stage.addChild(background);

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        if (i > 0) body.alt += "\nyear length: " + body.orbitalTime + " earth years";

        var distance = bodyDistance * i;
        if (i > 0) distance += body.size;
        var path;
        path = new createjs.Shape();
        path.graphics.setStrokeStyle(1);
        path.graphics.beginStroke(dgrey).drawCircle(0, 0, distance);
        stage.addChild(path);
        path.x = center.x;
        path.y = center.y;
        if (i == 0) path.alpha = 0;
        body.path = path;

        var circle = new createjs.Shape();
        circle.graphics.beginFill(body.color).drawCircle(0, 0, body.size);
        circle.x = center.x;
        circle.y = center.y;
        circle.regX = distance; //set rotational center
        stage.addChild(circle);
        body.object = circle;

        var text = new createjs.Text(body.alt, "12pt avenir next", "#CCBBB6");
        text.x = circle.x;
        text.y = circle.y;
        text.regX = distance - body.size;
        text.textBaseline = "middle";
        text.alpha = 0;
        stage.addChild(text);
        circle.text = text;

        path.planet = circle;

        circle.addEventListener("mouseover", function(e) {
            e.target.text.alpha = 1;
            focus(e.target)
        });
        circle.addEventListener("mouseout", function(e) {
            e.target.text.alpha = 0;
            unfocus(e.target)
        });
        path.addEventListener("mouseover", function(e) {
            e.target.planet.text.alpha = 1;
            focus(e.target)
        });
        path.addEventListener("mouseout", function(e) {
            e.target.planet.text.alpha = 0;
            unfocus(e.target)
        });
    }

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onTick);

    stage.update();

    function onTick() {
        for (var i = 0; i < bodies.length; i++) {
            var object = bodies[i].object;
            var degrees = 1 / bodies[i].orbitalTime * rotateSpeed;
            object.text.rotation += degrees;
            object.rotation += degrees;
        }
        stage.update();
    }

    function focus(target) {
        rotateSpeed = .2;
        for (var i = 0; i < bodies.length; i++) {
            if (bodies[i].object != target && bodies[i].object != target.planet) bodies[i].object.alpha = .2;
        }
    }

    function unfocus(target) {
        rotateSpeed = 1;
        for (var i = 0; i < bodies.length; i++) {
            bodies[i].object.alpha = 1;
        }
    }

    function pathsOn() {
        for (var i = 0; i < bodies.length; i++) {
            bodies[i].path.alpha = 1;
        }
    }

    function pathsOff() {
        for (var i = 0; i < bodies.length; i++) {
            bodies[i].path.alpha = 0;
        }
    }
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}
