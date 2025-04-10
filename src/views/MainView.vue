<template>
  <div class="error-banner" v-if="error">
    <span class="error-text"> {{ error }} </span>
  </div>

  <div class="weekly-overview-flex-container">
    <div class="weekly-overview-container">
      <div class="weekly-overview-title">
        Weekly overview
      </div>

      <DayComponent
        class="weekly-overview-item"
        v-for="(activity, idx) in activities"
        :activities="activity"
        :date="new Date(new Date().setDate(getMonday(new Date).getDate() + idx))"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {KoalaActivity, KoalaApi} from "@/scripts/koala.ts";
import KoalaActivityComponent from "@/components/KoalaActivityComponent.vue";
import DayComponent from "@/components/DayComponent.vue";

interface Data {
  error?: string,
  loading: boolean,
  activities: KoalaActivity[][],
}

export default defineComponent({
  name: "MainView",
  components: {DayComponent, KoalaActivityComponent},
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

      if(r.isOk()) {
        const activities = r.unwrap();
        const thisWeek = this.thisWeekFilter(activities);
        this.activities = this.splitByDay(thisWeek);
      } else {
        this.error = r.unwrapErr().message ?? "Er is iets verkeerd gegaan, probeer het later opnieuw";
      }

      this.loading = false;
    },
    thisWeekFilter(input: KoalaActivity[]): KoalaActivity {
      const monday = this.getMonday(new Date());
      let friday = new Date();
      friday.setDate(monday.getDate() + 7);

      return input.filter((activity) => {
        const start = new Date(activity.start_date);
        const end = new Date(activity.end_date);

        return start >= monday && end <= friday;
      });
    },
    getMonday(d) {
      d = new Date(d);
      let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },
    splitByDay(input: KoalaActivity[]): KoalaActivity[][] {
      let output: KoalaActivity[][] = [[], [], [], [], [], [], []];
      const monday = this.getMonday(new Date());

      for (const activity of input) {
        const diffTime = Math.abs(new Date(activity.start_date) - monday);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if(output[diffDays]) {
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

.error-banner {
  background-color: indianred;
}

.error-text {
  color: white;
}

.weekly-overview-flex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.weekly-overview-container {
  border: black solid 2px;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.weekly-overview-item {
  padding: 0;
  margin: 1rem;

  border-radius: 5px;
}

.weekly-overview-title {
  font-size: 35px;
  font-family: Ubuntu, serif;
}

</style>