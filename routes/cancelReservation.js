let db = require('../service/DbConnection')
let {isNumeric} = require('../service/formatСheck')

/**
 * @swagger
 * /cancelReservation:
 *   post:
 *     summary: Отменить регистрацию.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idRegistration:
 *                 type: string
 *                 example: '2'
 *     responses:
 *       200:
 *         description: Registration Delete.
 *       415:
 *         description: Erroneous parameters.
 *       500:
 *         description: internal server error.
 */


/* POST cancel reservation. */
module.exports = function(app) {
    app.post('/cancelReservation', function (req, res, next) {
        let idRegistration = req.body.idRegistration

        if (!isNumeric(idRegistration)) {
            res.status(415).json({message: "id некорректный"})
            return;
        }

        db.SqlQuery("call cancel_reservation(?)", [idRegistration]).then((rows) =>
            res.status(200).json({message: "Запись отменена"})
        ).catch((err) => {
            console.log(err)
            res.status(500).json({message: "Ошибка"})
        })
    })
};
