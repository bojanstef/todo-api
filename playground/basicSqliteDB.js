const Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basicSqliteDB.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	force: false	// force: true - drops all tables before syncing again.
}).then(function() { 
	console.log('Everything is synced.');

	// fetch todo item by id if found print using toJSON else print todo not found.
	Todo.findById(2).then(function(todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo not found');
		}
	});
	

	// Todo.create({
	// 	description: 'Take out trash',
	// 	// completed: false
	// }).then(function(todo) {
	// 	return Todo.create({
	// 		description: 'Clean office'			
	// 	});
	// }).then(function() {
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%Office%'
	// 			}
	// 		}
	// 	});
	// }).then(function(todos) {
	// 	if (todos) {
	// 		todos.forEach(function(todo) {
	// 			console.log(todo.toJSON());			
	// 		});			
	// 	}
	// 	else {
	// 		console.log('No todos found');
	// 	}
	// }).catch(function(e) {
	// 	console.log(e);
	// });
});

