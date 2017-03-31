import { Domain } from '../domain';

type PdbId = string;

export interface IAnnotation {
  asAnnotation: () => Annotation;
}

export class IAnnotationParams {
  id: string;
  type: string;
  description?: string;
}

export class Annotation {
  type: string;
  id: string;
  description?: string;
  
  constructor(opts?: IAnnotationParams) {
    if ( opts ) {
      this.type = opts.type;
      this.id = opts.id;
      this.description = opts.description;
    }
  }
}

export class IStructuralAnnotationParams {
  id: string;
  type: string;
  description?: string;
}

export class StructuralAnnotation extends Annotation {
  pdbId: PdbId;
  pdbDomain: Domain;
  constructor() {
    super();
  }
}

export class IGoAnnotation {
  id: string;
  name: string;
  definition: string;
  synonym?: string;
  isa?: string[];
}

export class GoAnnotation implements IAnnotation {
  id: string;
  name: string;
  definition: string;
  synonym: string;
  isa: string[] = [];
  
  constructor(opts?: IGoAnnotation) {
    if (opts) {
      this.id = opts.id;
      this.name = opts.name;
      this.definition = opts.definition;
      this.synonym = opts.synonym || '';
      this.isa = opts.isa || [];
    }
  }
  
  asAnnotation(): Annotation {
    return new Annotation( { type: 'GO', id: this.id, description: this.definition } );
  }
}

export class IEcAnnotation {
  id: string;
  name: string;
  definition: string;
  synonym?: string;
  isa?: string[];
}

export class EcAnnotation implements IAnnotation {
  id: string;
  name: string;
  definition: string;
  synonym: string;
  isa: string[] = [];
  
  constructor(opts?: IGoAnnotation) {
    if (opts) {
      this.id = opts.id;
      this.name = opts.name;
      this.definition = opts.definition;
      this.synonym = opts.synonym || '';
      this.isa = opts.isa || [];
    }
  }
  
  asAnnotation(): Annotation {
    return new Annotation( { type: 'GO', id: this.id, description: this.definition } );
  }
}
