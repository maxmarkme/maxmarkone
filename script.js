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

vec2 barycentricDistort(vec2 uv, vec2 a, vec2 b, vec2 c) {
    float detT = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    float w1 = ((b.y - c.y) * (uv.x - c.x) + (c.x - b.x) * (uv.y - c.y)) / detT;
    float w2 = ((c.y - a.y) * (uv.x - c.x) + (a.x - c.x) * (uv.y - c.y)) / detT;
    float w3 = 1.0 - w1 - w2;
    return w1 * a + w2 * b + w3 * c;
}

void main(void) {
    vec2 uv = vTextureCoord;
    uv = barycentricDistort(uv, controlPoints[0], controlPoints[1], controlPoints[2]);
    uv = barycentricDistort(uv, controlPoints[2], controlPoints[3], controlPoints[0]);
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
