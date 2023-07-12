import { Router } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../configs/index'
import bcrypt from 'bcrypt'
const authenRoute = Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const salt = bcrypt.genSaltSync(10);
authenRoute.get('/forgot', (req, res) => {
  res.send("What's up doc ?!");
});

const JWT_SECRET = 'some super sercet...'
authenRoute.post('/forgot', async (req, res)=> {
    const {email} = req.body;

    let user = await config.db.user.findUnique({
        where: {
          email: email,
        },
      })
     
    if (email !== user!.email){
        return res.status(404).send({
            success: false,
            message: "Invalid email",
            status_code: 404
        });
    }

    const payload = {
        email: user!.email,
        id: user!.id,

    }

    const token = jwt.sign(payload, jwtSecretKey!, {expiresIn: '15m'})
    const link = `http://localhost:3000/auth/requestReset/${token}`

    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'duongsong9a4@gmail.com',
            pass: 'onpienpgtybeenva'
        }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Freshemy',
        to: `${email}`,
        subject: 'Link verification for reseting password',
        text: 'You recieved message from ' + req.body.email,
        html: '<p>This is your link verification for your account to reset password:</b></br>' + link,
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' +  info.response);
            res.redirect('/');
        }
    });

    return res.status(200).send({
        success: true,
        message: "Request successfully	",
        status_code: 200
    });
});

authenRoute.get('/requestReset/:token', (req, res, next) => {
    const {token} = req.params;
    const decoded = jwt.verify(token, jwtSecretKey!);  
    var id = (<any>decoded).id;
    console.log(id)  
    try {
        const payload = jwt.verify(token, jwtSecretKey!);
    } catch{

    }
    res.send("What's up doc ?!");
  });
  
authenRoute.post('/requestReset/:token', async(req, res)=> {
    const {token} = req.params;
    const {newPassword, confirmPassword} = req.body;
    try {
        const decoded = jwt.verify(token, jwtSecretKey!);  
        var id = (<any>decoded).id;
        const hash = bcrypt.hashSync(newPassword, salt);
        const updateUser = await config.db.user.update({
            where: {
                id: id,
            },
            data: {
                password: hash
            },
        })
        console.log("Chúc mừng đã thay đổi password")
    } catch {
        return res.status(500).send({
            success: true,
            message: "Server down",
            status_code: 500
        });
    }
    return res.status(200).send({
        success: true,
        message: "Request successfully	",
        status_code: 200
    });
});

export default authenRoute;