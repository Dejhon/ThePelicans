var express = require('express');
const res = require('express/lib/response');
const { response } = require('../app');
const conn = require('../lib/db');
var router = express.Router();
// var connection  = require('../lib/db');

router.get('/reservation', (req, res, next)=>{
    let sql = "SELECT * FROM reservation"
    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('reserve', {
            title: "RESERVATION",
            message: req.flash('message'),
            data: rows
        });
    });
});

router.post('/reserve', (req, res, next)=>{
    resNumber = Math.floor(Math.random() * 99) +"TP"+ new Date().toJSON().slice(0,10).split('-').reverse().join('')
    customerNm = req.body.c_nm;
    let data ={
        cust_nm: req.body.c_nm,
        res_type_id: req.body.type,
        quant: req.body.qt,
        res_dt: req.body.r_dt,
        res_time: req.body.res_tm,
        res_num: resNumber
    }
    let sql ="INSERT INTO reservation SET ?"

    conn.query(sql, data, (err, rows)=>{
        if(!err){
        req.flash('message', resNumber)
        res.redirect("/bk/reservation")
        }else{
            throw err
        }
    })
})


module.exports = router;