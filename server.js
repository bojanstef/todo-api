const express = require('express');
const bodyParser = require('body-parser'); 
const _ = require('underscore');

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

// GET /todos
app.get('/todos', function(request, response) {
	const queryParams = request.query;	
	var filteredTodos = todos;	

	if (queryParams.hasOwnProperty('completed')) {
		if (queryParams.completed === 'true') {
			filteredTodos = _.where(filteredTodos, {completed: true});
		}
		else if (queryParams.completed === 'false') {
			filteredTodos = _.where(filteredTodos, {completed: false});
		}
	}

	response.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(request, response) {	
	const todoId = parseInt(request.params.id, 10); // 2nd argument is the Base	
	const matchedTodo = _.findWhere(todos, {id: todoId});	
	if (matchedTodo) {
		response.json(matchedTodo);
	}
	else {
		response.status(400).send();
	}
});

// POST /todos 
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); // Use only desc and completed fields.

	// IF body is not completed OR body description is not a string OR body description is empty, return an error.
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0) {
		return res.status(400).send();
	}

	// Remove leading and trailing whitespace
	body.description = body.description.trim();

	body.id = todoNextId++;
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	const todoId = parseInt(req.params.id, 10); // 2nd argument is the Base	
	const matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "No todo with id " + todoId});
	}
	else {
		todos = _.without(todos, matchedTodo); // updates todos array with deleted item
		res.json(matchedTodo);
	}

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	const todoId = parseInt(req.params.id, 10); // 2nd argument is the Base	
	const matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed'); // Use only desc and completed fields.
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	// Validation for completed property
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	}
	else if (body.hasOwnProperty('completed')) { // is not boolean
		return res.status(400).send();
	}

	// Validation for description property
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	}
	else if (body.hasOwnProperty('description')) {
		return res.status(400).send();	
	}
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});

app.listen(PORT, function() {
	console.log('Express listening on port: ' + PORT);
});
