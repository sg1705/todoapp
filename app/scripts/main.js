class Todo {
    constructor(config) {
        this.name = config.name;
        this.assignee = config.assignee;
        this.creator = config.creator;
    }
}

class TodoService {
  addTodo(todo) {
  }
  getTodos() {
  }
}

var todoService = new TodoService();

var fakeSource = Rx.Observable.interval(20000);
var fakeSourceMappedStream = fakeSource.map(
  d => {
    return new Todo({
      'name': d,
      'assignee': d,
      'creator': d
    })
  });


var todoInput = document.getElementById('todoInput');
var todoList = document.getElementById('todoList');
var addTodoButton = document.getElementById('addTodoButton');

var addTodoButtonClickStream = Rx.Observable.fromEvent(addTodoButton, 'click');

var todoInputStream = addTodoButtonClickStream.map(
  d => {
    return new Todo({
      'name': todoInput.value,
      'assignee': 'hard coded',
      'creator': 'hard coded'
    })
});

var firebaseTodoStream = new Rx.Subject();
var todosRef = firebase.database().ref('todos/').limitToLast(10);
todosRef.on('child_added', function(data) {
  firebaseTodoStream.onNext(data.val());
  console.log('Fetched from firebase: ');
  console.log(data.val());
});

todoInputStream.subscribe(
  data => {
  // Get a key for a new Post.
  var newTodoKey = firebase.database().ref().child('todos').push().key;
// console.log(newTodoKey);
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/todos/' + newTodoKey] = data;
  // updates['/user-todos/' + uid + '/' + newTodoKey] = data;

  return firebase.database().ref().update(updates);
  });

todoService.incomingTodoStream = Rx.Observable.merge(firebaseTodoStream);



var addTodo = (data) => {
  var li = document.createElement('li');
  var textNode = document.createTextNode(data.name);
  li.appendChild(textNode);
  todoList.appendChild(li);
};

todoService.incomingTodoStream.subscribe(
  data => addTodo(data)
);



// var newTodo = new Todo('first task', 'system');
// console.log(newTodo);










// var todoInput = document.getElementById('todoInput');
// var todoList = document.getElementById('todoList');
// var addTodoButton = document.getElementById('addTodoButton');

// var addTodoButtonClickStream = Rx.Observable.fromEvent(addTodoButton, 'click');

// var todoInputStream = addTodoButtonClickStream.map(evt => {
//   return todoInput.value;
// });

// console.dir(Rx);

// var replaySubject = Rx.ReplaySubject.create(
//   Rx.Subscriber.create(data => console.log(':' + data)), todoInputStream);

// var addTodo = (data) => {
//   var li = document.createElement('li');
//   var textNode = document.createTextNode(data);
//   li.appendChild(textNode);
//   todoList.appendChild(li);
// };

// todoInputStream.subscribe(
//   data => addTodo(data)
// );












// var source = Rx.Observable.interval(1000);

// var subject = new Rx.Subject();

// var subSource = source.subscribe(subject);

// var subSubject1 = subject.subscribe(
//     x => console.log('Value published to observer #1: ' + x),
//     e => console.log('onError: ' + e.message),
//     () => console.log('onCompleted'));

// var subSubject2 = subject.subscribe(
//     x => console.log('Value published to observer #2: ' + x),
//     e => console.log('onError: ' + e.message),
//     () => console.log('onCompleted'));

// setTimeout(() => {
//     // Clean up
//     subject.onCompleted();
//     subSubject1.dispose();
//     subSubject2.dispose();
// }, 5000);
