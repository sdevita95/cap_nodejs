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

      const lastLibro = await SELECT.one.from(Libri).columns('ID').orderBy('ID desc');
      const newID = lastLibro?.ID ? lastLibro.ID + 1 : 1;
      await INSERT.into(Libri).entries({
        ID: newID,
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
  srv.on('updateLibro', async (req) => {
    const { ID, Genere_ID } = req.data;

    if (!ID) {
      return req.reject(400, { code: 400, message: msg.for('error.missingId') });
    }
    if (!Genere_ID) {
      return req.reject(400, { code: 400, message: msg.for('error.missingData') });
    }

    try {
      await UPDATE(Libri).set({ Genere_ID }).where({ ID });
      const [libro] = await SELECT.from(Libri).where({ ID });
      return {
        code: 200,
        message: msg.for('success.bookUpdated', [libro.Titolo])
      };

    } catch (err) {
      console.error(err);
      return req.reject(500, { code: 500, message: msg.for('error.process', [err.message]) });
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

};