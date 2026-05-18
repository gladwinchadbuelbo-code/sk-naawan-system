<template>
  <div class="bg-cards rounded-xl shadow-sm border border-borders p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-textMain text-base">{{ title }}</h3>
      <slot name="action"></slot>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
