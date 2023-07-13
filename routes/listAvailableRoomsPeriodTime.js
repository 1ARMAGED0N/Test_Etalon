let db = require('../service/DbConnection')
let {isValidDate} = require('../service/formatСheck')

/**
 * @swagger
 * /listAvailableRooms:
 *   post:
 *     summary: Получить список всех свободных номеров за период.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkIn:
 *                 type: string
 *                 example: '2023-07-12'
 *               checkOut:
 *                 type: string
 *                 example: '2023-07-12'
 *     responses:
 *       200:
 *         description: list available hotels rooms.
 *       415:
 *         description: Erroneous parameters.
 *       500:
 *         description: internal server error.
 */


/* POST list available hotel rooms. */
module.exports = function(app) {
    app.post('/listAvailableRooms', function (req, res, next) {
        let checkIn = req.body.checkIn
        let checkOut = req.body.checkOut

        if (!isValidDate(checkIn)){
            res.status(415).json({message: "Приведите дату заселения к типу : Дата"})
            return;
        }
        if (!isValidDate(checkOut)){
            res.status(415).json({message: "Приведите дату выселения к типу : Дата"})
            return;
        }
        if(new Date(checkIn) > new Date(checkOut)){
            res.status(415).json({message: "Дата начала заселения должна быть позже даты выселения"})
            return;
        }

        db.SqlQuery("call Available_rooms_for_period(Date(?),Date(?))", [checkIn, checkOut]).then((allAvailableRoom) =>
            res.status(200).json(allAvailableRoom)
        ).catch((err) => {
            console.log(err)
            res.status(500).json({message: "Ошибка"})
        })
    })
};

/* MySql procedure
SELECT h.id, h.room_number, h.description
from hotel_room as h LEFT JOIN check_in
on h.id = check_in.id_hotel_room
where NOT EXISTS(
    SELECT true
    FROM check_in as c
    where c.id_hotel_room = h.id
    AND (
        c.valid_registration = true AND
        new_chek_in BETWEEN c.check_in AND c.check_out OR
        new_chek_out BETWEEN c.check_in AND c.check_out OR
        c.check_in BETWEEN new_chek_in AND new_chek_out OR
        c.check_out BETWEEN new_chek_in AND new_chek_out
   )
) GROUP BY h.id;
 */