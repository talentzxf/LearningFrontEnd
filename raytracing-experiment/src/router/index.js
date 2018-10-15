import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import IndexPage from '@/components/IndexPage';
import FuncDrawer from '@/components/FuncDrawer';
import InvertedPendulum from '@/components/InvertedPendulum';
import Suduko from '@/components/Suduko';

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
    },
    {
      path:"/ipendulum",
      name:"InvertedPendulum",
      component: InvertedPendulum
    },
    {
      path:"/suduko",
      name:"Suduko",
      component: Suduko
    }
  ],
});
