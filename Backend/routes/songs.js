var express = require('express');
var Sequelize = require('sequelize');
var Song = require('../models/song');

var router = express.Router();
var Op = Sequelize.Op;

router.get('/', async function (req, res) {
  try {
    var page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    var limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    var search = (req.query.search || '').trim();
    var offset = (page - 1) * limit;

    var where = {};
    if (search) {
      where = {
        [Op.or]: [
          { nombre: { [Op.like]: '%' + search + '%' } },
          { artista: { [Op.like]: '%' + search + '%' } },
        ],
      };
    }

    var result = await Song.findAndCountAll({
      where: where,
      offset: offset,
      limit: limit,
      order: [['id', 'DESC']],
    });

    var totalItems = result.count;
    var totalPages = Math.max(1, Math.ceil(totalItems / limit));

    res.json({
      songs: result.rows,
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al listar canciones' });
  }
});

router.post('/', async function (req, res) {
  try {
    var nombre = (req.body.nombre || '').trim();
    var artista = (req.body.artista || '').trim();

    if (!nombre || !artista) {
      return res
        .status(400)
        .json({ message: 'Los campos nombre y artista son obligatorios' });
    }

    var song = await Song.create({ nombre: nombre, artista: artista });
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cancion' });
  }
});

module.exports = router;
