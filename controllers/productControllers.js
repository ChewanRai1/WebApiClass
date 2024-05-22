const createProduct = (req,res) =>{
    // res.send ("Product API is _working..!")
    //check incoming data 
    console.log(req.body)
    console.log(req.files)

    //Destructuring , validation
        // #. Destruction
        const {productName, productPrice, productDescription, productCategory, productImage} =req.body;
        // 2. validation
        if(!productName || !productPrice || !productDescription || !productCategory || !productImage){
            return res.json({
                "success": false,
                "message" : "please enter all fields!"
            })
        }

}

module.exports = {
    createProduct
}