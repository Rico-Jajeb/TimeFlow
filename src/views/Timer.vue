<script setup>
import TimerClock from '@/components/clock/TimerClock.vue'

import Button from 'primevue/button'

import Dialog from 'primevue/dialog'
import { ref } from 'vue'

const visible = ref(false)
</script>
<template>
  <h1>this is timer page</h1>
  <TimerClock />
  <h1>hello</h1>

  <div class="card flex justify-center">
    <Button label="Show" @click="visible = true" class="bg-red-300" />
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Update your information.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Username</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Save" @click="visible = false"></Button>
      </div>
    </Dialog>
  </div>
</template>
