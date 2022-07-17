import uuid from 'uuid';
import axios from 'axios'
import cookies from 'js-cookie'
import { history } from './history'
import { take, put, select } from 'redux-saga/effects'
import service from '../helper/service'
import * as mutations from './mutations'

const url = process.env.NODE_ENV === 'production' ? `` : `http://localhost:2040`;

export function* taskCreationSaga(){
    while (true){
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        const ownerID = yield select(state=>state.session.id);
        const taskID = uuid();
        let mutation = mutations.createTask(taskID, groupID, ownerID);
        const { res } = yield axios.post(url + `/task/new`,{task:{
            id:taskID,
            group: groupID,
            owner: ownerID,
            isComplete:false,
            name:"New task"
        }});
        yield put(mutation);
    }
}

export function* commentCreationSaga(){
    while (true) {
        const comment = yield take (mutations.ADD_TASK_COMMENT);
        axios.post(url + `/comment/new`,{comment})
    }
}

export function* taskModificationSaga(){
    while (true){
        const task = yield take([mutations.SET_TASK_GROUP, mutations.SET_TASK_NAME,mutations.SET_TASK_COMPLETE]);
        axios.post(url + `/task/update`,{
            task:{
                id:task.taskID,
                group:task.groupID,
                name:task.name,
                isComplete:task.isComplete
            }});
    }
}

export function* userAuthenticationSaga(){
    while (true){
        const {username,password} = yield take(mutations.REQUEST_AUTHENTICATE_USER);
        
        try {
            const { responseCode, accessToken, refreshToken } = yield service.post(url + `/login`, { 
                username,
                password 
            });

            if (!responseCode || responseCode !== 200) {
                throw new Error()
            }

            // yield put(mutations.setState(data.state));
            yield put(mutations.processAuthenticateUser(mutations.AUTHENTICATED, {
                id: "U1",
                token: ""
            }));

            // SAVE TOKEN:
            cookies.set('accessToken', accessToken);
            cookies.set('refreshToken', refreshToken);
            history.push(`/dashboard`);
        } catch (e) {
            /* catch block handles failed login */
            yield put(mutations.processAuthenticateUser(mutations.NOT_AUTHENTICATED));
        }
    }
}


export function* userAccountCreationSaga(){
    while (true) {
        const {username, password } = yield take(mutations.REQUEST_USER_ACCOUNT_CREATION);
        try {
            const { data } = yield axios.post(url + `/user/create`, {username,password});

            yield put(mutations.setState({...data.state,session:{id:data.userID}}));
            yield put(mutations.processAuthenticateUser(mutations.AUTHENTICATED));

            history.push('/dashboard');

        } catch (e) {
            console.error("Error",e);
            yield put(mutations.processAuthenticateUser(mutations.USERNAME_RESERVED));
        }
    }
}

export function* initPageDataSaga(){
    while (true){
        yield take(mutations.REQUEST_INIT_PAGE_DATA);

        try {
            const { responseCode, state } = yield service.get(url + `/init-page-data`);

            if (!responseCode || responseCode !== 200) {
                throw new Error()
            }

            yield put(mutations.setState(state));

        } catch (e) {
            //
        }
    }
}