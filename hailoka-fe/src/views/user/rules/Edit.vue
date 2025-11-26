<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DashboardUserLayout from '../../../layouts/DashboardUserLayout.vue';
import { Button, useToast } from 'primevue';
import Dropdown from "primevue/dropdown";
import { Icon } from '@iconify/vue';
import { useMenuStore } from '../../../stores/menu';
import { useRoute, useRouter } from 'vue-router';
// import { staffServices } from '../../../services/staffService';
import Toast from "primevue/toast";

import RadioButton from "primevue/radiobutton"
import { extensionRuleServices } from '../../../services/extensionRuleService';

const selected = ref("work_hours")


const menuStore = useMenuStore();
menuStore.setActiveMenu('/admin/staffs');

const route = useRoute()
const organizationId = route.params.organizationId

const extRuleId = route.params.extRuleId


const loading = ref(false)
const error = ref("")

const form = ref({
  extension_id: null,
  extension_destination: null,
  organization_id: organizationId,
  timescope: "",
  condition: ""
})


const extension = ref<{ label: string; value: string }[]>([])

async function fetchExtension() {

  try {

    loading.value = true;
    // error.value = "";

    const response = await extensionRuleServices.getExtensionSelectByOrg(organizationId as string)

    extension.value = response.data.data.map((data: any) => ({
      label: data.name,
      value: data.id,
    }))


  } catch (err: any) {
    console.error("Error fetching staff:", err);

  } finally {
    loading.value = false;
  }
}

async function fetchExtRule() {

    try {

        loading.value = true;
        error.value = "";

        const response = await extensionRuleServices.getExtensionRuleByExtId(extRuleId as string )

        const extData = response.data.data

        form.value.extension_id = extData.extension_id
        form.value.extension_destination = extData.extension_destination
        form.value.timescope = extData.timescope
        form.value.condition = extData.condition   
    
   } catch (err: any) {

        console.error("Error fetching staff:", err);
        error.value = err.response?.data?.message || "Failed to fetch staff.";
   
    } finally {

    loading.value = false;
  }
    
}

onMounted(fetchExtension)
onMounted(fetchExtRule)


const forwadingRule = [
  {
    label: 'Always Forward',
    value: 'always',
    // description: 'Full access, can manage everything.'
  },
  {
    label: 'Forward When Busy',
    value: 'busy',
    // description: 'Can take actions only on assigned extensions.'
  },
  {
    label: 'Forward When No Answer',
    value: 'no_answer',
    // description: 'Read-only, can view but not edit.'
  },
  {
    label: 'Forward When Unreachable',
    value: 'unreachable',
    // description: 'Read-only, can view but not edit.'
  }
]

const router = useRouter();
const toast = useToast();

const handleSubmit = async () => {

    loading.value = true

    //   console.log(form.value)

    const res = await extensionRuleServices.updateExtensionRule(form.value, extRuleId as string )

    if (res.status == 200) {

        toast.add({
            severity: "info",
            summary: "Success",
            detail: 'The extension rule has been successfully updated',
            group: "custom",
            life: 100000,
        });
        
        setTimeout(() =>  router.push({ name: "ListRulesExtension", params: { organizationId } }), 2500);
    }
    
    loading.value = false
}



</script>


<template>
    <DashboardUserLayout>

        <div class="bg-white rounded-2xl shadow-sm p-6 w-full mx-auto space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">

            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-3">
                <Icon icon="weui:back-filled" width="12" height="24" />
                <span>Edit Rule</span>
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
                        Extension <span class="text-red-500">*</span>
                    </label>
                    <Dropdown
                        id="role"
                        v-model="form.extension_id"
                        :options="extension"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select extention"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-gray-800">{{ slotProps.option.label }}</span>
                                <!-- <span class="text-sm text-cyan-600">{{ slotProps.option.description }}</span> -->
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-gray-700 font-medium mb-2">
                    Forwading Rule <span class="text-red-500">*</span>
                    </label>
                    <Dropdown
                        id="role"
                        v-model="form.condition"
                        :options="forwadingRule"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select rule"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-gray-800">{{ slotProps.option.label }}</span>
                                <!-- <span class="text-sm text-cyan-600">{{ slotProps.option.description }}</span> -->
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <!-- Role -->
                <div>
                    <label for="role" class="block text-gray-700 font-medium mb-2">
                        Destination <span class="text-red-500">*</span>
                    </label>
                    <Dropdown
                        id="role"
                        v-model="form.extension_destination"
                        :options="extension"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select destination"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-gray-800">{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <div class="space-y-4 mt-3">
                    <div>
                        <h3 class="font-medium text-gray-700">Time Rule</h3>
                        <p class="text-sm text-gray-500">
                            Select when this rule will be applied based on the extension's operational hours.
                        </p>
                    </div>

                    <div class="space-y-3">
                        <!-- Work Hours -->
                        <div class="flex items-start gap-3 p-3 rounded-lg hover:border-sky-400 cursor-pointer transition" @click="selected = 'work_hours'">
                            <RadioButton inputId="work" name="timeRule" value="work_hours" v-model="form.timescope" class="mt-0.5" />
                            <div>
                            <label for="work" class="font-medium text-gray-800 cursor-pointer">Work Hours</label>
                            <p class="text-sm text-gray-500">
                                Applied during the extension's operational hours. Example: If the extension operates
                                from 08:00-17:00, the rule will be active within that timeframe.
                            </p>
                            </div>
                        </div>

                        <!-- Off Hours -->
                        <div class="flex items-start gap-3 p-3 rounded-lg hover:border-sky-400 cursor-pointer transition" @click="selected = 'off_hours'">
                            
                            <RadioButton inputId="off" name="timeRule" value="off_hours" v-model="form.timescope" class="mt-0.5"/>
                            <div>
                                <label for="off" class="font-medium text-gray-800 cursor-pointer">Off Hours</label>
                                <p class="text-sm text-gray-500">
                                    Applied outside the extension's operational hours. Example: If the extension operates
                                    from 08:00-17:00, the rule will be active before 08:00 or after 17:00.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>

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
/* Optional subtle glow when selected */
.p-radiobutton-checked .p-radiobutton-box {
  border-color: #0ea5e9 !important; /* sky-500 */
  background: #0ea5e9 !important;
}
</style>