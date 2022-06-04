var express = require('express');
const res = require('express/lib/response');
const { response } = require('../app');
const conn = require('../lib/db');
var router = express.Router();

router.get('/custlogin', (req, res)=>{
    res.render('login',{
        title: "Reservation Login"
    })
})

router.post('/customer', (req, res)=>{
    let full_nm = req.body.f_nm;
    let res_no = req.body.resNum;
    conn.query('SELECT * FROM reservation WHERE BINARY cust_nm = ? AND BINARY res_num = ?', [full_nm, res_no], (err, rows)=>{
        if(err) throw err
        if (rows.length <= 0) {
            res.redirect('/auth/custlogin')
        }else{
            req.session.loggedin = true;
            req.session.numb = res_no;
            // req.session.user_id = rows[0].id;
            res.redirect('/rs/myreserves');
        };            
    });        
});

router.get('/admin', (req, res)=>{
    let sql = "SELECT * from user"
    conn.query(sql, (err,rows)=>{
        if(err) throw err
        res.render('adminLogin', {
            title:"Admin"
        })
    })
})

router.post('/adminlogin', (req, res)=>{
    let username = req.body.user_nm
    let password = req.body.password

    conn.query('SELECT * FROM user WHERE user_nm = ? AND password = ?',[username, password], (err, rows)=>{
        if(err) throw err
        if (rows.length <= 0) {
            res.redirect('/auth/admin')
        }else{
            req.session.loggedin = true;
            req.session.user_nm = username;
            // req.session.user_id = rows[0].id;
            res.redirect('/ad/allReserves');
        };     
    })
})

module.exports = router;
