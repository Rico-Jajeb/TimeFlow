<template>
  <main class="">
    <div class="clock-container">
      <div
        class="clock h-[300px] w-[300px] md:h-[415px] md:w-[410px] border-5 md:border-8 border-solid border-[#333]"
      >
        <!-- Hour and Minute Tick Markers -->
        <div
          v-for="n in 60"
          :key="n"
          :class="['tick', n % 5 === 0 ? 'hour-tick' : 'minute-tick']"
          :style="getTickStyle(n)"
        ></div>

        <!-- Hour Numbers -->
        <div v-for="n in 12" :key="n" class="number" :style="getNumberStyle(n)">
          {{ n }}
        </div>

        <!-- Clock Hands -->
        <div class="hand hour" :style="hourStyle"></div>
        <div class="hand minute" :style="minuteStyle"></div>
        <div class="hand second" :style="secondStyle"></div>
        <div class="center-dot"></div>
      </div>

      <!-- Digital Clock -->
      <div class="digital-clock">{{ digitalHour }}:{{ digitalMinute }}:{{ digitalSecond }}</div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// Screen size state
const screenWidth = ref(window.innerWidth)

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

// Listen for resize
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Single source of truth for current time
const currentTime = ref<Date>(new Date())

// Fetch time from WorldTimeAPI
const fetchTime = async () => {
  try {
    const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Manila')
    currentTime.value = new Date(response.data.datetime)
  } catch (error) {
    console.error('Failed to fetch time:', error)
    currentTime.value = new Date()
  }
}

// Update clock every second
const updateClock = () => {
  currentTime.value = new Date(currentTime.value.getTime() + 1000)
}

// Computed styles for analog hands
const hourStyle = computed(() => {
  const h = currentTime.value.getHours() % 12
  const m = currentTime.value.getMinutes()
  return `transform: rotate(${h * 30 + m * 0.5 - 90}deg)`
})

const minuteStyle = computed(() => {
  const m = currentTime.value.getMinutes()
  const s = currentTime.value.getSeconds()
  return `transform: rotate(${m * 6 + s * 0.1 - 90}deg)`
})

const secondStyle = computed(() => {
  const s = currentTime.value.getSeconds()
  return `transform: rotate(${s * 6 - 90}deg)`
})

// Digital clock
const digitalHour = computed(() => String(currentTime.value.getHours()).padStart(2, '0'))
const digitalMinute = computed(() => String(currentTime.value.getMinutes()).padStart(2, '0'))
const digitalSecond = computed(() => String(currentTime.value.getSeconds()).padStart(2, '0'))

// Tick and number positions
const getTickStyle = (n: number) => {
  const angle = n * 6
  return `transform: rotate(${angle}deg) translateX(-50%)`
}

// Responsive number placement
const getNumberStyle = (n: number) => {
  const angle = (n * 30 - 90) * (Math.PI / 180)

  // if width < 640px → small clock
  if (screenWidth.value < 640) {
    const radius = 120
    const x = 153 + radius * Math.cos(angle) - 12
    const y = 150 + radius * Math.sin(angle) - 12
    return `position: absolute; left: ${x}px; top: ${y}px;`
  }

  // large clock
  const radius = 160
  const x = 200 + radius * Math.cos(angle) - 12
  const y = 200 + radius * Math.sin(angle) - 12
  return `position: absolute; left: ${x}px; top: ${y}px;`
}

let interval: number
onMounted(async () => {
  await fetchTime()
  interval = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Analog Clock Styles */
.clock {
  /* border: 8px solid #333; */
  border-radius: 50%;
  position: relative;
  background: #fff;
}

/* Tick markers */
.tick {
  position: absolute;
  width: 2px;
  height: 10px;
  top: 0px;
  left: 50%;
  background: #333;
  transform-origin: center 200px;
}
.hour-tick {
  height: 20px;
  background: #000;
}
.minute-tick {
  height: 10px;
  background: #555;
}

/* Numbers */
.number {
  font-weight: bold;
  font-size: 20px;
}

/* Hands */
.hand {
  position: absolute;
  width: 50%;
  height: 4px;
  top: 50%;
  left: 50%;
  transform-origin: 0% 50%;
  background: #333;
  border-radius: 2px;
}
.hand.hour {
  width: 35%;
  height: 5px;
  background: #000;
}
.hand.minute {
  width: 45%;
  height: 3px;
  background: #0b23fd;
}
.hand.second {
  width: 45%;
  height: 2px;
  background: red;
}

/* Center dot */
.center-dot {
  width: 12px;
  height: 12px;
  background: #333;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

/* Digital Clock */
.digital-clock {
  margin-top: 20px;
  font-size: 28px;
  font-weight: bold;
  font-family: monospace;
}

/* Small screen adjustments */
@media (max-width: 640px) {
  .hour-tick {
    height: 15px; /* smaller for compact screens */
    background: #333; /* optional tweak */
  }

  .tick {
    transform-origin: center 145px;
  }
  .number {
    font-weight: bold;
    font-size: 12px;
  }
}
</style>
