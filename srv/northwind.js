const cds = require("@sap/cds");
module.exports = async (srv) => {
  const service = await cds.connect.to("northwind");

  srv.on("READ", "Products", (req) => {
    return service.tx(req).run(req.query);
  });
};