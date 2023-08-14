const app = new PIXI.Application({ view: document.getElementById('artCanvas') });

const vertexSrc = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
`;

const fragmentSrc = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 controlPoints[4];

vec2 distort(vec2 uv, vec2 controlPoint) {
    float dist = distance(uv, controlPoint);
    if (dist < 0.1) {
        return uv + (controlPoint - uv) * (0.1 - dist) * 10.0;
    }
    return uv;
}

void main(void) {
    vec2 uv = vTextureCoord;
    for (int i = 0; i < 4; i++) {
        uv = distort(uv, controlPoints[i]);
    }
    gl_FragColor = texture2D(uSampler, uv);
}
`;

const controlPoints = [
    new PIXI.Point(0, 0),
    new PIXI.Point(app.screen.width, 0),
    new PIXI.Point(app.screen.width, app.screen.height),
    new PIXI.Point(0, app.screen.height)
];

const distortionFilter = new PIXI.Filter(vertexSrc, fragmentSrc, {
    controlPoints: controlPoints
});

const graphics = new PIXI.Graphics();
graphics.beginFill(0xFFFFFF);
graphics.drawRect(0, 0, app.screen.width, app.screen.height);
graphics.endFill();
graphics.filters = [distortionFilter];
app.stage.addChild(graphics);

// TODO: Add drawing and interaction logic here
