import {applyMiddleware, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {rootReducer} from './reducers';
import createSagaMiddleware from 'redux-saga'
import {
    tasksWatcherSaga
} from '../features/TodolistsList/tasks-sagas';
import {appWatcherSaga} from './app-sagas';
import {todolistsWatcherSaga} from '../features/TodolistsList/todolists-sagas';
import { all } from 'redux-saga/effects';
import {
    authWatcherSaga,
} from '../features/Login/auth-reducers-sagas';


const sagaMiddleware = createSagaMiddleware()


// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield all([
        appWatcherSaga(),
        tasksWatcherSaga(),
        todolistsWatcherSaga(),
        authWatcherSaga()])
}


if (process.env.NODE_ENV === 'development' && module.hot) { // не
    // перезагружать страницу
    module.hot.accept('./reducers', () => {
        store.replaceReducer(rootReducer)
    });
}

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;


