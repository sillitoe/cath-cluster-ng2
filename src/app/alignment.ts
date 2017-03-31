import { Utils } from './helper/utils'; 
import { Member } from './members/member';
import { Annotation } from './annotations/annotation';
import { Segment } from './segment';

import * as _ from "lodash";

export class ColumnAnnotation {
  feature: string;
  sequence: string;
}

export class IAlignment {
  id: string;
  label: string;
  description?: string;
  members?: Member[];  
  column_annotations?: ColumnAnnotation[];
}

export class Alignment {
  id: string;
  label: string;
  description?: string;
  members?: Member[] = [];
  column_annotations?: ColumnAnnotation[] = [];
  
  constructor(opts?: IAlignment) {
    if ( opts ) {
      this.id = opts.id;
      this.label = opts.label;
      this.description = opts.description;
      this.members = opts.members || [];
      this.column_annotations = opts.column_annotations || [];      
    }
  }

  getFirstMemberWithStructure(): Member {
    let member: Member = _.find( this.members, (m) => m.hasStructuralAnnotations() );
    return member;
  }
  
  filterAllAnnotations(filterArg: any): Annotation[] {
    
    let all_annotations: Annotation[] = _.flatten( _.map( this.members, (m) => { return m.annotations } ) );
    let uniq_annotations: Annotation[] = _.unionBy( all_annotations, (a) => { return a.id } );
    console.log( "uniq_annotations", uniq_annotations );
    let filtered_annotations = _.filter( uniq_annotations, filterArg );
    console.log( "filtered_annotations", filtered_annotations );    
    return filtered_annotations;
  }
  
}
