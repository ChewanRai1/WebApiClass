//fir sending rquest
const request = require("supertest");

//server main file(index.js)
const app = require("../index");

//testing token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjdiNmFkMDY0ZGYyNDY3MzZjNTQxZCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkyMDM0NzB9.cxuget_5Rg-Pz3WEaN7Z9D817DdXi9UaY5YPnoVunNI";

//Making test collection
//describe is the collection of test cases
// (It) is a function that is used to define a test case
describe("API Testing", () => {
  //Test case 1(/test)
  it("GET/test|Response text", async () => {
    //making api request to /test
    const response = await request(app).get("/test");
    //out response should have 200 status code
    expect(response.statusCode).toBe(200);

    //Test Api is working...
    expect(response.text).toEqual("Test API is working....!");
  });

  // get all products
  it("GET/api/product/get_all_products | Fetch all products", async () => {
    const response = (
      await request(app).get("/api/product/get_all_products")
    ).set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Product fetched successfully!");
  });

  //Register API- Post
  it("POST/api/user/create | Response with message", async () => {
    const response = await request(app).post("/api/user/create").send({
      firstName: "Chewan",
      lastName: "Rai",
      email: "crai@gmail.com",
      password: "123qwe",
    });

    //id already exist
    if (!response.body.success) {
      expect(response.body.message).toEqual("User Already Exists!");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body)
        .expect(response.body.message)
        .toEqual("User Created successfully");
    }
  });
  // it("POST/api/user/login | Login User", async () => {
  //   const response = await request(app)
  //     .post("/api/user/login")
  //     .send({
  //       email: "crai@gmail.com",
  //       password: "123qwe",
  //     });

  //   // Check if the response status code is 200
  //   expect(response.statusCode).toBe(200);

  //   // Check if the response body contains the user data
  //   expect(response.body).toBeDefined();
  //   expect(response.body.success).toBe(true);
  //   expect(response.body.token).toBeDefined();
  //   expect(response.body.user).toBeDefined();
  //   expect(response.body.user.fName).toEqual("Chewan");
  //   expect(response.body.user.lName).toEqual("Rai");
  //   expect(response.body.user.email).toEqual("crai@gmail.com");
  // });
});

//Task
//Login test
//Update product(try)
