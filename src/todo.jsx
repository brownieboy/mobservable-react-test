import React from 'react';
import mobservable from 'mobservable';
import mobservableReact from 'mobservable-react';

var RenderCounter = React.createClass({
    counter: 0,
    render: function() {
        return <div className="render-counter">{++this.counter % 2 ? 'odd' : 'even'}</div>;
    }
});

var TodoList = mobservableReact.reactiveComponent(React.createClass({
    displayName: 'TodoList',

    render: function() {
        var store = this.props.store;
        return (<div><RenderCounter />
            { store.report() }
            <ul><hr/>
                { store.todos.map(function(todo, idx) {
                    return (<TodoView todo={ todo } key={ idx } />)
                }) }
            <hr/></ul>
            <button onClick={ this.onNewTodo }>New Todo</button>
            <small> (double-click a todo to edit)</small>
        </div>);
    },

    onNewTodo: function() {
        this.props.store.addTodo(prompt('Enter a new todo:','coffee plz'));
    }
}));

var TodoView = mobservableReact.reactiveComponent(React.createClass({
    displayName: 'TodoView',

    render: function() {
        var todo = this.props.todo;
        return (<li onDoubleClick={ this.onRename }>
            <RenderCounter />
            <input type='checkbox' checked={ todo.completed }
                onChange={ this.onToggleCompleted } />
            <code>{todo.task}</code>
        </li>);
    },

    onToggleCompleted: function() {
        var todo = this.props.todo;
        todo.completed = !todo.completed;
    },

    onRename: function() {
        var todo = this.props.todo;
        todo.task = prompt('Task name', todo.task) || "";
    }
}));


function ReactiveTodoStore() {
    this.todos = mobservable.makeReactive([]);
    mobservable.observe(function() {
        console.log(this.report());
    }, this);
}

ReactiveTodoStore.prototype.addTodo = function(task) {
    this.todos.push({
        task: task,
        completed: false
    });
}

ReactiveTodoStore.prototype.completedTodosCount = function() {
    return this.todos.filter(function(todo) {
        return todo.completed === true;
    }).length;
}

ReactiveTodoStore.prototype.report = function() {
    if (this.todos.length === 0)
        return "<none>";
    return "First todo: '" + this.todos[0].task
        + "'. Progress: "
        + this.completedTodosCount() + "/" + this.todos.length;
}

var reactiveTodoStore = new ReactiveTodoStore();

React.render(<TodoList store={reactiveTodoStore} />,
    document.getElementById('main'));
