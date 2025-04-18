const cds = require('@sap/cds');
module.exports = async (srv) => {
    const msg = cds.i18n.messages
    srv.on('READ', 'Libri', async (req) => {
        const query = req.query;
        const libri = await cds.tx(req).run(query);
        for (const libro of libri) {
            if (libro.CopieDisponibili === 0) {
                libro.Titolo += ' (Esaurito)';
            }
        }
        return libri;
    });
    const { Libri, Autori, Generi } = srv.entities;
    srv.on('addLibro', async (req) => {
      const { Titolo, CopieDisponibili, AutoreID, GenereID } = req.data;
  
      if (!Titolo || !CopieDisponibili || !AutoreID || !GenereID) {
        return req.reject(400, {
          code: 400,
          message: msg.for('error.missingData')
          });
      }
  
      try {
        const autore = await SELECT.one.from(Autori).where({ ID: AutoreID });
        const genere = await SELECT.one.from(Generi).where({ ID: GenereID });
  
        if (!autore) {
          return req.reject(404, {
            code: 404,
            message: msg.for('error.authorNotFound', [AutoreID])
            });
        }
  
        if (!genere) {
          return req.reject(404, {
            code: 404,
            message: msg.for('error.genreNotFound', [GenereID])
            });
        }
  
        const result = await INSERT.into(Libri).entries({
          Titolo,
          CopieDisponibili,
          Autore_ID: AutoreID,
          Genere_ID: GenereID
        });
  
        return {
          code: 201,
          message: msg.for('success.bookCreated', [Titolo])
          };
  
      } catch (err) {
        console.error(err);
        return req.reject(500, {
          code: 500,
          message: msg.for('error.process', [err.message])
          });
      }
    });
    const { Prestiti } = srv.entities;
    srv.on('deleteLibro', async (req) => {
        const { ID } = req.data;
    
        if (!ID && ID !== 0) {
            return req.reject(400, {
                code: 400,
                message: msg.for('noBookID')
            });
        }
        try {
            const libro = await SELECT.from(Libri).where({ ID });
            if (!libro || libro.length === 0) {
                return req.reject(404, {
                    code: 404,
                    message: msg.for('error.bookNotFound', [ID])
                });
            }
            await DELETE.from(Prestiti).where({ 'Libri.ID': ID });
            await DELETE.from(Libri).where({ ID });
            return {
                code: 202,
                message: msg.for('success.bookDeleted', [ID])
            };
        } catch (err) {
            return req.reject(500, {
                code: 500,
                message: msg.for('error.process', [err.message])
            });
        }
    });

    const northwind_srv = await cds.connect.to("northwind");
    srv.on("READ", "Products", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Categories", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Orders", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Order_Details", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Suppliers", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Customers", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Employees", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Shippers", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "CustomerDemographics", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Territories", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
    srv.on("READ", "Regions", (req) => {
        return northwind_srv.tx(req).run(req.query);
    });
};
