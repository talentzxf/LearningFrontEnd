import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import IndexPage from '@/components/IndexPage';
import FuncDrawer from '@/components/FuncDrawer';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:"/",
      name:"Index",
      component: IndexPage,
    },
    {
      path: '/rt',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path:"/func",
      name:"FuncDrawer",
      component: FuncDrawer
    }
  ],
});
