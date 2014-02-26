/// <reference path="deferred/deferred.d.ts"/>
/// <reference path="observable/observable.ts"/>

import Deferred = require("deferred/deferred");
import IoC = require("ioc/ioc");
import Locators = require("locators");
import D3 = require("adapter3d/object3d");

function bootstrap() {
    IoC.setup({ deferredFactory: new Deferred.DeferredFactory() });
    IoC.autoResolve(window["dependencies"]);
    IoC.preload().then(() => {
        run();
    });
}

var camera: D3.Camera;
var scene: D3.Scene;
var renderer: D3.WebGlRenderer;
var box: D3.Object3D;

function run() {
    scene = new D3.Scene(new THREE.Scene());

    camera = new D3.CameraBuilder()
        .withFieldOfView(70)
        .withAspectRatio(window.innerWidth / window.innerHeight)
        .withNear(0.1)
        .withFar(1000)
        .create();

    camera.position.z = 5;

    box = new D3.CubeBuilder()
        .withSize({ width: 1, height: 1, depth: 1 })
        .withMaterial(
            new D3.BasicMaterialBuilder()
            .withColor(0x0000ff))
        .create();

    scene.addChild(box);

    renderer = new D3.WebGlRenderer(
        new THREE.WebGLRenderer({ antialias: true }));

    renderer.setSize(window.innerWidth, window.innerHeight);

    $(document.body).append(renderer.domElement);

    render();
}

function render() {
    requestAnimationFrame(render);

    box.rotation.z += 0.1;
    box.rotation.x += 0.1;

    renderer.render(scene, camera);
}

bootstrap();