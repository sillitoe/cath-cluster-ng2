import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import *  as PDBe from './pdbe';

@Injectable()
export class StructureService {
  private static readonly PDBE_BASE :string = "http://www.ebi.ac.uk/pdbe/api/pdb/entry";
  
  public static readonly PDBE_SUMMARY_URL :string = StructureService.PDBE_BASE + "/summary/";
  public static readonly PDBE_LIGANDS_URL :string = StructureService.PDBE_BASE + "/ligand_monomers/";
  public static readonly PDBE_MUTATED_URL :string = StructureService.PDBE_BASE + "/mutated_AA_or_NA/";
  public static readonly PDBE_BINDING_URL :string = StructureService.PDBE_BASE + "/binding_sites/";

  constructor (private http: Http){}

  getPdbSummary(pdbid: string): Observable<PDBe.PdbSummary> {
    console.log( `getPdbSummary(${pdbid})` );
    return this.http.get(StructureService.PDBE_SUMMARY_URL + pdbid)
      .map((res) => { return this.extractPdbSummaryData(res, pdbid); } )
      .catch(this.handleError);
  }

  // http://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/1vlh

  private extractPdbSummaryData(res: Response, pdbid: string): PDBe.PdbSummary {
    let body = res.json();

    let datacontainer = body[pdbid];
    if ( typeof datacontainer === 'undefined' ) {
      throw(`Error: failed to file data for PDB '${pdbid}'`);
    }

    let data = datacontainer[0];
    let pdb = new PDBe.PdbSummary();

    pdb.title = data.title;
    //console.log( "extractPdbSummaryData", this, data.release_date );
    pdb.release_date = PDBe.Utils.parsePdbDate(data.release_date);
    pdb.experimental_method = data.experimental_method[0];
    pdb.revision_date = PDBe.Utils.parsePdbDate(data.revision_date);
    pdb.entry_authors = data.entry_authors;

    return pdb;
  }

  getPdbBindingSites(pdbid: string): Observable<PDBe.BindingSite[]> {
    console.log( `getPdbBindingSites(${pdbid})` );
    return this.http.get(StructureService.PDBE_BINDING_URL + pdbid)
      .map((res) => { return this.extractPdbBindingSitesData(res, pdbid); } )
      .catch(this.handleError);
  }

  // http://www.ebi.ac.uk/pdbe/api/pdb/entry/binding_sites/1vlh

  private extractPdbBindingSitesData(res: Response, pdbid: string): PDBe.BindingSite[] {
    let body = res.json();
    let sites: PDBe.BindingSite[] = [];

    let datacontainer = body[pdbid];
    if ( typeof datacontainer === 'undefined' ) {
      throw(`Error: failed to file data for PDB '${pdbid}'`);
    }
    for( let data of datacontainer ) {
      let site: PDBe.BindingSite = data;
      sites.push( site );
    }
    return sites;
  }

  getPdbMutatedResidues(pdbid: string): Observable<PDBe.MutatedResidue[]> {
    console.log( `getMutatedResidues(${pdbid})` );
    return this.http.get(StructureService.PDBE_MUTATED_URL + pdbid)
      .map((res) => { return this.extractPdbMutatedResiduesData(res, pdbid); } )
      .catch(this.handleError);
  }

  // http://www.ebi.ac.uk/pdbe/api/pdb/entry/mutation_sites/1vlh

  private extractPdbMutatedResiduesData(res: Response, pdbid: string): PDBe.MutatedResidue[] {
    let body = res.json();
    let residues: PDBe.MutatedResidue[] = [];

    let datacontainer = body[pdbid];

    if ( typeof datacontainer === 'undefined' ) {
      throw(`Error: failed to file data for PDB '${pdbid}'`);
    }

    let data = datacontainer;
    //console.log( "extractPdbMutatedResiduesData", this, data );
    for( let data_res of data ) {
      let res : PDBe.MutatedResidue = data_res;
      residues.push( res );
    }

    return residues;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
