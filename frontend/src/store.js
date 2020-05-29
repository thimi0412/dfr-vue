import Vue from "vue";
import Vuex from "vuex";
import api from "@/services/api";

Vue.use(Vuex);

// 承認情報
const authModule = {
  strict: process.env.NODE_ENV === "production",
  namespaced: true,
  state: {
    username: "",
    isLoggedIn: false,
  },
  getters: {
    username: (state) => state.username,
    isLoggedIn: (state) => state.isLoggedIn,
  },
  mutations: {
    set(state, payload) {
      state.username = payload.username;
      state.isLoggedIn = true;
    },
    clear(state) {
      state.username = "";
      state.isLoggedIn = false;
    },
  },
  actions: {
    /**
     * ログイン
     */
    login(context, payload) {
      return api
        .post("/auth/jwt/create/", {
          username: payload.username,
          password: payload.password,
        })
        .then((response) => {
          // 承認用のトークンをlocalStrageに保存
          localStorage.setItem("accsess", response.data.access);
          // ユーザー情報を取得してstoreのユーザー情報を更新
          return context.dispatch("reload").then((user) => user);
        });
    },
    /**
     * ログアウト
     */
    logout(context) {
      // 承認用のトークンをlocalStrageから削除
      localStorage.removeItem("accsess");
      // storeのユーザー情報をクリア
      context.commit("clear");
    },
    /**
     * ユーザー情報更新
     */
    reload(context) {
      return api.get("/auth/users/me/").then((response) => {
        const user = response.data;
        // storeのユーザー情報を更新
        context.commit("set", { user: user });
        return user;
      });
    },
  },
};

// グローバルメッセージ
const messageModel = {
  strict: process.env.NODE_ENV !== "production",
  namespaced: true,
  state: {
    error: "",
    warning: [],
    info: [],
  },
  getters: {
    error: (state) => state.error,
    warning: (state) => state.warning,
    info: (state) => state.info,
  },
  mutations: {
    set(state, payload) {
      if (payload.error) {
        state.error = payload.error;
      }
      if (payload.warning) {
        state.warning = payload.warning;
      }
      if (payload.info) {
        state.info = payload.info;
      }
    },
    clear(state) {
      state.error = "";
      state.warning = "";
      state.info = "";
    },
  },
  actions: {
    /**
     * エラーメッセージ表示
     */
    setErrorMessage(context, payload) {
      context.commit("clear");
      context.commit("set", { error: payload.message });
    },
    /**
     * 警告メッセージ(複数)表示
     */
    setWarningMessage(context, payload) {
      context.commit("clear");
      context.commit("set", { warning: payload.message });
    },
    /**
     * インフォメーションメッセージ表示
     */
    setInfoMessage(context, payload) {
      context.commit("clear");
      context.commit("set", { info: payload.message });
    },
    /**
     * 全メッセージ削除
     */
    clearMessage(context) {
      context.commit("clear");
    },
  },
};

const store = new Vuex.Store({
  modules: {
    auth: authModule,
    message: messageModel,
  },
});

export default store;
