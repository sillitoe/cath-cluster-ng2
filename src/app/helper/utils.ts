import { Member } from '../members/member';
import { Annotation } from '../annotations/annotation';
import { Uniprot } from '../uniprot';

export class Utils {
    
  static parseUniprot(uniprot_raw: string) : Uniprot {
    
    var uniprot_lines = uniprot_raw.split('\n');
    
    var accession: string, 
      organism: string, 
      gene_id: string,
      aa_count: number, 
      recommended_name: string,
      alternative_names: string[],
      annotations: Annotation[],
      gene_name: string,
      organism_classification: string[]
      ;
      
    var ec_match = /EC=([0-9.]+)/;
    var recname_match = /RecName: Full=(.*?);/;
    var altname_match = /AltName: Full=(.*?);/;
    var genename_match = /Name=(\w+)/;
    
    uniprot_lines.forEach( function(line_raw, line_number){
      var line_parts = line_raw.split(/\s+/, 2);
      var code = line_parts[0];
      var line = line_parts[1].replace('\n', '');
      
      switch (code) {
        case 'ID':
          var parts = line.split(/\s+/);
          gene_id = parts[0];
          aa_count = parseInt( parts[1] );
          break;
        case 'AC':
          accession = line.replace(';', '');
          break;
        case 'DE':
          var ec = line.match( ec_match );
          if ( ec ) {
            annotations.push( {
              type: 'EC',
              id: ec[1],
              description: null,
            })
          }
          var recname = line.match( recname_match );          
          if (recname) {
            recommended_name = recname[1];
          }
          var altname = line.match( altname_match );          
          if (altname) {
            alternative_names.push( altname[1] );
          }
          break;
        case 'GN':
          var name = line.match( genename_match );        
          if (name) {
            gene_name = name[1];
          }
          break;
        case 'OC':
          organism_classification = line.replace(/.$/, '').split( /;\s*/ );
          break;
      }
      
    });

    var uniprot: Uniprot = {
      accession,
      organism,      
      gene_name,
      gene_id,
      aa_count,
      recommended_name,
      alternative_names,
      organism_classification,
      annotations,
    };
    
    return uniprot;
  }

  static parseFasta(fasta_raw: string) : Member[] {

    //console.log( "fasta_raw", fasta_raw, fasta_raw.split('\n') );

    var lines: string[] = fasta_raw.split(/\n/);
    
    var members: Member[] = [];
     
    while( lines.length > 0 ) {

      var annotations: Annotation[] = [];
      
      var header: string = lines.shift().replace(/\n$/, '');
      var sequence: string;
      while ( lines.length > 0 && lines[0].charAt(0) != '>' ) {
        sequence += lines.shift().replace(/\n$/, '');
      }
      
      var header_parts: string[] = header.split(/\s+/);
      
      var id_raw: string = header_parts[0];
      var annotations_raw: string = header_parts[1];
      var id_parts: string[] = id_raw.replace( /^>/, '' ).split('|');
            
      var annotation_types: string[] = annotations_raw.split(';');
      var organism: string = 'unknown';
      annotation_types.forEach( function(annotation_type_raw) {
        var annotation_type_parts = annotation_type_raw.split('=');
        var annotation_type = annotation_type_parts[0];
        var annotation_ids = annotation_type_parts[1].split(',');
        
        annotation_ids.forEach( function(id) {
          if ( annotation_type == 'ORG' ) {
            organism = id;
          }
          else {
            var annotation: Annotation = {
              type: annotation_type,
              id,
              description: id          
            }
            annotations.push( annotation );          
          }
        });
      });
      
      var member: Member = {
        id: id_parts[2],
        label: '',
        source: id_parts[0],
        db_version: id_parts[1],
        organism,
        annotations,
        sequence: sequence,
      };
      members.push( member );
    }

    return members;
  }
}