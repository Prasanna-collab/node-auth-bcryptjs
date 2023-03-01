var express = require("express");
var router = express.Router();
const { hashing, hashCompare, role } = require("../library/auth");
const { dbUrl, MongoClient } = require("../dbConfig");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("authentication");
    const user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      res.send({ message: "User data already exists" });
    } else {
      const hash = await hashing(req.body.password);
      req.body.password = hash;
      const document = await db.collection("auth").insertOne(req.body);
      res.send({ message: "User addedd successfully" });
      // console.log(hash);
      // res.send(hash);
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

//adminlogin
router.post("/admin-login", role, async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("authentication");
    const user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const compare = await hashCompare(req.body.password, user.password);
      if (compare === true) {
        res.send({ message: "Login Successfull" });
      } else {
        res.send({ message: "Wrong Password" });
      }
    } else {
      res.send({ message: "user doesn't exist" });
    }
    // const hash = await hashCompare(
    //   req.body.password,
    //   "$2a$10$RfzwRm/EIaKcTjOFylceOubcN1sIwmturGrRVdtQ7ET0Ry0/Njb.S"
    // // );
    // console.log(hash);
    // res.send(hash);
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

//normal user login
router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("authentication");
    const user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const compare = await hashCompare(req.body.password, user.password);
      if (compare === true) {
        res.send({ message: "Login Successfull" });
      } else {
        res.send({ message: "Wrong Password" });
      }
    } else {
      res.send({ message: "user doesn't exist" });
    }
    // const hash = await hashCompare(
    //   req.body.password,
    //   "$2a$10$RfzwRm/EIaKcTjOFylceOubcN1sIwmturGrRVdtQ7ET0Ry0/Njb.S"
    // // );
    // console.log(hash);
    // res.send(hash);
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.post("/forgot-password", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("authentication");
    const user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const hash = await hashing(req.body.password);
      // req.body.password = hash;
      const document = await db
        .collection("auth")
        .updateOne({ email: req.body.email }, { $set: { password: hash } });
      res.send({ message: "Password Changed Successfully" });
    } else {
      res.send({ message: "User doesn't exist" });
    }
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

router.post("/reset-password", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("authentication");
    const user = await db.collection("auth").findOne({ email: req.body.email });
    if (user) {
      const compare = await hashCompare(req.body.oldPassword, user.password);
      if (compare === true) {
        const hash = await hashing(req.body.newPassword);
        const document = await db
          .collection("auth")
          .updateOne({ email: req.body.email }, { $set: { hash } });
        res.send({ message: "Password Changed Successfully" });
      } else {
        res.send({ message: "Incorrect Old Password" });
      }
    } else {
      res.send({ message: "User doesn't exist" });
    }
    // const hash = await hashCompare(
    //   req.body.password,
    //   "$2a$10$RfzwRm/EIaKcTjOFylceOubcN1sIwmturGrRVdtQ7ET0Ry0/Njb.S"
    // // );
    // console.log(hash);
    // res.send(hash);
  } catch (error) {
    res.send(error);
  } finally {
    client.close();
  }
});

module.exports = router;
