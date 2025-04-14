<template>
  <div class="error-banner" v-if="error">
    <span>{{ error }}</span>
  </div>

  <div class="weekly-overview-container">
    <img id="dots-top-left" src="../assets/small_dots.png" />
    <img id="orange-flower-left" src="../assets/orange_flower.png" />
    <img id="orange-flower-right" src="../assets/orange_flower.png" />
    <img id="dots-bottom-right" src="../assets/big_dots.png" />

    <h1 class="weekly-overview-title">
      Weekly overview
    </h1>

    <ul>
      <DayComponent
        v-for="(activity, idx) in activities"
        :activities="activity"
        :date="new Date(new Date().setDate(getMonday(new Date).getDate() + idx))"
        :idx="idx"
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
      activities: [[]],
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
        this.activities = this.splitByDay(thisWeek).filter(l => !!l.length).slice(0, 5);
      } else {
        this.error = r.unwrapErr().message ?? "Er is iets verkeerd gegaan, probeer het later opnieuw";
      }

      this.loading = false;
    },
    thisWeekFilter(input: KoalaActivity[]): KoalaActivity[] {
      const monday = this.getMonday(new Date());
      let friday = new Date();
      friday.setDate(monday.getDate() + 7);

      // return input.filter((activity) => {
      //   const start = new Date(activity.start_date);
      //   const end = activity.end_date
      //     ? new Date(activity.end_date)
      //     : start;

      //   return start >= monday && end <= friday;
      // });
      return input;
    },
    getMonday(d: Date) {
      const day = d.getDay();
      const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },
    splitByDay(input: KoalaActivity[]): KoalaActivity[][] {
      let output: KoalaActivity[][] =
        new Array(21).fill(0).map(() => []);
      const monday = this.getMonday(new Date());

      for (const activity of input) {
        const diffTime = Math.abs(new Date(activity.start_date).getTime() - monday.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (output[diffDays]) {
          output[diffDays].push(activity)
        } else {
          output[diffDays] = [activity];
        }
      }

      return output;
    }
  }
})
</script>

<style scoped lang="scss">
@use "@/assets/main";
@use "sass:color";

$title-orange: #ff9f1c;

.error-banner {
  background-color: indianred;
  color: white;
}

#dots-top-left {
  position: absolute;
  top: -5px;
  left: -9px;
  width: 40px;
  aspect-ratio: 1 / 1;
  z-index: 0;
}

#orange-flower-left {
  position: absolute;
  top: 200px;
  left: -16px;
  width: 60px;
  aspect-ratio: 1 / 1;
  z-index: 0;
}

#orange-flower-right {
  position: absolute;
  top: 490px;
  right: -10px;
  width: 40px;
  aspect-ratio: 1 / 1;
  z-index: 0;
  transform: rotate(10deg);
}

#blue-flower-left {
  position: absolute;
  top: 635px;
  left: 3rem;
  width: 40px;
  aspect-ratio: 1 / 1;
  z-index: 3;
}

#dots-bottom-right {
  position: absolute;
  bottom: -20px;
  right: -14px;
  width: 6rem;
  aspect-ratio: 1 / 1;
  z-index: 4;
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
    color: $title-orange;
    text-shadow: color.adjust($title-orange, $alpha: -0.5) 4px 2px;
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
