describe('Todo Tests', function() {

    var taskName = 'Do this later';

    describe('with a not completed todo item', function() {
        beforeEach( function() {
            this.startTime = new Date().getTime();
            // Create a not completed item
            this.todo = new Admin.model.Todo({
                id: 99,
                task: 'Do this now',
                done: false
            });
        });

        describe('set fields by name', function() {
            it('should not set done or completedDate when changing another field', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Set a field
                this.todo.set('task', taskName);

                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);
            });

            it('should set completedDate when done is set', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Complete the item
                this.todo.set('done', true);

                expect(this.todo.data.completedDate).not.toBe(null);

                // Calculate times
                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    endTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).not.toBeLessThan(0);
                expect(todoEndTime).not.toBeGreaterThan(endTime);
            });

            it('should unset completedDate when done is unset', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Complete the item
                this.todo.set('done', true);

                expect(this.todo.data.completedDate).not.toBe(null);

                // Calculate times
                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    endTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).not.toBeLessThan(0);
                expect(todoEndTime).not.toBeGreaterThan(endTime);

                // Unset done
                this.todo.set('done', false);

                expect(this.todo.data.completedDate).toBe(null);
            });
        });

        describe('set fields by object', function() {
            it('should not set done or completedDate when changing another field', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Set a field
                this.todo.set({task: taskName});

                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);
            });

            it('should complete the todo', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Complete the item
                this.todo.set({done: true});

                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                // Calculate times
                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    endTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).not.toBeLessThan(0);
                expect(todoEndTime).not.toBeGreaterThan(endTime);
            });

            it('should unset completedDate when done is unset', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Complete the item
                this.todo.set({done: true});

                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                // Calculate times
                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    endTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).not.toBeLessThan(0);
                expect(todoEndTime).not.toBeGreaterThan(endTime);

                // Unset done
                this.todo.set({done: false});

                expect(this.todo.data.completedDate).toBe(null);
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

        describe('set fields by name', function() {
            it('should not change done or completedDate when changing another field', function () {
                // Verify the item's state
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);
                var completedDate = this.todo.data.completedDate.getTime();

                // Set a field
                this.todo.set('task', taskName);

                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);
                expect(this.todo.data.completedDate.getTime()).toBe(completedDate);
            });

            it('should unset completedDate when done is unset', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                // Unset done
                this.todo.set('done', false);

                expect(this.todo.data.completedDate).toBe(null);
            });

            it('should reset completedDate when done is reset', function () {
                // Verify the item's state
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                // Unset done
                this.todo.set('done', false);

                expect(this.todo.data.completedDate).toBe(null);

                // Complete the item
                this.todo.set('done', true);

                expect(this.todo.data.completedDate).not.toBe(null);

                // Calculate times
                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    endTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).not.toBeLessThan(0);
                expect(todoEndTime).not.toBeGreaterThan(endTime);

            });
        });

        describe('set fields by object', function() {
            it('should not change done or completedDate when changing another field', function () {
                // Verify the item's state
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);
                var completedDate = this.todo.data.completedDate.getTime() - this.startTime;

                // Set a field
                this.todo.set({task: taskName});

                expect(this.todo.data.task).toBe(taskName);
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate.getTime() - this.startTime).toBe(completedDate);
            });

            it('should unset completedDate when done is unset', function () {
                // Verify the constructor does not complete the item
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                // Unset done
                this.todo.set({done: false});

                expect(this.todo.data.completedDate).toBe(null);
            });

            it('should reset completedDate when done is reset', function () {
                // Verify the item's state
                expect(this.todo.data.done).toBe(true);
                expect(this.todo.data.completedDate).not.toBe(null);

                // Unset done
                this.todo.set({done: false});

                expect(this.todo.data.done).toBe(false);
                expect(this.todo.data.completedDate).toBe(null);

                // Complete the item
                this.todo.set({done: true});
                expect(this.todo.data.completedDate).not.toBe(null);

                // Calculate times
                var todoEndTime = this.todo.data.completedDate.getTime() - this.startTime,
                    endTime = new Date().getTime() - this.startTime;

                expect(todoEndTime).not.toBeLessThan(0);
                expect(todoEndTime).not.toBeGreaterThan(endTime);

            });
        });
    });
});
