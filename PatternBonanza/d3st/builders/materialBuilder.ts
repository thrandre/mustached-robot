module D3ST.Builders {
    export class MaterialBuilder {
        color: number = 0xffffff;
        opacity: number = 1;
        transparent: boolean = false;

        withOpacity(opacity: number): MaterialBuilder {
            this.opacity = opacity;
            return this;
        }

        withTransparency(transparency: boolean): MaterialBuilder {
            this.transparent = transparency;
            return this;
        }

        withColor(color: number): MaterialBuilder {
            this.color = color;
            return this;
        }

        create(): Objects.Material {
            throw new Error("Abstract base class. Use concrete implementation.");
        }
    }
} 