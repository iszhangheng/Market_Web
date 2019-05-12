import {
  login,
  logout,
  getInfo
} from '@/api/login';
import {
  getToken,
  // setToken,
  removeToken
} from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    authId: '',
    deptName: '',
    postId: ''
  },

  mutations: {
    SET_AUTHID: (state, authId) => {
      state.authId = authId;
    },
    SET_POSTID: (state, postId) => {
      state.postId = postId;
    },
    SET_DEPTNAME: (state, deptName) => {
      state.deptName = deptName;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then((response) => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.robj;
          commit('SET_ROLES', data.roles);
          commit('SET_NAME', data.name);
          commit('SET_AUTHID', data.employeeId);
          commit('SET_DEPTNAME', data.deptName);
          commit('SET_POSTID', data.postId);
          commit('SET_AVATAR', data.avatar || 'https://gitee.com/uploads/57/302857_webcjs.png');
          // commit('SET_AVATAR', data.avatar || '../../assets/images/avatar');
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
