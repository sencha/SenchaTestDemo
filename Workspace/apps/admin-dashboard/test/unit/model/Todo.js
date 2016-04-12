describe('Todo Tests', function() {

    describe('with a not completed todo item', function() {
        beforeEach( function() {
            this.startTime = new Date().getTime();
            this.data = {
                id: 99,
                task: 'Do this now',
                done: false
            };
            this.todo = new Admin.model.Todo(this.data);
        });

        describe('by field name', function() {
            it('should update task name', function () {
                var taskName = 'Do this later';
                this.todo.set('task', taskName);
                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.completedDate).toBe(null);
            });

            it('should complete the todo', function () {
                this.todo.set('done', true);
                expect(this.todo.data.completedDate).not.toBe(null);

                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    testEndTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).toBeGreaterThan(0);

                if (todoEndTime < testEndTime) {
                    expect(todoEndTime).toBeLessThan(testEndTime);
                } else {
                    expect(todoEndTime).toBe(testEndTime);
                }
            });
        });
        describe('by object', function() {
            it('should update task name', function () {
                var taskName = 'Do this later',
                    newTodoData = {
                        task: taskName
                    };

                this.todo.set(newTodoData);
                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);
            });

            it('should complete the todo', function () {
                var newTodoData = {
                    done: true
                };
                this.todo.set(newTodoData);

                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    testEndTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).toBeGreaterThan(0);

                if (todoEndTime < testEndTime) {
                    expect(todoEndTime).toBeLessThan(testEndTime);
                } else {
                    expect(todoEndTime).toBe(testEndTime);
                }
            });
        });
    });

    describe('with a completed todo item', function() {
        beforeEach( function() {
            this.startTime = new Date().getTime();
            this.data = {
                id: 99,
                task: 'Do this now',
                done: true,
                completedDate: new Date()
            };
            this.todo = new Admin.model.Todo(this.data);
        });

        describe('by field name', function() {
            it('should update task name', function () {
                var taskName = 'Do this later';
                this.todo.set('task', taskName);
                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.completedDate).toBe(this.data.completedDate);
            });

            it('should un-complete the todo', function () {
                this.todo.set('done', false);

                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);
            });
        });
        describe('by object', function() {
            it('should update task name', function () {
                var taskName = 'Do this later',
                    newTodoData = {
                        task: taskName
                    };

                this.todo.set(newTodoData);
                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.completedDate).toBe(this.data.completedDate);
            });

            it('should un-complete the todo', function () {
                var newTodoData = {
                    done: false
                };
                this.todo.set(newTodoData);

                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);
            });
        });
    });
});
