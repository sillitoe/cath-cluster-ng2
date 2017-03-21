import { Annotation } from '../annotations/annotation';
import { Domain } from '../domain';
import { Segment } from '../segment';
import { Utils } from '../helper/utils';

import * as _ from 'lodash';

interface IMember {
  id: string;
  label: string;
  source: string;
  db_version: string;
  organism: string;
  sequence?: string;
  domain?: Domain;
  annotations?: Annotation[];
  renderLabel?: () => string;
}

export class Member {
  
  id: string;
  label: string;
  source: string;
  db_version: string;
  organism: string;
  sequence?: string;
  domain?: Domain;
  annotations?: Annotation[];
  renderLabel?: () => string;
  
  constructor( args?: IMember ) {
    this.id = args.id;
    this.label = args.label;
    this.source = args.source;
    this.db_version = args.db_version;
    this.organism = args.organism;
    if ( typeof args.sequence !== 'undefined' ) {
      this.sequence = args.sequence;
    }
    if ( typeof args.domain !== 'undefined' ) {
      this.domain = args.domain;
    }
    else {
      let d: Domain = Utils.getDomainFromSequenceId( this.source, this.id );
      this.domain = d;
    }
    if ( typeof args.annotations !== 'undefined' ) {
      this.annotations = args.annotations;
    }
    if ( typeof args.renderLabel !== 'undefined' ) {
      this.renderLabel = args.renderLabel;
    }
  }
  
  hasPdbId(): boolean {
    return typeof this.getPdbId() !== 'undefined';
  }
  
  getPdbId(): string {
    if ( this.source == 'cath' ) {
      return this.id.substr(0, 4);
    }
    else {
      return;
    }
  }
  
  filterAnnotationsByType(type: string): Annotation[] {
    return _.filter( this.annotations, { type: type.toUpperCase() } );
  }
  
  findAnnotationByType(type: string): Annotation {
    return _.find( this.annotations, { type: type.toUpperCase() } );
  }
      
}
