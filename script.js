paper.setup(document.getElementById('artCanvas'));

let path;
let controlPoints = [];

function onMouseDown(event) {
    path = new paper.Path();
    path.strokeColor = 'black';
    path.strokeWidth = 50;
    path.add(event.point);
}

function onMouseDrag(event) {
    path.add(event.point);
}

function onMouseUp(event) {
    if (controlPoints.length === 0) {
        createControlPoints(event);
    }
}

function createControlPoints(event) {
    for (let i = 0; i < 4; i++) {
        let controlPoint = new paper.Path.Circle({
            center: [i % 2 === 0 ? 0 : paper.view.size.width, i < 2 ? 0 : paper.view.size.height],
            radius: 10,
            fillColor: 'red'
        });
        controlPoint.onMouseDrag = function(event) {
            distortDrawing(event);
        }
        controlPoints.push(controlPoint);
    }
}

function distortDrawing(event) {
    // This is a basic distortion. It moves the paths based on the control point's movement.
    paper.project.activeLayer.children.forEach(child => {
        if (child !== controlPoints[0] && child !== controlPoints[1] && child !== controlPoints[2] && child !== controlPoints[3]) {
            child.position = child.position.add(event.delta);
        }
    });
}

function saveDrawing() {
    // Placeholder for save drawing logic
}

function postToSocialMedia() {
    // Placeholder for post to social media logic
}

paper.view.draw();
