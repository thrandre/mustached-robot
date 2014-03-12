///<reference path="materialBuilder.ts"/>

module D3ST.Builders {
     export class LambertMaterialBuilder extends MaterialBuilder {
         create(): Objects.Material {
             return new Objects.Material(
                 new THREE.MeshLambertMaterial({
                     opacity: this.opacity,
                     transparent: this.transparent,
                     color: this.color
                 }));
         }
     }
 }