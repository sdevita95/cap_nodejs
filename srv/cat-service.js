const cds = require('@sap/cds');
module.exports = async (srv) => {
    //internal backend method
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

    const { Libri } = srv.entities;
    srv.on('LibriPerAutore', async (req) => {
        const { ID } = req.data;
        if (!ID && ID !== 0) {
            return req.reject(400, "error.noAuthorID");
        }
        return await SELECT.from(Libri).where({ Autore_ID: ID });
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
