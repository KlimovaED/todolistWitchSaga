import {initializeAppWorkerSaga} from './app-sagas';
import {authAPI, ResponseType} from '../api/todolists-api';
import {call, put} from 'redux-saga/effects';
import {setIsLoggedInAC} from '../features/Login/auth-reducer';
import {setAppInitializedAC} from './app-reducer';

let meResponse:ResponseType<{id: number; email: string; login: string}>

    beforeEach(()=>{
        meResponse={resultCode:0,data:{login:"",id:12,email:""},messages:[]}
    })

test('initializeAppSaga login success', () => {
const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me))
    expect(gen.next(meResponse).value).toEqual( put(setIsLoggedInAC(true)));
    expect(gen.next().value).toEqual( put(setAppInitializedAC(true)));

})

test('initializeAppSaga login unsuccess', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me))

    meResponse.resultCode=1;
    expect(gen.next(meResponse).value).toEqual( put(setAppInitializedAC(true)));

})
