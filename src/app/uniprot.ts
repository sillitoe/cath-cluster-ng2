import { Annotation } from './annotations/annotation';

export class Uniprot {
    accession: string;
    organism: string;
    gene_name: string;
    gene_id: string;
    aa_count: number;
    recommended_name: string;
    alternative_names: string[];
    organism_classification: string[];
    annotations: Annotation[];
}