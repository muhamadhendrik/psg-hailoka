// src/stores/counter.ts
import { defineStore } from "pinia";

// Types for state
interface CounterState {
  count: number;
  appName: string;
}

export const useCounterStore = defineStore("counter", {
  state: (): CounterState => ({
    count: 0,
    appName: "Cloud VoIP"
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    getTheAppName: (state) => {
        return "Vue App: " + state.appName + " v.1.0"
    }
  },

  actions: {
    increment() {
      this.count++;
    },
    decreament() {
      this.count--;
    },
    reset() {
      this.count = 0;
    }
  }
});