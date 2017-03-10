import { Input, ElementRef, Component } from '@angular/core';
import { CathStructureComponent } from './cath-structure.component';
import { CathRepComponent } from './cath-rep.component';
import { CathRepFeaturesComponent } from './cath-rep-features.component';
import { CathMsaComponent } from './cath-msa.component';

@Component({
  selector: 'cath-funfam',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">        
          <div class="">FunFam: {{name}} ({{accession}})</div>
          <cath-structure class=""></cath-structure>
          <cath-rep></cath-rep>
          
          <div class="">
            <ul>
              <li><a href="#1">Members</a></li>
              <li><a href="#2">Alignment</a></li>              
            </ul>
            <div class="panel" id="1"></div>
            <div class="panel" id="2">
              <cath-msa class=""></cath-msa>            
            </div>
          </div>          
        </div>
        <div class="col-md-4">
          <cath-rep-features></cath-rep-features>
        </div>
      </div>
    </div>
  `,
  styles: [`
  `]
})

export class AppComponent { 
  @Input()
  accession: string = '1.1.1.1/FF/1';

  cathSfamId: string;
  cathFunfamNum: number;

  @Input()
  name: string = '<Funfam name>';
  
  @Input()
  repId: string;
  
  constructor(public elementRef: ElementRef) {
    var native = this.elementRef.nativeElement;
    var acc = native.getAttribute('accession') || this.accession;
    this.accession = acc;
    this.parseAccession( acc );
    console.log( "AppComponent.accession", acc );
  }
  
  private parseAccession(ffid: string): void {
    var parts = ffid.split('/');
    this.cathSfamId = parts[0];
    this.cathFunfamNum = parseInt( parts[2] );
  }
}
