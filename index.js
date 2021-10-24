const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const {User} = require('./models/User');
const bodyParser = require('body-parser');
const config = require('./config/key');

const cookieParser = require('cookie-parser');



app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI).then(()=>{
    console.log('MongoDB Connected...')
}).catch(err=>console.log(err))


app.get('/', function(req, res) {
  res.send('hello world~~~~~~~~~~~');
});

app.post('/register', (req, res)=>{

    //회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다

    const user = new User(req.body);
    user.save((err, doc)=>{
        if(err) return res.json({success : false, err})
        return res.status(200).json({
            success : true
        })
    });


})

app.post('/login', (req,res)=>{
    User.findOne({email:req.body.email}, (err, user)=>{
        if(!user) 
       
            { 
                return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다"
            })
        }
            user.comparePassword(req.body.password, (err, isMatch)=>{
                if(!isMatch)
                    return res.json({loginSuccess : false, message : "비밀번호가 틀렸습니다"})
                
                    
                user.generateToken((err, user)=>{
                    if(err) return res.status(400).send(err)
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess : true, userId : user._id})
                    
                    

                })
            
            })
        
    })
}) 


app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
});



