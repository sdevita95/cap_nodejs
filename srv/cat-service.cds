using com.sap.libreria as db from '../db/schema';
using {northwind} from './external/northwind';

@path: 'backend'
service CatalogoServizio {

    entity Libri    as projection on db.Libri;
    entity Autori   as projection on db.Autori;
    entity Generi   as projection on db.Generi;
    entity Utenti   as projection on db.Utenti;
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
    entity Products as projection on northwind.Products;
    entity Categories as projection on northwind.Categories;
    entity Orders as projection on northwind.Orders;
    entity Order_Details as projection on northwind.Order_Details;
    entity Suppliers as projection on northwind.Suppliers;
    entity Customers as projection on northwind.Customers;
    entity Employees as projection on northwind.Employees;
    entity Shippers as projection on northwind.Shippers;
    entity CustomerDemographics as projection on northwind.CustomerDemographics;
    entity Territories as projection on northwind.Territories;
    entity Regions as projection on northwind.Regions;
}
