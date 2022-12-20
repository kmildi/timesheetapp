const express = require("express");
const fsP = require("fs/promises");
const fs = require("fs");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;


app.get("/tasklist", async (req, res) => {
  let tasklist;
  try {
    tasklist = await fsP.readFile('tasklist.json');
  } catch (err) {
    return res.sendStatus(404);
  }
  res.json(JSON.parse(tasklist));
});

app.post("/tasklist", async (req, res) => {
	// const id = uuid();
	const content = req.body;
	if (!content) return res.sendStatus(400);

  const file = fs.readFileSync('tasklist.json', (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
  });
  const taskList = JSON.parse(file);
  taskList.tasks.push(content);
  fs.writeFileSync("tasklist.json", JSON.stringify(taskList, null, 2), function(err){
    if (err) throw err;
  });

	res.status(201).json({
    result: "success"
		// id: id
	});
});

app.post("/history", async (req, res) => {
	const content = req.body;
	if (!content) return res.sendStatus(400);

  const file = fs.readFileSync('tasklist.json', (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
  });
  const taskList = JSON.parse(file);
  taskList.tasks[content.taskId].history = content.history;
  fs.writeFileSync("tasklist.json", JSON.stringify(taskList, null, 2), function(err){
    if (err) throw err;
  });

	res.status(201).json({
    result: "success"
		// id: id
	});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

