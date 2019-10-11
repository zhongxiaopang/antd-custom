import { login } from './index.api'

const model = {
  // model名称，view层用于提取state的key，需要保证唯一
  name: 'login',
  // 初始state状态
  state: {
    loading: false,
    loginStatus: sessionStorage.getItem('username'),
  },
  // reducer
  reducers: {
    'login': (state) => {
      return { ...state, loading: true }
    },
    'login/sucess': (state, action) => {
      const { username } = action.payload || {}
      if (username) {
        sessionStorage.setItem('username', username)
      }
      return { 
        ...state, 
        loginStatus: username ? username : '', 
        loading: false 
      }
    },
    'login/fail': (state, action) => {
      return { ...state, loginStatus: '', loading: false }
    },
    'login/logout': (state) => {
      sessionStorage.removeItem('username')
      return { ...state, loginStatus: '' }
    },
  },
  // saga
  effects: {
    'login': function*({ payload }, { call, put }) {
      const resp = yield call(login, payload)
      if (resp && resp.success) {
        console.log("resp", resp)
        yield put({ type: 'login/sucess', payload: resp })
      } else {
        yield put({ type: 'login/fail' })
      }
    },
  },
}

export default model
