<template>
  <div class="koala-activity">
    <div class="time">
      <span>{{ startTime }}</span>
      <span v-if="!!endTime">-</span>
      <span v-if="!!endTime">{{ endTime }}</span>
    </div>

    <div class="name"> {{ activity.name }} </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue"
import type { KoalaActivity } from "@/scripts/koala.ts";

export default defineComponent({
  props: {
    activity: {
      type: Object as PropType<KoalaActivity>,
      required: true,
    }
  },
  computed: {
    startTime(): string {
      return this.formatTime(this.activity.start_date);
    },
    endTime(): string | null {
      return this.activity.end_date
        ? this.formatTime(this.activity.end_date)
        : null;
    }
  },
  methods: {
    prefixZero(input: number): string {
      return input < 10 ? `0${input}` : `${input}`;
    },
    formatTime(input: string): string {
      const date = new Date(input);

      return `${this.prefixZero(date.getHours())}:${this.prefixZero(date.getMinutes())}`;
    }
  }
})
</script>

<style lang="scss">
.koala-activity {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 1rem;
  color: white;
  font-size: .9rem;

  .time {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    margin: auto 0;
  }

  .name {
    line-height: 1.1;
    font-weight: bold;
    font-size: .9rem;
    margin: auto 0;
  }
}
</style>
