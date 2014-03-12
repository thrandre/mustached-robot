module D3ST.Objects {
    export class WebGlRenderer extends Renderer {
        get object(): THREE.WebGLRenderer {
            return <THREE.WebGLRenderer> this.renderer;
        }

        get domElement(): HTMLCanvasElement {
            return this.object.domElement;
        }

        setSize(width: number, height: number) {
            this.object.setSize(width, height);
        }

        render(scene: Scene, camera: Camera) {
            this.object.render(<any>scene.object, <any>camera.object);
        }

        constructor(renderer: Wrappers.IWebGlRenderer) { super(renderer); }
    }
} 