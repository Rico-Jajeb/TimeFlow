<script setup lang="ts">
import { useTimerStore } from '@/stores/useTimerStore'
import { storeToRefs } from 'pinia'

const timerStore = useTimerStore()

// keep refs reactive
const { hoursInput, minutesInput, secondsInput, formattedTime } = storeToRefs(timerStore)

// use methods directly (not refs)
const { startTimer, pauseTimer, resetTimer, stopAlarm } = timerStore
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-6">
    <!-- Time Input -->
    <div class="flex gap-2 items-center">
      <input
        type="number"
        v-model.number="hoursInput"
        min="0"
        placeholder="Hours"
        class="border p-2 rounded w-24"
      />
      <input
        type="number"
        v-model.number="minutesInput"
        min="0"
        max="59"
        placeholder="Minutes"
        class="border p-2 rounded w-24"
      />
      <input
        type="number"
        v-model.number="secondsInput"
        min="0"
        max="59"
        placeholder="Seconds"
        class="border p-2 rounded w-24"
      />
    </div>

    <!-- Timer Display -->
    <div class="text-4xl font-mono">
      {{ formattedTime }}
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button @click="startTimer" class="px-4 py-2 bg-green-500 text-white rounded">Start</button>
      <button @click="pauseTimer" class="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>
      <button @click="resetTimer" class="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
    </div>
  </div>
</template>
