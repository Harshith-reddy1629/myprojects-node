const express = require("express");

const cors = require("cors");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const databasePath = path.join(__dirname, "sample.db");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8001;

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,

      driver: sqlite3.Database,
    });

    app.listen(PORT, () =>
      console.log(`Server Running at http://localhost:${PORT}/`)
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// @project post method

// Only Admin

app.post("/projects/onlyadmin/canpost/", async (req, res) => {
  const { projectImg, projectName, description, projectLink } = req.body;

  const QueryToRun = `INSERT INTO 
projects_table ( projectImg ,projectName,description,projectLink )
VALUES (
'${projectImg}',
'${projectName}',
'${description}',
 '${projectLink}'
);`;

  const runQ = await database.run(QueryToRun);

  res.send({ Message: "Added" });
});

// @projects get method

app.get("/projects/", async (req, res) => {
  const QueryToRun = `
  SELECT * FROM projects_table;
  `;
  const runQ = await database.all(QueryToRun);

  res.send(runQ);
});


app.get("/otp/generate/", async(req,res) =>{
      try {
        const N = Math.floor(Math.random() * 9);
      const N1 = Math.floor(Math.random() * 9);
      const N2 = Math.floor(Math.random() * 9);
      const N3 = Math.floor(Math.random() * 9);
  
      const G = `${N}${N1}${N2}${N3}`;

      res.status(200).send({GenOtp: G })
      } catch (error) {
        res.status(500).send({
          resMsg:'Unable To Generate OTP'
        })
      }

} )

app.post('/otp/verify/',async (req,res)=>{
  const {genratedOtp,otpInput} = req.body

  if (otpInput === genratedOtp) {
    res.status(200).send({verificationResponse:'Success'})
  } else {
   res.status(401).send({verificationResponse: 'Not Matched' })
  }

})