var express = require("express");
var router = express.Router();

var upload = require("../middleware/fileload");
var TeachableMachine = require("@sashido/teachablemachine-node");
/* GET home page. */
router.post("/", upload.single("attachment"), function (req, res, next) {
  // console.log(req.file);
  const fileURL =
    "http://localhost:3000/" + "static/images/" + req.file.filename;
  const model = new TeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/_xM4N2Lrg/",
  });

  const error = (error) => {
    console.log(error);
    res.status(400).json({
      status: res.statusCode,
      msg: "에러 발생",
      data: error,
    });
  };

  model
    .classify({ imageUrl: fileURL })
    .then((p) => {
      var max = { class: "", score: 0 };
      for (const i of p) {
        max = max.score > i.score ? max : i;
      }
      console.log(p);
      let food;
      switch (max.class) {
        case "기쁨":
          food = require("../config/food").Happy;
          break;
        case "놀람":
          food = require("../config/food").Anxiety;
          break;
        case "슬픔":
          food = require("../config/food").Sad;
          break;
        case "화남":
          food = require("../config/food").Anger;
          break;
      }
      food = food[Math.floor(Math.random() * food.length)];
      res.status(200).json({
        status: res.statusCode,
        msg: "성공",
        data: {
          emotion:max.class,
          food:food.food,
          URL:food.URL
        }
      });
    })
    .catch(error);
});

router.get("/", (req, res, next) => {
  const date = new Date();
  const hour = date.getHours();
  console.log(date);
  var food;
  if (6 <= hour && hour < 12) {
    food = require("../config/time").Morning
  } else if (12 <= hour && hour < 18) {
    food = require("../config/time").Lunch
  } else if (18 <= hour && hour < 21) {
    food = require("../config/time").Evening
  } else {
    food = require("../config/time").Night
  }
  food = food[Math.floor(Math.random() * food.length)];
  res.status(200).json({
    status: res.statusCode,
    msg: "성공",
    data: food,
  });
});

router.post("/servey",(req,res,next)=>{
  var food;
  console.log(req.body.servey)
  if(req.body.servey[0]){
    food = require("../config/survey").desert
  }
  else if (!req.body.servey[1]){
    food = require("../config/survey").notEvening
  }
  else if(!req.body.servey[2]){
    food = require("../config/survey").notSpicy
  }
  else if(!req.body.servey[3]){
    food = require("../config/survey").notSpecial
  }
  else{
    food = require("../config/survey").special
  }
  food = food[Math.floor(Math.random() * food.length)];
  res.status(200).json({
    status: res.statusCode,
    msg: "성공",
    data: food,
  });
})

module.exports = router;
