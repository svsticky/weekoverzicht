<template>
  <li class="day-container">
    <span class="day-name">
      {{ nameOfDay }}
    </span>

    <div
      v-if="!!activities.length"
      :class="{
        'content-of-day-container': true,
        'full-height': activities.length == 2,
        'half-height': activities.length == 1
      }"
    >
      <KoalaActivityComponent
        v-for="activity in activities"
        :activity="activity"
        class="content-of-day" />
    </div>

    <div
      v-else
      class="content-of-day-container half-height no-activities"
    >
      <span>No activities</span>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue"
import type { KoalaActivity } from "@/scripts/koala.ts";
import KoalaActivityComponent from "@/components/KoalaActivityComponent.vue";

export default defineComponent({
  components: { KoalaActivityComponent },
  props: {
    date: {
      type: Object as PropType<Date>,
      required: true
    },
    activities: {
      type: Array as PropType<KoalaActivity[]>,
      required: true
    }
  },
  computed: {
    hasActivities(): boolean {
      return this.activities.length != 0;
    },
    nameOfDay(): string {
      switch (this.date.getDay()) {
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        case 0: return "Sunday";
        default: throw new Error("Invalid input, expected number between 0-6");
      }
    },
    containerHeightClass(): string {
      return this.activities.length == 1
        ? "day-height-single"
        : "day-height-double";
    }
  }
})
</script>

<style scoped lang="scss">
@use "@/assets/main";
@use "sass:math";

$border-radius: 10px;

$day-height: 10rem;
$day-height-single: 7.5rem;

$name-of-day-height: 3.5rem;

.day-container {
  font-family: 'Outfit', sans-serif;
  position: relative;
  width: 100%;

  .day-name {
    color: main.$board_color;
    font-weight: bold;
    position: absolute;
    top: 50%;
    transform: translate(.75rem, -50%);
    font-size: 1.1rem;
    width: calc(1.1 * 9ch);
    z-index: 10;
    background: #cbf3f0;
    padding: .75rem .5rem;
    border-radius: 10px;
  }

  .content-of-day-container {
    width: calc(100% - 1.1 * 9ch + 1rem);
    padding: .5rem 1rem .5rem 4.5rem;
    background-color: main.$board-color;
    border-radius: 10px;
    transform: translateX(4rem);
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;
    gap: .75rem;

    &.half-height {
      height: 4rem;
    }

    &.full-height {
      height: 8rem;
    }

    &.no-activities {
      grid-template-rows: 1fr;

      span {
        margin: auto;
        line-height: 1.1;
        font-weight: bold;
        font-size: .9rem;
        color: white;
        display: block;
      }
    }
  }
}
</style>
