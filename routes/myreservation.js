var express = require('express');
const res = require('express/lib/response');
const { response } = require('../app');
const conn = require('../lib/db');
var router = express.Router();

router.get('/myreserves',(req, res)=>{
    let sql=`SELECT r.cust_nm AS Customer, r.quant AS Quantity, r.id, date_format(r.res_dt, '%Y-%m-%d') AS ReservationDT, TIME_FORMAT(r.res_time, "%h:%i:%p") AS Reservation_Time, r.res_num AS Reservation_Num, rt.type AS Reservation_Type FROM thepelicans.reservation AS r JOIN thepelicans.reservetype AS rt ON r.res_type_id = rt.id WHERE r.res_num LIKE ?`

    conn.query(sql,[req.session.numb],(err, rows)=>{
        if(err) throw err
        res.render('myreservation',{
            title:"My Reservation",
            data: rows
        });
    });
});

router.get('/delete/:id', function(req, res, next){
    let id = req.params.id
    conn.query('DELETE FROM reservation WHERE id = ?',[id], (err, rows)=>{
        if(err) throw err
        res.redirect('/bk/reservation')
    })
})

module.exports = router;