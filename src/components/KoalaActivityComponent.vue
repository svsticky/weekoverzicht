<template>
  <div class="koala-activity">
    <div class="time">
      <span>{{ startTime }}</span>
      <span>-</span>
      <span>{{ endTime }}</span>
    </div>

    <div class="name"> {{ activity.name }} </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import {KoalaActivity} from "@/scripts/koala.ts";

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
    endTime(): string {
      return this.formatTime(this.activity.end_date);
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

<style scoped lang="scss">
.koala-activity {
  color: #FFFFFF;

  display: flex;
  flex-direction: row;

}

.time {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;

  margin-right: 1rem;
}

.name {
  line-height: 1;
  font-weight: bold;
}
</style>