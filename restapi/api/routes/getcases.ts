import * as fs from "fs";

const data = JSON.parse(fs.readFileSync("case/data.json").toString());
const layout = JSON.parse(fs.readFileSync("case/layout.json").toString());

module.exports = async (req, res) => {
  res.json({
    data: data,
    layout: layout.layout,
  });
};
