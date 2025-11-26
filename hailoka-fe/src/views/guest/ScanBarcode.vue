<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { guestScanQrService } from "../../services/guestScanQrService";
import { useRouter } from "vue-router";

const qrRegionId = "qr-reader";
let html5QrCode: Html5Qrcode | null = null;

const scanning = ref(false);
const scanResult = ref<string | null>(null);
const cameraId = ref<string | null>(null);
const flashOn = ref(false);
const cameras = ref<{ id: string; label: string }[]>([]);

interface TorchConstraint extends MediaTrackConstraintSet {
  torch?: boolean;
}

const router = useRouter();

const getCameraList = async () => {
  let devices = await Html5Qrcode.getCameras();
  if (devices.every(d => !d.label)) {
    // Ask for permission to reveal camera labels
    await navigator.mediaDevices.getUserMedia({ video: true });
    devices = await Html5Qrcode.getCameras();
  }
  return devices;
};

async function startScan() {
  if (!cameraId.value) return;
  html5QrCode = new Html5Qrcode(qrRegionId);

  const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: 250 };

  try {
    await html5QrCode.start(
      cameraId.value,
      config,
      async (qrCodeMessage) => {
        scanResult.value = qrCodeMessage;
        stopScan(); // stop after successful scan

        // make request api to indentify the property

        const res = await guestScanQrService.scanUrl(qrCodeMessage)

        console.log("res >>> ", res);

        localStorage.setItem("organization_data", res.data.data);

        // alert("response >> " + res.data.data)

        router.push("/guest/home")
        

        // ------------------------------------------


      },
      () => {} // ignore frame errors
    );
    scanning.value = true;
  } catch (err) {
    console.error("Start scan error:", err);
  }
}

async function stopScan() {
  if (html5QrCode && scanning.value) {
    await html5QrCode.stop();
    scanning.value = false;
  }
}

async function toggleFlash() {
  try {
    if (!html5QrCode) return;
    flashOn.value = !flashOn.value;
    await html5QrCode.applyVideoConstraints({
      advanced: [{ torch: flashOn.value } as TorchConstraint],
    });
  } catch (err) {
    console.warn("Flashlight not supported:", err);
  }
}

// 🔥 Automatically select back camera and start scanning
onMounted(async () => {
  try {
    const devices = await getCameraList();
    cameras.value = devices.map(d => ({ id: d.id, label: d.label }));

    // Find back/rear camera if available
    const backCamera = devices.find(d =>
      d.label.toLowerCase().includes("back") ||
      d.label.toLowerCase().includes("rear")
    );

    cameraId.value = backCamera?.id ?? devices[0]?.id ?? null;

    // Wait a short delay before starting scanner (gives time for video element to mount)
    if (cameraId.value) {
      setTimeout(() => startScan(), 500);
    }
  } catch (err) {
    console.error("Camera access error:", err);
  }
});

onBeforeUnmount(async () => {
  await stopScan();
});

</script>

<template>
  <div class="h-screen w-full bg-black relative flex flex-col justify-between">
    <!-- QR Scanner -->
    <div class="flex-1 flex justify-center items-center">
      <div :id="qrRegionId" class="w-full h-full border-2 border-cyan-400 rounded-lg"></div>
    </div>

    <!-- Bottom Controls -->
    <div class="h-[200px] w-full bg-gray-500/20 p-4 flex flex-col justify-center items-center">
      <button
        type="button"
        class="py-3 px-6 bg-cyan-500 rounded-3xl flex items-center space-x-2"
        @click="toggleFlash"
      >
        <img src="/images/flash-ligth.png" alt="flash" class="w-6 h-6" />
        <span class="text-white">{{ flashOn ? "Turn Off" : "Turn On" }}</span>
      </button>

      <div v-if="scanResult" class="text-white mt-4 text-center">
        ✅ Scanned: {{ scanResult }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#qr-reader video {
  border-radius: 0.75rem;
  object-fit: cover;
}
</style>
