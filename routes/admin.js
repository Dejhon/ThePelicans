var express = require('express');
const res = require('express/lib/response');
const { response } = require('../app');
const conn = require('../lib/db');
var router = express.Router();

router.get('/allReserves', (req, res)=>{
    let sql = "SELECT UCASE(r.cust_nm) AS Customer, r.quant AS Quantity, r.id, date_format(r.res_dt, '%Y-%m-%d') AS ReservationDT, TIME_FORMAT(r.res_time, '%h:%i:%p') AS Reservation_Time, r.res_num AS Reservation_Num, rt.type AS Reservation_Type FROM thepelicans.reservation AS r JOIN thepelicans.reservetype AS rt ON r.res_type_id = rt.id"
    conn.query(sql, (err, rows)=>{
        if(err) throw err
          res.render("adminView", {
              title: "RESERVATIONS",
              data: rows
          });
    });
});

router.get('/Edit/:id', (req, res)=>{
    let sql = `SELECT quant AS Quantity, date_format(res_dt, '%Y-%m-%d') AS date, res_time AS time, id AS id FROM reservation WHERE id = ${req.params.id}`
    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('reservationEdit', {
            data: rows[0]
        })
    })
})

router.post('/update', (req, res)=>{
    let qt = req.body.qt
    let date = req.body.date
    let time = req.body.time
    conn.query("UPDATE reservation SET quant='" +req.body.qt+"', res_dt='"+req.body.date+"', res_time='"+req.body.time+"' WHERE  id= "+req.body.id, (err, rows)=>{
        if(err) throw err
        res.redirect("/ad/allReserves")
    })
})

router.get('/delete/:id', function(req, res, next){
    let id = req.params.id
    conn.query('DELETE FROM reservation WHERE id = ?',[id], (err, rows)=>{
        if(err) throw err
        res.redirect('/ad/allReserves')
    })
})

router.get('/dates', (req, res)=>{
    conn.query('SELECT * FROM reservation', (err, rows)=>{
        if(err) throw err
        res.render('Dates',{
            data: rows
        })
    })
})

router.post('/resdt', (req, res)=>{
    conn.query('SELECT date_format(res_dt, "%Y-%m-%d") AS Date, count(cust_nm) AS total from thepelicans.reservation where res_dt =?',[req.body.resDT], (err, rows)=>{
        if(err) throw err
        res.render('ReservationDates',{
            data: rows
        })
    })
})


 router.get('/logout', function (req, res) {
    req.session.destroy(()=>{
        res.redirect('/auth/admin')
    });
 });

module.exports = router;
