<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import TimerClock from '@/components/clock/TimerClock.vue'
import MainClock from '@/components/clock/MainClock.vue'
import { useToast } from 'primevue/usetoast'

import { useTimerStore } from '@/stores/useTimerStore'
import { storeToRefs } from 'pinia'
const toast = useToast()
const visible = ref(false)
const minimized = ref(false)

function toggleMinimize() {
  minimized.value = !minimized.value
}

const timerStore = useTimerStore()
const { isAlarmPlaying } = storeToRefs(timerStore) // 👈 reactive
const { stopAlarm } = timerStore
</script>

<template>
  <main class="bg-black">
    <div class="flex flex-col items-center justify-center h-screen">
      <MainClock />
      <div class="flex justify-center mt-4">
        <button
          @click="visible = true"
          class="text-2xl font-bold text-white cursor-pointer"
          v-tooltip.top="'Timer'"
        >
          ⏲
        </button>
      </div>
    </div>

    <Dialog
      v-model:visible="visible"
      :style="{ width: '25rem' }"
      :modal="false"
      :class="{ 'minimized-dialog': minimized }"
    >
      <template #header>
        <div class="flex justify-between items-center w-full">
          <span class="font-bold text-lg">⏲ Countdown Timer</span>
          <div class="flex gap-2">
            <button @click="toggleMinimize" class="px-2 text-1xl">—</button>
          </div>
        </div>
      </template>

      <TimerClock />
    </Dialog>

    <!-- Floating button to restore -->
    <button
      v-if="minimized && visible"
      @click="toggleMinimize"
      class="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded shadow cursor-pointer"
    >
      Show Timer
    </button>

    <!-- Global Stop Music Button -->
    <button
      v-if="isAlarmPlaying"
      @click="stopAlarm"
      class="fixed bottom-20 right-4 bg-red-600 text-white px-4 py-2 rounded shadow cursor-pointer"
    >
      🔇 Stop Music
    </button>
  </main>
  <Toast />
</template>

<style>
.minimized-dialog {
  display: none !important;
}
</style>
