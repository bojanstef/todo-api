const express = require('express');
const bodyParser = require('body-parser'); 

const app = express();
const PORT = process.env.PORT || 3000;

var todos = []; /*[{
	id: 1,
	description: 'Win at life',
	completed: false
}, {
	id: 2,
	description: 'Create Localeyes',
	completed: false
}, {
	id: 3,
	description: 'Study for midterm',
	completed: true
}, {
	id: 4,
	description: 'New description',
	completed: false
}];*/
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.send('Todo: API Root');
});

app.get('/todos', function(request, response) {
	response.json(todos);
});

app.get('/todos/:id', function(request, response) {	
	const todoId = parseInt(request.params.id, 10); // 2nd argument is the Base
	var matchedTodo;
	todos.forEach(function(todo) {
		if (todo.id === todoId) {
			matchedTodo = todo;
		}
	});
	if (matchedTodo) {
		response.json(matchedTodo);
	}
	else {
		response.status(400).send();
	}
});

// POST Request
app.post('/todos', function(req, res) {
	var body = req.body;

	body.id = todoNextId++;
	todos.push(body);

	res.json(body);
});

app.listen(PORT, function() {
	console.log('Express listening on port: ' + PORT);
});
