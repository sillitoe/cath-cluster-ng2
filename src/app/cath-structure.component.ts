import { Component, Input, ElementRef, OnChanges, SimpleChange } from '@angular/core';

import { Domain } from './domain';

export type HighlightQuery = {
  entity_id: string,
  struct_asym_id: string,
  start_residue_number: number,
  end_residue_number: number,
}

@Component({
  selector: 'cath-structure',
  template: `
    <div>Loading LiteMol Viewer...</div>
  `
})

export class CathStructureComponent implements OnChanges {

  @Input()
  pdbId: string;
  
  @Input()
  selectedDomain: Domain;
  
  //view: $3Dmol.Viewer;
  plugin: any;

  Transformer = LiteMol.Bootstrap.Entity.Transformer;
  Query = LiteMol.Core.Structure.Query;
  CoreVis = LiteMol.Visualization;
  Bootstrap = LiteMol.Bootstrap;
  Visualization = this.Bootstrap.Visualization;
  Tree = this.Bootstrap.Tree;
  Transform = this.Tree.Transform;
  Command = this.Bootstrap.Command;
  
  constructor(public elementRef: ElementRef) {
    var native = elementRef.nativeElement;

    this.plugin = LiteMol.Plugin.create({
      target: native,
      viewportBackground: '#eeeeee',
      layoutState: { hideControls: true }
    });
    
    if ( this.pdbId ) {
      this.loadStructure();
    }
  }
  
  ngOnChanges( changes: {[propKey: string]: SimpleChange }) {
    if ( this.pdbId ) {
      this.loadStructure();
    }
  }
      
  public loadStructure(): void {
    let pdbId = this.pdbId;
    let domain = this.selectedDomain;

    console.log( `cath-structure.loadPdb('${pdbId}', '${domain}')` );

    let action = this.plugin.createTransform();
        
    action.add(this.plugin.root, this.Transformer.Data.Download, 
            { url: `https://www.ebi.ac.uk/pdbe/static/entry/${pdbId}_updated.cif`, type: 'String', pdbId })
        .then(this.Transformer.Data.ParseCif, { pdbId }, { isBinding: true })
        .then(this.Transformer.Molecule.CreateFromMmCif, { blockIndex: 0 })
        .then(this.Transformer.Molecule.CreateModel, { modelIndex: 0 })
        .then(this.Transformer.Molecule.CreateMacromoleculeVisual, { polymer: true, het: true, water: false });

    this.plugin.applyTransform(action);
  }

  highlightSelectedDomain() {

    var entity_id = this.pdbId;
    var chain_code = this.selectedDomain.segments[0].pdb_chain_code;
    
    var highlightQuery: HighlightQuery = {
      entity_id: this.pdbId,
      struct_asym_id: chain_code,
      start_residue_number: 1,
      end_residue_number: 100,
    };

    this.selectExtractFocus( highlightQuery, {r: 255, g: 255, b: 0 }, false );
  }
  
  resetThemeSelHighlights() {
    
  }
  
  selectExtractFocus( queryData: HighlightQuery, color: {r:number, g:number, b:number}, showSideChains: boolean ) :void {

    this.resetThemeSelHighlights();
    
    let visual = this.plugin.root;
    
    let query = this.Query.sequence(
      queryData.entity_id,
      queryData.struct_asym_id,
      { seqNumber: queryData.start_residue_number }, 
      { seqNumber: queryData.start_residue_number }
    );
    
		var theme = this.createSelectionTheme(this.CoreVis.Color.fromRgb(color.r, color.g, color.b));
		var action = this.Transform.build()
    					.add(visual, this.Transformer.Molecule.CreateSelectionFromQuery, { query: query, name: 'My name' }, { ref: 'sequence-selection' })
    				
		//If show sidechains is true
		if(typeof showSideChains !== 'undefined' && showSideChains == true){	
			action.then(this.Transformer.Molecule.CreateVisual, { style: this.Visualization.Molecule.Default.ForType.get('BallsAndSticks') });
		}

    var self = this;
		this.plugin.applyTransforms(action).then(function () {
		    self.Command.Visual.UpdateBasicTheme.dispatch( self.plugin.context, { visual: visual, theme: theme });

    		self.Command.Entity.Focus.dispatch( self.plugin.context, self.plugin.context.select( 'sequence-selection' ) );

				// alternatively, you can do this
				//Command.Molecule.FocusQuery.dispatch(plugin.context, { model: selectNodes('model')[0] as any, query })
		});
  }
  
  createSelectionTheme(color: {r: number, g: number, b: number}) {
    var colors = new Map();
    colors.set('Uniform', this.CoreVis.Color.fromHex(0xffff00));
    colors.set('Selection', color);
    colors.set('Highlight', this.CoreVis.Theme.Default.HighlightColor);
    return this.Visualization.Molecule.uniformThemeProvider(void 0, { colors: colors });
  }
}
