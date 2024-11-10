import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from '../../app/app-reducer';
import {
    handleServerAppError,
    handleServerNetworkError
} from '../../utils/error-utils';
import {setIsLoggedInAC} from './auth-reducer';
import {call, put, takeEvery} from 'redux-saga/effects';
import {Dispatch} from 'redux';
import {removeTaskWorkerSaga} from '../TodolistsList/tasks-sagas';

export function* loginWorkerSaga(action: ReturnType<typeof login>) {
    yield put(setAppStatusAC('loading'))
    try {
        const data = yield call(authAPI.login, action.data)
        if (data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))
        } else {
            return yield handleServerAppError(data)
        }
    } catch (error) {
        return yield  handleServerNetworkError(error)
    }
}

export const login = (data: LoginParamsType) => ({type: 'AUTH/LOGIN', data})


export function* logoutWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    try {
        const res = yield call(authAPI.logout)
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(setAppStatusAC('succeeded'))
        } else {
            return yield  handleServerAppError(res.data)
        }
    } catch (error) {
        return yield handleServerNetworkError(error)
    }
}

export const logout = () => ({type: 'AUTH/LOGOUT'})

export function* authWatcherSaga() {
    yield takeEvery('AUTH/LOGIN', loginWorkerSaga)
    yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga)
}
