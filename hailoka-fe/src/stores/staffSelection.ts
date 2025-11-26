import { defineStore } from "pinia";

interface Staff {
  user_id: string;
  name: string;
}

export const useStaffSelectionStore = defineStore("staffSelection", {
  state: () => ({
    selectedStaff: [] as Staff[],
    selectedIds: [] as string[],
  }),

  actions: {
    setSelectedByObjects(staffs: Staff[]) {
      this.selectedStaff = [...staffs];
      this.selectedIds = staffs.map(s => s.user_id);
    },
    setSelectedByIds(ids: string[]) {
      this.selectedIds = [...ids];
      // Optionally sync selectedStaff if you have full staff list available:
      // this.selectedStaff = allStaffList.filter(s => ids.includes(s.user_id))
    },
    addById(id: string) {
      if (!this.selectedIds.includes(id)) this.selectedIds.push(id);
    },
    removeById(id: string) {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    },
    toggleById(id: string) {
      if (this.selectedIds.includes(id)) this.removeById(id);
      else this.addById(id);
    },
    
    add(staff: Staff) {
      if (!this.selectedStaff.find((s) => s.user_id === staff.user_id)) {
        this.selectedStaff.push(staff);
      }
    },

    remove(id: string) {
      this.selectedStaff = this.selectedStaff.filter((s) => s.user_id !== id);
    },

    clear() {
      this.selectedIds = [];
      this.selectedStaff = [];
    },

    toggleStaff(staff: Staff) {
      const existingIndex = this.selectedStaff.findIndex((s) => s.user_id === staff.user_id);
      if (existingIndex >= 0) {
        this.selectedStaff.splice(existingIndex, 1);
      } else {
        this.selectedStaff.push(staff);
      }
    },

    selectAll(staffList: Staff[]) {
      console.log("staffList >>> ", staffList);
      
      this.selectedStaff = [...staffList];
    },

    deselectAll() {
      this.selectedStaff = [];
    },
  },
});


