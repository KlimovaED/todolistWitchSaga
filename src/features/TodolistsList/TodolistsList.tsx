import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from '../../app/store'
import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistDomainType
} from './todolists-reducer'
import {
    TasksStateType,
} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import { Redirect } from 'react-router-dom'
import {addTasks, removeTasks, updateTasks} from './tasks-sagas';
import {
    addTodolists,
    changeTodolistsTitle,
    fetchTodolists,
    removeTodolists
} from './todolists-sagas';

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)



    const dispatch = useDispatch()
    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        if(!todolists.length){
            const action = fetchTodolists()
            dispatch(action)
        }
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const action = removeTasks(todolistId,id)
        dispatch(action)
    }, [])

    const addTask = useCallback(function (todolistId: string,title: string) {
        const action = addTasks(todolistId,title)
        dispatch(action)
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const action = updateTasks(id, {status}, todolistId)
        dispatch(action)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const action = updateTasks(id, {title: newTitle}, todolistId)
        dispatch(action)
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value)
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolists(id)
        dispatch(thunk)
    }, [])
    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistsTitle(id, title)
        dispatch(thunk)
    }, [])
    const addTodolist = useCallback((title: string) => {
        const action = addTodolists(title)
        dispatch(action)
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
