import { PdbBindingSiteResidue } from './pdb-binding-site-residue';
import { PdbLigandResidue } from './pdb-ligand-residue';

export class PdbBindingSite {
  site_id: string;
  site_residues: PdbBindingSiteResidue[];
  evidence_code: string;
  details: string;
  ligand_residues: PdbLigandResidue[];
}

