import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as AuthAPI from 'lib/api/auth';
import { Map } from 'immutable';

const CHANGE_INPUT = 'auth/CHANGE_INPUT'; // input 값 변경
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'; // form 초기화
const CHECK_EMAIL_EXISTS = 'auth/CHECK_EMAIL_EXISTS'; // 이메일 중복 확인
const CHECK_NICKNAME_EXISTS = 'auth/CHECK_NICKNAME_EXISTS'; // 아이디 중복 확인
const LOCAL_REGISTER = 'auth/LOCAL_REGISTER'; // 이메일 가입
const LOCAL_LOGIN = 'auth/LOCAL_LOGIN'; // 이메일 로그인
const LOGOUT = 'auth/LOGOUT'; // 로그아웃
const SET_ERROR = 'auth/SET_ERROR'; // 오류 설정

export const setError = createAction(SET_ERROR) // { form, message }
export const changeInput = createAction(CHANGE_INPUT); //  { form, name, value }
export const initializeForm = createAction(INITIALIZE_FORM); // form 
export const checkEmailExists = createAction(CHECK_EMAIL_EXISTS, AuthAPI.checkEmailExists); // email
export const checkNicknameExists = createAction(CHECK_NICKNAME_EXISTS, AuthAPI.checkNicknameExists); // username
export const localRegister = createAction(LOCAL_REGISTER, AuthAPI.localRegister); // { email, username, password }
export const localLogin = createAction(LOCAL_LOGIN, AuthAPI.localLogin); // { email, password }
export const logout = createAction(LOGOUT);

const initialState = Map({
    register: Map({
        form: Map({
            email: '',
            name: '',
            nickname: '',
            password: '',
            passwordConfirm: ''
        }),
        exists: Map({
            email: false,
            nickname: false
        }),
        error: null
    }),
    login: Map({
        form: Map({
            email: '',
            password: ''
        }),
        error: null
    }),
    result: Map({})
});

export default handleActions({
    [CHANGE_INPUT]: (state, action) => {
        const { form, name, value } = action.payload;
        return state.setIn([form, 'form', name], value);
    },
    [INITIALIZE_FORM]: (state, action) => {
        const initialForm = initialState.get(action.payload);
        return state.set(action.payload, initialForm);
    },
    [SET_ERROR]: (state, action) => {
        const { form, message } = action.payload;
        return state.setIn([form, 'error'], message);
    },
    ...pender({
        type: CHECK_EMAIL_EXISTS,
        onSuccess: (state, action) => state.setIn(['register', 'exists', 'email'], action.payload.data.data)
    }),
    ...pender({
        type: CHECK_NICKNAME_EXISTS,
        onSuccess: (state, action) => state.setIn(['register', 'exists', 'nickname'], action.payload.data.data)
    }),
    ...pender({
        type: LOCAL_LOGIN,
        onSuccess: (state, action) => {
            return state.set('result', Map(action.payload.data))
        }
    }),
    ...pender({
        type: LOCAL_REGISTER,
        onSuccess: (state, action) => {
            console.log("회원가입", action.payload)
            return state.set('result', Map(action.payload.data))}
    }),
}, initialState);