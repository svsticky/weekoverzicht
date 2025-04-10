<template>
  <div class="day-container" v-if="hasActivities">
    <div :class="`name-of-day-container ${containerHeightClass}`">
      <div :class="`name-of-day-holder ${containerHeightClass}`">
        <span class="day-name">
        {{ nameOfDay }}
        </span>
      </div>
    </div>

    <div :class="`content-of-day-container ${containerHeightClass}`">
      <KoalaActivityComponent
        v-for="activity in activities"
        :activity="activity"
        class="content-of-day"
      />

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue"
import type {KoalaActivity} from "@/scripts/koala.ts";
import KoalaActivityComponent from "@/components/KoalaActivityComponent.vue";

export default defineComponent({
  components: {KoalaActivityComponent},
  props: {
    date: {
      type: Object as PropType<Date>,
      required: true,
    },
    activities: {
      type: Array as PropType<KoalaActivity[]>,
      required: true,
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
  padding: 3rem;

  display: flex;
  flex-direction: row;
  justify-items: start;
  align-items: center;
}

.name-of-day-holder {
  background-color: lightblue;
  padding: 1rem 3rem;
  border-radius: $border-radius;
  width: 10rem;
  position: relative;
  height: $name-of-day-height;
  // Height of container - half the height of self
  vertical-align: center;
}

.name-of-day-holder.day-height-single {
  top: math.div($day-height-single, 2) - math.div($name-of-day-height, 2);
}

.name-of-day-holder.day-height-double {
  top: math.div($day-height, 2) - math.div($name-of-day-height, 2);
}

.name-of-day-container.day-height-single,
.content-of-day-container.day-height-single {
  height: $day-height-single;
}

.name-of-day-container.day-height-double,
.content-of-day-container.day-height-double {
  height: $day-height
}

.name-of-day-container {
  background: linear-gradient(90deg, #FFFFFF 75%, main.$board_color 25%);
}

.day-name {
  color: main.$board_color;
  font-weight: bold;
}

.content-of-day-container {
  width: 30rem;
  height: $day-height;

  padding: 2rem 1rem;
  background-color: main.$board-color;
  border-radius: 0 $border-radius $border-radius 0;
}

.content-of-day {
  margin-bottom: 1rem;
}
</style>