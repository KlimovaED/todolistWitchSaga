import {call, put, takeEvery} from 'redux-saga/effects';
import {authAPI, ResponseType} from '../api/todolists-api';
import {setIsLoggedInAC} from '../features/Login/auth-reducer';
import {setAppInitializedAC} from './app-reducer';
import {
    removeTodolistWorkerSaga
} from '../features/TodolistsList/todolists-sagas';


export function* initializeAppWorkerSaga() {
    alert('initializeAppSaga')
    const data:ResponseType<{id: number; email: string; login: string}>= yield call(authAPI.me)
    if (data.resultCode === 0) {
        yield put(setIsLoggedInAC(true));
    }

    yield put(setAppInitializedAC(true));
}

export const initizeApp = () => ({type: 'APP/INITIALIED-APP'})


export function* appWatcherSaga(){
    yield takeEvery('APP/INITIALIED-APP', initializeAppWorkerSaga)
}
