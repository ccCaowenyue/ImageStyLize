<template>
  <div ref="canvasContainerRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { Stylize } from "./index";

const canvasContainerRef = ref<HTMLElement | null>(null);
onMounted(() => {
  nextTick(() => {
    const stylize = new Stylize({
      width: 400,
      height: 400,
      container: canvasContainerRef.value,
    });
    stylize.draw({
      type: "oil",
      data: {
        url: "/src/assets/a.jpg",
        radius: 4,
        intensity: 255,
      },
    });
  });
});
</script>

<style scoped></style>
