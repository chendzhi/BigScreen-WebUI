// import { queryLeaderList } from "@/api/newDriverCabin/index";
const state = {
  leaders: [],
  currentLeader: '',
  departmentLeaders: [],
  currentDepartmentLeader: ''
}

const mutations = {
  // TOGGLE_SIDEBAR: state => {
  //   state.sidebar.opened = !state.sidebar.opened
  //   state.sidebar.withoutAnimation = false
  //   if (state.sidebar.opened) {
  //     Cookies.set('sidebarStatus', 1)
  //   } else {
  //     Cookies.set('sidebarStatus', 0)
  //   }
  // }
  SET_LEADERS: (state, val) => {
    state.leaders = val;
  },
  CHANGE_CURRENT_LEADER: (state, val) => {
    state.currentLeader = val;
  },
  SET_DEPARTMENT_LEADERS: (state, val) => {
    state.departmentLeaders = val;
  },
  CHANGE_CURRENT_DEPARTMENT_LEADER: (state, val) => {
    state.currentDepartmentLeader = val;
  }
}

const actions = {
  // getLeaders ({commit}) {
  //   queryLeaderList({
  //     organCode: '110000'
  //   }).then(res => {
  //     commit('SET_LEADERS', res);
  //   })
  // }
  // toggleSideBar({ commit }) {
  //   commit('TOGGLE_SIDEBAR')
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
