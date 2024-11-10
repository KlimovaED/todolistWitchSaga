import {call, put, select} from 'redux-saga/effects';
import {
    GetTasksResponse, ResponseType,
    TaskPriorities,
    TaskStatuses,
    todolistsAPI
} from '../../../api/todolists-api';
import {setAppErrorAC, setAppStatusAC} from '../../../app/app-reducer';
import {
    addTaskWorkerSaga,
    fetchTasksWorkerSaga,
    removeTaskWorkerSaga,
    tasksWatcherSaga
} from '../tasks-sagas';
import {
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    tasksReducer
} from '../tasks-reducer';
import {useState} from 'react';

test('test to be fetchTasks', () => {
    const gen = fetchTasksWorkerSaga({type: '', todolistId: 'todolistId'})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, 'todolistId'))
    const fakeApiResponse: GetTasksResponse = {
        error: ' ',
        totalCount: 1,
        items: [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    }

    expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC(fakeApiResponse.items, 'todolistId')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')))
})

test('test to be removed task', () => {
    const todolistId="todolistId"
    const taskId = "12345"
    const gen = removeTaskWorkerSaga({ type: ' ', todolistId, taskId})
    expect(gen.next().value).toEqual(call(todolistsAPI.deleteTask,todolistId, taskId))
    const fakeApiResponse: ResponseType = {
       resultCode: 0,
        messages: [],
        data: [
            {
                id: '12345',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    }

    expect(gen.next(fakeApiResponse).value).toEqual(put(removeTaskAC(taskId, todolistId)))
    expect(gen.next().value).toBeUndefined()
})

test('test to be add task', () => {
    const todolistId="todolistId"
    const title = "new Task"
    const gen = addTaskWorkerSaga({ type: 'TASKS/ADD-TASKS', todolistId, title: title})
    expect(gen.next().value).toEqual( put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask,todolistId, title))
    const fakeApiResponse: ResponseType = {
        resultCode: 0,
        messages: [],
        data: [
            {
                id: '12345',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    }

    expect(gen.throw({message:"some error"}).value).toEqual(put(setAppErrorAC("some error")));
})
