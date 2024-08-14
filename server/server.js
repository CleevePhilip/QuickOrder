const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8080;
const authRouter = require("./routes/auth");
const menuRouter = require("./routes/menu");
const staffRouter = require("./routes/staff");
const categoryRouter = require("./routes/category");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use("/auth", authRouter);
app.use("/auth", menuRouter);
app.use("/auth", categoryRouter);
app.use("/auth", staffRouter);

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
