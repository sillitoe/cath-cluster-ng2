import { Uniprot } from './uniprot';
import { Utils } from './helper/utils';

var uniprot: string = 
`
ID   COAD_THEMA              Reviewed;         161 AA.
AC   Q9WZK0;
DT   30-MAY-2000, integrated into UniProtKB/Swiss-Prot.
DT   01-NOV-1999, sequence version 1.
DT   15-MAR-2017, entry version 123.
DE   RecName: Full=Phosphopantetheine adenylyltransferase {ECO:0000255|HAMAP-Rule:MF_00151};
DE            EC=2.7.7.3 {ECO:0000255|HAMAP-Rule:MF_00151};
DE   AltName: Full=Dephospho-CoA pyrophosphorylase {ECO:0000255|HAMAP-Rule:MF_00151};
DE   AltName: Full=Pantetheine-phosphate adenylyltransferase {ECO:0000255|HAMAP-Rule:MF_00151};
DE            Short=PPAT {ECO:0000255|HAMAP-Rule:MF_00151};
GN   Name=coaD {ECO:0000255|HAMAP-Rule:MF_00151}; Synonyms=kdtB;
GN   OrderedLocusNames=TM_0741;
OS   Thermotoga maritima (strain ATCC 43589 / MSB8 / DSM 3109 / JCM 10099).
OC   Bacteria; Thermotogae; Thermotogales; Thermotogaceae; Thermotoga.
OX   NCBI_TaxID=243274;
RN   [1]
RP   NUCLEOTIDE SEQUENCE [LARGE SCALE GENOMIC DNA].
RC   STRAIN=ATCC 43589 / MSB8 / DSM 3109 / JCM 10099;
RX   PubMed=10360571; DOI=10.1038/20601;
RA   Nelson K.E., Clayton R.A., Gill S.R., Gwinn M.L., Dodson R.J.,
RA   Haft D.H., Hickey E.K., Peterson J.D., Nelson W.C., Ketchum K.A.,
RA   McDonald L.A., Utterback T.R., Malek J.A., Linher K.D., Garrett M.M.,
RA   Stewart A.M., Cotton M.D., Pratt M.S., Phillips C.A., Richardson D.L.,
RA   Heidelberg J.F., Sutton G.G., Fleischmann R.D., Eisen J.A., White O.,
RA   Salzberg S.L., Smith H.O., Venter J.C., Fraser C.M.;
RT   "Evidence for lateral gene transfer between Archaea and Bacteria from
RT   genome sequence of Thermotoga maritima.";
RL   Nature 399:323-329(1999).
CC   -!- FUNCTION: Reversibly transfers an adenylyl group from ATP to 4'-
CC       phosphopantetheine, yielding dephospho-CoA (dPCoA) and
CC       pyrophosphate. {ECO:0000255|HAMAP-Rule:MF_00151}.
CC   -!- CATALYTIC ACTIVITY: ATP + pantetheine 4'-phosphate = diphosphate +
CC       3'-dephospho-CoA. {ECO:0000255|HAMAP-Rule:MF_00151}.
CC   -!- PATHWAY: Cofactor biosynthesis; coenzyme A biosynthesis; CoA from
CC       (R)-pantothenate: step 4/5. {ECO:0000255|HAMAP-Rule:MF_00151}.
CC   -!- SUBUNIT: Homohexamer. {ECO:0000255|HAMAP-Rule:MF_00151}.
CC   -!- SUBCELLULAR LOCATION: Cytoplasm {ECO:0000255|HAMAP-Rule:MF_00151}.
CC   -!- SIMILARITY: Belongs to the bacterial CoaD family.
CC       {ECO:0000255|HAMAP-Rule:MF_00151}.
CC   -----------------------------------------------------------------------
CC   Copyrighted by the UniProt Consortium, see http://www.uniprot.org/terms
CC   Distributed under the Creative Commons Attribution-NoDerivs License
CC   -----------------------------------------------------------------------
DR   EMBL; AE000512; AAD35822.1; -; Genomic_DNA.
DR   PIR; H72339; H72339.
DR   RefSeq; NP_228550.1; NC_000853.1.
DR   RefSeq; WP_004080981.1; NZ_CP011107.1.
DR   PDB; 1VLH; X-ray; 2.20 A; A/B/C/D/E/F=1-161.
DR   PDBsum; 1VLH; -.
DR   ProteinModelPortal; Q9WZK0; -.
DR   SMR; Q9WZK0; -.
DR   STRING; 243274.TM0741; -.
DR   DrugBank; DB03912; 4'-Phosphopantetheine.
DR   EnsemblBacteria; AAD35822; AAD35822; TM_0741.
DR   GeneID; 898408; -.
DR   KEGG; tma:TM0741; -.
DR   PATRIC; 23936402; VBITheMar51294_0754.
DR   eggNOG; ENOG4108ZEF; Bacteria.
DR   eggNOG; COG0669; LUCA.
DR   InParanoid; Q9WZK0; -.
DR   KO; K00954; -.
DR   OMA; EFQMALM; -.
DR   UniPathway; UPA00241; UER00355.
DR   EvolutionaryTrace; Q9WZK0; -.
DR   Proteomes; UP000008183; Chromosome.
DR   GO; GO:0005737; C:cytoplasm; IEA:UniProtKB-SubCell.
DR   GO; GO:0005524; F:ATP binding; IEA:UniProtKB-KW.
DR   GO; GO:0004595; F:pantetheine-phosphate adenylyltransferase activity; IEA:UniProtKB-EC.
DR   GO; GO:0015937; P:coenzyme A biosynthetic process; IEA:UniProtKB-UniPathway.
DR   CDD; cd02163; PPAT; 1.
DR   Gene3D; 3.40.50.620; -; 1.
DR   HAMAP; MF_00151; PPAT_bact; 1.
DR   InterPro; IPR004821; Cyt_trans-like.
DR   InterPro; IPR001980; LPS_biosynth.
DR   InterPro; IPR014729; Rossmann-like_a/b/a_fold.
DR   Pfam; PF01467; CTP_transf_like; 1.
DR   PRINTS; PR01020; LPSBIOSNTHSS.
DR   TIGRFAMs; TIGR01510; coaD_prev_kdtB; 1.
DR   TIGRFAMs; TIGR00125; cyt_tran_rel; 1.
PE   1: Evidence at protein level;
KW   3D-structure; ATP-binding; Coenzyme A biosynthesis; Complete proteome;
KW   Cytoplasm; Nucleotide-binding; Nucleotidyltransferase;
KW   Reference proteome; Transferase.
FT   CHAIN         1    161       Phosphopantetheine adenylyltransferase.
FT                                /FTId=PRO_0000156296.
FT   STRAND        2      7       {ECO:0000244|PDB:1VLH}.
FT   HELIX        14     24       {ECO:0000244|PDB:1VLH}.
FT   STRAND       28     35       {ECO:0000244|PDB:1VLH}.
FT   HELIX        46     56       {ECO:0000244|PDB:1VLH}.
FT   TURN         57     59       {ECO:0000244|PDB:1VLH}.
FT   STRAND       63     68       {ECO:0000244|PDB:1VLH}.
FT   HELIX        72     79       {ECO:0000244|PDB:1VLH}.
FT   STRAND       83     88       {ECO:0000244|PDB:1VLH}.
FT   HELIX        94    107       {ECO:0000244|PDB:1VLH}.
FT   STRAND      112    117       {ECO:0000244|PDB:1VLH}.
FT   HELIX       120    122       {ECO:0000244|PDB:1VLH}.
FT   HELIX       127    135       {ECO:0000244|PDB:1VLH}.
FT   TURN        141    143       {ECO:0000244|PDB:1VLH}.
FT   HELIX       146    155       {ECO:0000244|PDB:1VLH}.
SQ   SEQUENCE   161 AA;  18249 MW;  4A0F62B9D368496F CRC64;
     MKAVYPGSFD PITLGHVDII KRALSIFDEL VVLVTENPRK KCMFTLEERK KLIEEVLSDL
     DGVKVDVHHG LLVDYLKKHG IKVLVRGLRA VTDYEYELQM ALANKKLYSD LETVFLIASE
     KFSFISSSLV KEVALYGGDV TEWVPPEVAR ALNEKLKEGK R
//
`;

export var UNIPROT: Uniprot = Utils.parseUniprot( uniprot );
