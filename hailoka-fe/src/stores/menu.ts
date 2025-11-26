import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    activeMenu: '', // store the active menu route
  }),
  actions: {
    setActiveMenu(route: string) {
      this.activeMenu = route;
    },
  },
});