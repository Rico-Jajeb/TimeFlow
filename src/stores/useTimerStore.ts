// stores/useTimerStore.ts
import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'

import song from '@/assets/MinionBanana.mp3'

export const useTimerStore = defineStore('timer', () => {
  const toast = useToast()
  const audio = new Audio(song)

  const totalSeconds = ref(0)
  const hoursInput = ref<number | null>(null)
  const minutesInput = ref<number | null>(null)
  const secondsInput = ref<number | null>(null)
  const isAlarmPlaying = ref(false)
  let intervalId: number | null = null

  // Format time into hh:mm:ss
  const formattedTime = computed(() => {
    const hrs = Math.floor(totalSeconds.value / 3600)
      .toString()
      .padStart(2, '0')
    const mins = Math.floor((totalSeconds.value % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const secs = (totalSeconds.value % 60).toString().padStart(2, '0')
    return `${hrs}:${mins}:${secs}`
  })

  const startTimer = () => {
    if (intervalId === null && totalSeconds.value === 0) {
      totalSeconds.value =
        (hoursInput.value ?? 0) * 3600 + (minutesInput.value ?? 0) * 60 + (secondsInput.value ?? 0)
    }

    if (intervalId === null && totalSeconds.value > 0) {
      intervalId = window.setInterval(() => {
        if (totalSeconds.value > 0) {
          totalSeconds.value--
        } else {
          pauseTimer()
          audio.currentTime = 0
          audio.play()
          isAlarmPlaying.value = true
          toast.add({
            severity: 'success',
            summary: '⏰ Time’s up!',
            detail: 'Timer has reached zero!',
            life: 40900,
          })
        }
      }, 1000)
    }
  }

  const stopAlarm = () => {
    audio.pause()
    audio.currentTime = 0
    isAlarmPlaying.value = false
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

  return {
    // state
    totalSeconds,
    hoursInput,
    minutesInput,
    secondsInput,
    formattedTime,
    isAlarmPlaying,

    // actions
    startTimer,
    pauseTimer,
    resetTimer,
    stopAlarm,
  }
})
