const User = require('../models/userModels');
const userModel = require('../models/userModels')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
// Make a functon (Logic)

// 1. creating user function

const createUser = async(req,res) => {
    // res.send("Create API is working")
    // 1. Get data from the user (Fname, lname, email,pp)
    console.log(req.body)

    

    // #. Destruction
    const {firstName, lastName,email,password} =req.body;
    // 2. validation
    if(!firstName || !lastName || !email || !password){
        return res.json({
            "success": false,
            "message" : "please enter all fields!"
        })
    }
    // error handling= Try and Catch
    try {
    // 2.1 if not : send the reponse and stop the process
    // 3. if proper data 
    // 4. check existing User
    const existingUser = await userModel.findOne({email : email})
    if(existingUser){
        res.json({
            "success" : false,
            "message": "User Already Exists!"
        })
    }

    //Hashing / Encrypt the Password
    const randomSalt = await bcrypt.genSalt(10)
    const hashPassword  = await bcrypt.hash(password,randomSalt)


    // 4.1 if yes : Send the response and stop the process
    //  if not:
    // 5. Save in the database
    const newUser = new userModel({
        //fields : Values received form user
        firstName : firstName,
        lastName : lastName,
        email: email,
        password : hashPassword
    })

    //Actually save the user in database
    await newUser.save()
    // 6. send the succes response
    res.json({
        "success" : true,
        "message": "User Created successfully"
    })
    

    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message" : "internal server error!"
        })
    }
    
}
//2. Login user function
const loginUser = async(req,res) => {
    // res.send("Login user API is working")
    //check incoming data :pass
    console.log(req.body)

    // #. Destruction
    const {email,password} =req.body;
    // 2. validation
    if(!email || !password){
        return res.json({
            "success": false,
            "message" : "please enter both fields!"
        })
    }
    try {
        //1.find user, if not : stop the process
        const user = await userModel.findOne({email:email})
        if(!user){
            return res.json({
                "sucess": false,
                "message ": "User not found!"
            })
        }

        //2. compare the password, if not : stop the process
        const isValidPassword = await bcrypt.compare(password,user.password)
        if(!isValidPassword){
            return res.json({
                "sucess": false,
                "message ": "Incorrect Password!"
            })
        }

        //3. Generate JWT token
        //3.1 Secret Decryption Key (.env)
        const token = await jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET
        )
        //4. Send the token, userData, Message to the user

        res.json({
            "success" : true,
            "message" : "Login succesful",
            "token" : token,
            "userData": user
        })
    }catch(error){
        console.log(error)
        res.json({
            "success" : false,
            "message": "Internal Server Error!"
        })
    }
}

//3. Update profile
//4. Change Password



//exporting 
// module.exports = createUser  // only for create user

module.exports = {
    createUser,
    loginUser
}