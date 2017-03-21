
export class PdbMutatedResidue {
  entity_id: string;
  residue_number: number;
  author_residue_number: number;
  chain_id: string;
  author_insertion_code: string;
  mutation_details: { to: string, from: string, type: string };
  chem_comp_id: string;
  struct_asym_id: string;
}

