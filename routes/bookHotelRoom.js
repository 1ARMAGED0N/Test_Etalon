let db = require('../service/DbConnection')
let {isValidDate, isNumeric} = require('../service/formatСheck')

/**
 * @swagger
 * /bookHotelRoom:
 *   post:
 *     summary: Забранировать номер на период.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idRoom:
 *                 type: string
 *                 example: '1'
 *               checkIn:
 *                 type: string
 *                 example: '2023-07-12'
 *               checkOut:
 *                 type: string
 *                 example: '2023-07-12'
 *               guestData:
 *                type: string
 *                example: 'foo'
 *     responses:
 *       200:
 *         description: list available hotels rooms.
 *       415:
 *         description: Erroneous parameters.
 *       500:
 *         description: internal server error.
 */


/* POST book hotel room. */
module.exports = function(app) {
    app.post('/bookHotelRoom', function (req, res, next) {
        let checkIn = req.body.checkIn
        let checkOut = req.body.checkOut
        let idRoom = req.body.idRoom
        let guestData = req.body.guestData
        let isVip = 0

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
        if(!isNumeric(idRoom)){
            res.status(415).json({message: "id некорректный"})
            return;
        }
        db.SqlQuery("call Available_rooms_for_period(Date(?),Date(?))", [checkIn, checkOut]).then((allAvailableRoom) =>{
            let room = allAvailableRoom.find(room => room.id == idRoom)
            console.log(allAvailableRoom)
            if (typeof room !== 'undefined')
            {
                fetch('https://randstuff.ru/number/')
                    .then(response => response.text())
                    .then(isVipJson => isVip = 0 )// isVip = isVipJson.isVip
                    .then(()=>{
                        db.SqlQuery("call book_room(?,Date(?),Date(?),?,?)",
                            [idRoom, checkIn, checkOut, guestData, isVip]).then(() =>
                            res.status(200).json({message: "Запись успешна"})
                        ).catch((err) => {
                            console.log(err)
                            res.status(500).json({message: "Ошибка"})
                        })
                    });
            }
            else{
                res.status(415).json({message: "Номер занят"})
                return;
            }
        }).catch((err) => {
            console.log(err)
            res.status(500).json({message: "Ошибка"})
        })


    })
};