using com.sap.libreria as db from '../db/schema';
using {northwind} from './external/northwind';

@path: 'backend'
service CatalogoServizio {
    @readonly
    entity Libri    as projection on db.Libri;

    @readonly
    entity Autori   as projection on db.Autori;

    @readonly
    entity Generi   as projection on db.Generi;

    @readonly
    entity Utenti   as projection on db.Utenti;

    @readonly
    entity Prestiti as projection on db.Prestiti;

    //esempio di function
    type LibroOutput {
        ID               : Integer;
        Titolo           : String;
        CopieDisponibili : Integer;
        Autore_ID        : Integer;
        Genere_ID        : Integer;
    }

    function LibriPerAutore(ID : Integer) returns array of LibroOutput;
}

@path: 'northwind'
service NorthwindService {
    @readonly
    entity Products as projection on northwind.Products;
}