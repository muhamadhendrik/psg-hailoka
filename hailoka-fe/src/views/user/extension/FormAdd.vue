<script setup lang="ts">
import { ref } from 'vue';
import DashboardUserLayout from '../../../layouts/DashboardUserLayout.vue';
import { Button, InputText, useToast } from 'primevue';
// import Dropdown from "primevue/dropdown";
import { Icon } from '@iconify/vue';
import { useMenuStore } from '../../../stores/menu';
import { useRoute, useRouter } from 'vue-router';
// import { staffServices } from '../../../services/staffService';
import { extensionServices } from '../../../services/extensionService';
import Toast from "primevue/toast";
import RadioButton from "primevue/radiobutton";
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import SelectStaffDialog from '../../../components/dashboard/extension/SelectStaffDialog.vue';
import SelectedStaffList from '../../../components/dashboard/extension/SelectedStaffList.vue';
import { useStaffSelectionStore } from '../../../stores/staffSelection';


const menuStore = useMenuStore();
menuStore.setActiveMenu('/admin/staffs');

const route = useRoute()
const organizationId = route.params.organizationId

const staffSelection = useStaffSelectionStore();


const loading = ref(false)

const form = ref({
  name: '',
  organizationId: organizationId,
})

const selectedIcon = ref("star.png");

const options = [
  { label: "favorite", value: "star.png", icon: "/images/icons/star.png" },
  { label: "baverage", value: "baverage.png", icon: "/images/icons/baverage.png" },
  { label: "other", value: "other.png", icon: "/images/icons/other.png" },
  { label: "utensil", value: "utensil.png", icon: "/images/icons/utensil.png" },
  { label: "loundry", value: "loundry.png", icon: "/images/icons/loundry.png" },
  { label: "gym", value: "gym.png", icon: "/images/icons/gym.png" },
  { label: "wrench", value: "wrench.png", icon: "/images/icons/wrench.png" },
  { label: "car", value: "car.png", icon: "/images/icons/car.png" },
  { label: "aid", value: "aid.png", icon: "/images/icons/aid.png" },
  { label: "flower", value: "flower.png", icon: "/images/icons/flower.png" },
  { label: "pool", value: "pool.png", icon: "/images/icons/pool.png" },
  { label: "phone", value: "phone.png", icon: "/images/icons/phone.png" },
  { label: "cctv", value: "cctv.png", icon: "/images/icons/cctv.png" },
  { label: "building", value: "building.png", icon: "/images/icons/building.png" },
  { label: "cleaning", value: "cleaning.png", icon: "/images/icons/cleaning.png" },
];

const days = ref([
  { day_of_week: 7, name: "sunday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
  { day_of_week: 1, name: "monday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
  { day_of_week: 2, name: "tuesday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
  { day_of_week: 3, name: "wednesday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
  { day_of_week: 4, name: "thursday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
  { day_of_week: 5, name: "friday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
  { day_of_week: 6, name: "saturday", checked: false, start_time: new Date(0, 0, 0, 0, 0), end_time: new Date(0, 0, 0, 0, 0) },
]);

const router = useRouter();

const toast = useToast();

const handleSubmit = async () => {

  loading.value = true

  const extension_operation_hours: any[] = []

  days.value.map((data) => {    

    if(data.checked){

        const formatTime = (date: Date): string => {
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
        };

        extension_operation_hours.push({
            day_of_week: data.day_of_week,
            start_time: formatTime(data.start_time),
            end_time: formatTime(data.end_time)
        })
        // return data
    }
  })


  const extension_assigned_staffs: string[] = []

  staffSelection.selectedStaff.map( data =>  extension_assigned_staffs.push(data.user_id) )

  const newExtSubmit = {
    organization_id: organizationId,
    name: form.value.name,
    icon: selectedIcon.value,
    status_id: 1,
    extension_operation_hours,
    extension_assigned_staffs
  }

//   console.log("newExtSubmit >>> ", newExtSubmit);

  const res = await extensionServices.createNewExtension(newExtSubmit)


  if (res.status == 201) {

    toast.add({
        severity: "info",
        summary: "Success",
        detail: 'A new extension has been successdully created',
        group: "custom",
        life: 100000,
    });
    
    setTimeout(() =>  router.push({ name: "ListExtension", params: { organizationId } }), 2500);
  }
  
  loading.value = false
}



const showDialog = ref(false);



</script>


<template>
    <DashboardUserLayout>

        <div class="bg-white rounded-2xl shadow-sm pt-6 px-6 pb-12 w-full mx-auto space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">

            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-3">
                <Icon icon="weui:back-filled" width="12" height="24" />
                <span>Add New Extension</span>
            </h2>

            <Button label="Custom Icon" @click="handleSubmit" severity="secondary" class="flex! rounded-3xl! justify-between!">
                <Icon icon="material-symbols:save-outline" width="22" height="22" />
                <span class="me-2">Save</span>
            </Button>
            </div>

            <hr class="border-gray-400" />

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Name -->
                <div>
                    <label for="name" class="block text-gray-700 font-medium mb-2">
                        Extension Name <span class="text-red-500">*</span>
                    </label>
                    <InputText
                        id="name"
                        v-model="form.name"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                        placeholder="Enter name"
                        required
                    />
                </div>

                <div>
                    <label for="selectIcon" class="block text-gray-700 font-medium mb-2">
                        Select Icon
                    </label>
                    <p class="text-gray-500 mb-4">Choose an icon to represent this extension. A default icon is already selected, and you can change it anytime.</p>
                    
                    <div class="flex gap-3">
                        <div
                            v-for="option in options"
                            :key="option.value"
                            class="flex items-center justify-center w-14 h-14 rounded-lg border cursor-pointer transition-all duration-200"
                            :class="
                                selectedIcon === option.value
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-gray-300 hover:border-sky-300 hover:bg-sky-50'
                            "
                            @click="selectedIcon = option.value"
                            >
                            <!-- Hidden Radio -->
                            <RadioButton v-model="selectedIcon" :inputId="option.value" :value="option.value" class="hidden!" />

                            <!-- Local image icon -->
                            <img :src="option.icon" alt="icon" class="w-6 h-6 object-contain" :class="selectedIcon === option.value ? 'opacity-100' : 'opacity-70'"/>

                        </div>
                    </div>

                </div>

                <div>
                    <label for="selectIcon" class="block text-gray-700 font-medium mb-2">
                        Operations Hours
                    </label>
                    <p class="text-gray-500 mb-4">Operational hours will determine when this extension is active.</p>
                    
                    <div class="flex flex-col gap-3">

                        <div v-for="day in days" :key="day.name" class="flex items-center gap-3">
                            <!-- Checkbox -->
                            <Checkbox v-model="day.checked" :inputId="day.name" binary class="scale-125"/>
                            <label :for="day.name" class="w-24 capitalize">{{ day.name }}</label>

                            <!-- Start Time -->
                            <div class="flex items-center gap-2">
                                <Calendar
                                    v-model="day.start_time"
                                    timeOnly
                                    hourFormat="24"
                                    updateModelType="date"
                                    :disabled="!day.checked"
                                    class="w-28"
                                    inputClass="text-center"
                                />
                            </div>

                            <span>-</span>

                            <!-- End Time -->
                            <div class="flex items-center gap-2">
                                <Calendar
                                    v-model="day.end_time"
                                    timeOnly
                                    hourFormat="24"
                                    updateModelType="date"
                                    :disabled="!day.checked"
                                    class="w-28"
                                    inputClass="text-center"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                 <div>
                    <label for="selectIcon" class="block text-gray-700 font-medium mb-2">
                        Assigned Staff
                    </label>
                    <p class="text-gray-500 mb-4">Assign one or more staff to handle calls for this extension.</p>

                    <SelectedStaffList  v-if="staffSelection.selectedStaff.length > 0" class="mb-4" />
                    
                    <div class="flex gap-3">
                        <Button label="Select Staff" @click="showDialog = true" severity="secondary" class="flex! rounded-3xl! justify-between! bg-white! text-cyan-500! border-cyan-500!">
                            <span class="me-2">Select Staff</span>
                        </Button>
                    </div>
                </div>

                


            </form>
        </div>

        <SelectStaffDialog v-model:visible="showDialog" />

        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div class="flex items-center gap-3 text-gray-800 px-4 py-3 shadow-sm border border-sky-200">
                <Icon icon="bi:check-circle" width="38" height="38" />
                <div>
                    <p class="font-medium text-sm">{{ message.summary }}</p>
                    <p class="text-sm">{{ message.detail }}</p>
                </div>
                </div>
            </template>
        </Toast>
       
    </DashboardUserLayout>
</template>

<style>

.p-datepicker-input {
    width: -webkit-fill-available;
}
</style>