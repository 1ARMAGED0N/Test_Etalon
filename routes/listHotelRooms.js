let db = require('../service/DbConnection')

/**
 * @swagger
 * /listHotelRooms:
 *   get:
 *     summary: Получить список всех номеров
 *     responses:
 *       200:
 *          description: list hotels rooms.
 *       500:
 *          description: internal server error.
 */
/* GET list hotel rooms. */
module.exports = function(app) {
    app.get('/listHotelRooms', function (req, res, next) {
        db.SqlQuery("call All_Room()", []).then((allRoom) =>
            res.status(200).json(allRoom)
        ).catch((err) => {
                console.log(err)
                res.status(500).json({message: "Ошибка", err: err})
            }
        )
    })
};