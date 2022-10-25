var express = require("express");
var router = express.Router();
var jsonFile = require("../events.json");
const fs = require("fs");
const fileName = "events.json";

router.get("/", function (_, res) {
  res.send(jsonFile);
});

router.post("/create", function (req, res) {
  const name = req.body.name;

  jsonFile.data.push({
    id: jsonFile.data.length + 1,
    name: name,
  });

  fs.writeFile(fileName, JSON.stringify(jsonFile), function writeJSON(err) {
    if (err) res.send({ error: err, message: "error" });
  });

  res.send({
    message: "succesfully created",
  });
});

router.put("/update", function (req, res) {
  const temp = jsonFile.data;

  const updatedArray = temp.map((item) => {
    if (item.id == req.body.id) {
      return {
        ...item,
        name: req.body.name,
      };
    } else {
      return item;
    }
  });

  fs.writeFile(
    fileName,
    JSON.stringify({
      data: updatedArray,
    }),
    function writeJSON(err) {
      if (err) res.send({ error: err, message: "error" });
    }
  );

  res.send({
    status: 200,
    mensahe: "Updated",
  });
});

router.delete("/delete", function (req, res) {
  const temp = jsonFile;
  const ids = temp.data.map((item) => {
    return item.id;
  });

  if (!req.body.id) {
    return res.send({ message: "id is required" });
  }

  if (!ids.includes(+req.body.id)) {
    return res.send({ message: "id is not existing on the database" });
  }

  const newArray = temp.data.filter((item) => {
    if (item.id != req.body.id) {
      return item;
    }
  });

  fs.writeFile(
    fileName,
    JSON.stringify({
      data: newArray,
    }),
    function writeJSON(err) {
      if (err) res.send({ error: err, message: "error" });
    }
  );

  res.send({
    message: "succesfully deleted",
  });
});

module.exports = router;
