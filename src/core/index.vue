<template>
  <div ref="canvasContainerRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { Stylize } from './index';

const canvasContainerRef = ref<HTMLElement | null>(null);
onMounted(() => {
  nextTick(() => {
    const stylize = new Stylize({
      width: 800,
      height: 800,
      container: canvasContainerRef.value,
    });
    stylize.draw({
      type: 'texty',
      data: {
        url: '/src/assets/a.jpg',
        text: '@#$%&*-=:. ',
        orderly: false,
        scale: 10,
      },
    });
  });
});
</script>

<style scoped></style>
