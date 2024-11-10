import {call, put, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC} from '../../app/app-reducer';
import {todolistsAPI} from '../../api/todolists-api';
import {
    addTodolistAC,
    changeTodolistEntityStatusAC, changeTodolistTitleAC,
    removeTodolistAC, setTodolistsAC
} from './todolists-reducer';
import {handleServerNetworkError} from '../../utils/error-utils';
import {Dispatch} from 'redux';

export function* fetchTodolistsWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    try{
    const res = yield call(todolistsAPI.getTodolists)
    yield put(setTodolistsAC(res.data))
    yield put(setAppStatusAC('succeeded'))
}
catch(error){
   yield handleServerNetworkError(error);
}}
export const fetchTodolists = () => ({type: 'TODOLISTS/SET-TODOLISTS'})

export function* removeTodolistWorkerSaga(action: ReturnType<typeof removeTodolists>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    const res = yield call(todolistsAPI.deleteTodolist, action.todolistId)
    yield put((removeTodolistAC(action.todolistId)))
    yield put(setAppStatusAC('succeeded'))
}
export const removeTodolists = (todolistId: string) => ({
    type: 'TODOLISTS/REMOVES-TODOLIST',
    todolistId
})

export function* addTodolistWorkerSaga(action:ReturnType<typeof addTodolists>){
        yield put(setAppStatusAC('loading'))
       const res=yield call(todolistsAPI.createTodolist,action.title)
       yield put(addTodolistAC(res.data.data.item))
       yield put(setAppStatusAC('succeeded'))
}
export const addTodolists=(title:string)=>({type:'TODOLISTS/ADD-TODOLISTS',title})

export function* changeTodolistTitleWorkerSaga(action:any)  {
        yield call(todolistsAPI.updateTodolist,action.id, action.title)
        yield put(changeTodolistTitleAC(action.id, action.title))
}
export const changeTodolistsTitle=(id:string,title:string)=>({type:'TODOLISTS/CHANGE-TODOLISTS',id,title})

export function* todolistsWatcherSaga() {
    yield takeEvery('TODOLISTS/REMOVES-TODOLIST', removeTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/SET-TODOLISTS', fetchTodolistsWorkerSaga)
    yield takeEvery('TODOLISTS/ADD-TODOLISTS', addTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/CHANGE-TODOLISTS', changeTodolistTitleWorkerSaga)
}
