paper.setup(document.getElementById('artCanvas'));

let path;

function onMouseDown(event) {
    path = new paper.Path();
    path.strokeColor = 'black';
    path.strokeWidth = 50;
    path.add(event.point);
}

function onMouseDrag(event) {
    path.add(event.point);
}

paper.view.draw();
