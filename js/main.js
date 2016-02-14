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

    if (mobileCheck()) {
        $("#unsupported").show();
        return;
    }

    var rotateSpeed = 1;

    stage.canvas.height = window.innerWidth;
    stage.canvas.width = window.innerWidth;

    var pathOn = "turn on orbits";
    var pathOff = "turn off orbits";
    var pathToggle = $("#path-toggle").addClass("mui--show");
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
    background.graphics.beginRadialGradientFill(["#192148","#111432"], [.25,.75],
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

function mobileCheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}
