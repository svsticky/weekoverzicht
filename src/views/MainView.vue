<template>
  <div class="error-banner" v-if="error">
    <span>{{ error }}</span>
  </div>

  <div class="weekly-overview-container">
    <h1 class="weekly-overview-title">
      Weekly overview
    </h1>

    <ul>
      <DayComponent
        v-for="(activity, idx) in activities.slice(0, 5)"
        :activities="activity"
        :date="new Date(new Date().setDate(getMonday(new Date).getDate() + idx))"
      />

      <DayComponent
        v-if="!!activities[5].length"
        :activities="activities[5]"
        :date="new Date(new Date().setDate(getMonday(new Date).getDate() + 5))"
      />

      <DayComponent
        v-if="!!activities[6].length"
        :activities="activities[6]"
        :date="new Date(new Date().setDate(getMonday(new Date).getDate() + 6))"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { type KoalaActivity, KoalaApi } from "@/scripts/koala.ts";
import KoalaActivityComponent from "@/components/KoalaActivityComponent.vue";
import DayComponent from "@/components/DayComponent.vue";

interface Data {
  error?: string,
  loading: boolean,
  activities: KoalaActivity[][],
}

export default defineComponent({
  name: "MainView",
  components: { DayComponent, KoalaActivityComponent },
  data(): Data {
    return {
      error: undefined,
      loading: true,
      activities: [[], [], [], [], [], [], []],
    }
  },
  async mounted() {
    await this.loadActivities();
  },
  methods: {
    async loadActivities() {
      this.loading = true;
      const r = await KoalaApi.loadActivities();

      if (r.isOk()) {
        const activities = r.unwrap();
        const thisWeek = this.thisWeekFilter(activities);
        this.activities = this.splitByDay(thisWeek);
      } else {
        this.error = r.unwrapErr().message ?? "Er is iets verkeerd gegaan, probeer het later opnieuw";
      }

      this.loading = false;
    },
    thisWeekFilter(input: KoalaActivity[]): KoalaActivity[] {
      const monday = this.getMonday(new Date());
      const friday = new Date();
      friday.setDate(monday.getDate() + 7);

      return input.filter((activity) => {
        const start = new Date(activity.start_date);
        const end = activity.end_date
          ? new Date(activity.end_date)
          : start;

        return start >= monday && end <= friday;
      });
    },
    getMonday(d: Date) {
      const day = d.getDay();
      const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },
    splitByDay(input: KoalaActivity[]): KoalaActivity[][] {
      const output: KoalaActivity[][] = new Array(7).fill(0).map(() => []);

      for (const activity of input) {
        const day_index = new Date(activity.start_date).getDay();
        output[day_index].push(activity);
      }

      return output.slice(1, 6).concat([output[6], output[0]]);
    }
  }
})
</script>

<style scoped lang="scss">
@use "@/assets/main";
@use "sass:color";

.error-banner {
  background-color: indianred;
  color: white;
}

.weekly-overview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f1f1f1, #ffffff);
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  // border: 1px solid black;
  padding-bottom: 3rem;

  h1 {
    font-size: 62.5px;
    font-family: "Winky Sans", Ubuntu, serif;
    font-weight: bold;
    color: main.$board_color;
    text-shadow: color.adjust(main.$board_color, $alpha: -0.5) 4px 2px;
    z-index: 10;
  }

  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      padding: 0;
      margin-bottom: 1rem;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
