import Vue from "vue";
import VueRoute from "vue-route";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import store from "@/store";

Vue.use(VueRoute);

const router = new VueRouter({
  mode: "history",
  // ログインが必要な画面には「requiresAuth」フラグをつける
  routes: [
    { path: "/", component: HomePage, meta: { requiresAuth: true } },
    { path: "/login", component: Login },
    { path: "*", redirect: "/" },
  ],
});

/**
 * Routerによって画面遷移する際に毎回実行する
 */
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  const token = localStorage.getItem("accsess");
  console.log("to.path=", to.path);
  console.log("isLoggedIn", isLoggedIn);

  // ログインが必要な画面に遷移使用とした場合
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // ログインしている場合
    if (isLoggedIn) {
      console.log("User is already logged in. So, free to next.");
      next();
      // ログインしていない場合
    } else {
      // まだ承認用のトークンが残っていればユーザー情報再取得
      if (token !== null) {
        console.log("User is not Logged In. Try to reload again.");

        store
          .dispatch("auth/reload")
          .then(() => {
            // 再取得できたらそのまま次へ
            console.log("Succeeded to reaload. So, free to next.");
            next();
          })
          .catch(() => {
            // 再取得できなければログイン画面へ
            forceToLoginPage(to, from, next);
          });
      } else {
        // ログインが不要な画面であればそのまま次へ
        console.log("Go to public page.");
      }
    }
  } else {
    // ログインが不要な画面であればそのまま次へ
    console.log("Go to public page.");
    next();
  }
});

/**
 * ログイン画面へ強制送還
 */
function forceToLoginPage(to, from, next) {
  console.log("Force user to login page.");
  next({
    path: "/login",
    // 遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath },
  });
}

export default router;