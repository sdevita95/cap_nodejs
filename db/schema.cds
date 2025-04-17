namespace com.sap.libreria;

entity Libri {
  key ID : Integer;
  Titolo  : String;
  CopieDisponibili  : Integer;
  Autore : Association to Autori;
  Genere : Association to Generi;
  Prestiti : Composition of many Prestiti on Prestiti.Libri = $self;
}

entity Autori {
  key ID : Integer;
  Nome : String;
  DataNascita : Date;
  Nazionalita : String;
  Libri : Composition of many Libri on Libri.Autore = $self;
}

entity Generi {
  key ID : Integer;
  Nome : String;
  Libri : Composition of many Libri on Libri.Genere = $self;
}

entity Utenti {
  key ID : Integer;
  Nome : String;
  Email : String;
  Prestiti : Composition of many Prestiti on Prestiti.Utente = $self;
}

entity Prestiti {
  key ID : Integer;
  DataPrestito : DateTime;
  DataRestituzione : DateTime;
  Libri : Association to Libri;
  Utente : Association to Utenti;
  Restituito : Boolean;
}