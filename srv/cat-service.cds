using com.sap.libreria as db from '../db/schema';

@path: 'backend'
service CatalogoServizio {

    entity Libri    as projection on db.Libri;

    action addLibro(Titolo: String,
                    CopieDisponibili: Integer,
                    AutoreID: Integer,
                    GenereID: Integer)                  returns {
        code    : Integer;
        message : String;
    };

    action deleteLibro(ID: Integer)                     returns {
        code    : Integer;
        message : String;
    };

    action updateLibro(ID: Integer, Genere_ID: Integer) returns {
        code    : Integer;
        message : String;
    };

    entity Autori   as projection on db.Autori;
    entity Generi   as projection on db.Generi;
    entity Utenti   as projection on db.Utenti;
    entity Prestiti as projection on db.Prestiti;
}
