import {call, put, select, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {AxiosResponse} from 'axios';
import {
    GetTasksResponse,
    ResponseType,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api';
import {
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    updateTaskAC
} from './tasks-reducer';
import {
    handleServerAppError,
    handleServerNetworkError
} from '../../utils/error-utils';
import {AppRootStateType} from '../../app/store';


export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const data: GetTasksResponse = yield call(todolistsAPI.getTasks, action.todolistId)
    const tasks = data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}

export const fetchTasks = (todolistId: string) => ({
    type: 'TASKS/SET-TASKS',
    todolistId
})


export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTasks>) {
    const res: ResponseType = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    yield put(removeTaskAC(action.taskId, action.todolistId))
}

export const removeTasks = (todolistId: string, taskId: string) => ({
    type: 'TASKS/REMOVES-TASK',
    todolistId,
    taskId
})

export function* addTaskWorkerSaga(action: ReturnType<typeof addTasks>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<ResponseType<{
            item: TaskType
        }>> = yield call(todolistsAPI.createTask, action.todolistId, action.title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            const action = addTaskAC(task)
            yield put(action)
            yield put(setAppStatusAC('succeeded'))
        } else {
          return yield handleServerAppError(res.data);
        }
    } catch (error) {
      return yield handleServerNetworkError(error)
    }
}

export const addTasks = (todolistId: string, title: string) => ({
    type: 'TASKS/ADD-TASKS',
    todolistId,
    title
})

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTasks>) {
    const state: AppRootStateType = yield select();
    const task = state.tasks[action.todolistId].find(t => t.id === action.taskId);
    if (!task) {
        //throw new Error("task not found in the state");
        console.warn('task not found in the state')
        return
    }

    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...action.domainModel
    }

    const res = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel)
    try {
        if (res.data.resultCode === 0) {
            const actions = updateTaskAC(action.taskId, action.domainModel, action.todolistId)
            yield put(actions)
        } else {
        return yield   handleServerAppError(res.data);
        }
    } catch (error) {
      return yield handleServerNetworkError(error);
    }
}

export const updateTasks = (taskId: string, domainModel: any, todolistId: string) => ({
    type: 'TASKS/UPDATES-TASKS',
    taskId,
    domainModel,
    todolistId
})

export function* tasksWatcherSaga() {
    yield takeEvery('TASKS/SET-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASKS/REMOVES-TASK', removeTaskWorkerSaga)
    yield takeEvery('TASKS/ADD-TASKS', addTaskWorkerSaga)
    yield takeEvery('TASKS/UPDATES-TASKS', updateTaskWorkerSaga)
}
