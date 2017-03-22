export class Utils {
  static parsePdbDate(date: string): Date {
    return new Date( parseInt(date.substr(0, 4)), parseInt(date.substr(4,2)) + 1, parseInt(date.substr(6,2)) );
  }
}

export class PdbSummary {
  title: string;
  release_date: Date = new Date();
  experimental_method: string;
  revision_date: Date = new Date();
  entry_authors: string[];
  deposition_site: string;
  number_of_entities: {};
  deposition_date: Date = new Date();
}

export class MutatedResidue {
  entity_id: string;
  residue_number: number;
  author_residue_number: number;
  chain_id: string;
  author_insertion_code: string;
  mutation_details: { to: string, from: string, type: string };
  chem_comp_id: string;
  struct_asym_id: string;
}

export class LigandResidue {
  entity_id: number;
  residue_number: number;
  author_insertion_code: string;
  chain_id: string;
  author_residue_number: number;
  chem_comp_id: string;
  struct_asym_id: string;
}

export class BindingSiteResidue {
  entity_id: number;
  residue_number: number;
  author_insertion_code: string;
  symmetry_symbol: string;
  chem_comp_id: string;
  author_residue_number: number;
  chain_id: string;
  struct_asym_id: string;
}

export class BindingSite {
  site_id: string;
  site_residues: BindingSiteResidue[];
  evidence_code: string;
  details: string;
  ligand_residues: LigandResidue[];
}
