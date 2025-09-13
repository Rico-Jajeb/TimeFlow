<template>
  <div class="flex flex-col items-center gap-4 p-6">
    <h1 class="text-2xl font-bold">⏲ Countdown Timer</h1>

    <!-- Time Input -->
    <div class="flex gap-2 items-center">
      <input
        type="number"
        v-model.number="minutesInput"
        min="0"
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

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const totalSeconds = ref(0)
const minutesInput = ref(5) // default 5 minutes
const secondsInput = ref(0)
let intervalId: number | null = null

// Format seconds into mm:ss
const formattedTime = computed(() => {
  const mins = Math.floor(totalSeconds.value / 60)
    .toString()
    .padStart(2, '0')
  const secs = (totalSeconds.value % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
})

const startTimer = () => {
  // If not running, set time from input
  if (intervalId === null && totalSeconds.value === 0) {
    totalSeconds.value = minutesInput.value * 60 + secondsInput.value
  }

  if (intervalId === null && totalSeconds.value > 0) {
    intervalId = window.setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
      } else {
        pauseTimer()
        alert('⏰ Time’s up!')
      }
    }, 1000)
  }
}

const pauseTimer = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const resetTimer = () => {
  pauseTimer()
  totalSeconds.value = 0
}
onUnmounted(() => pauseTimer())
</script>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}
button:hover {
  opacity: 0.8;
}
</style>
