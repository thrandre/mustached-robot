module D3ST.Objects {
    export class Renderer {
        get object(): Wrappers.IRenderer {
            return this.renderer;
        }

        render(scene: Scene, camera: Camera) { }

        constructor(public renderer: Wrappers.IRenderer) { }
    }
} 