import { Component, Input, ElementRef } from '@angular/core';

import Transformer = LiteMol.Bootstrap.Entity.Transformer;

@Component({
  selector: 'cath-structure',
  template: `
    <div>Structure</div>
  `
})

export class CathStructureComponent {

  @Input()
  pdbId: string = '1abc';
  
  //view: $3Dmol.Viewer;
  plugin: any;
  
  constructor(public elementRef: ElementRef) {
    var native = this.elementRef.nativeElement;

    this.plugin = LiteMol.Plugin.create({
      target: native,
      viewportBackground: '#eeeeee',
      layoutState: { hideControls: true }
    });

    let id = '1cbs';
    let action = this.plugin.createTransform();
        
    action.add(this.plugin.root, Transformer.Data.Download, 
            { url: `https://www.ebi.ac.uk/pdbe/static/entry/${id}_updated.cif`, type: 'String', id })
        .then(Transformer.Data.ParseCif, { id }, { isBinding: true })
        .then(Transformer.Molecule.CreateFromMmCif, { blockIndex: 0 })
        .then(Transformer.Molecule.CreateModel, { modelIndex: 0 })
        .then(Transformer.Molecule.CreateMacromoleculeVisual, { polymer: true, het: true, water: false });

    this.plugin.applyTransform(action);    
  }
      
  public loadPdb(pdbId: string): void {
    this.pdbId = pdbId;
  }
}
