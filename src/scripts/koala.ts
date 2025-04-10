import type {Result} from "@/scripts/result.ts";
import type {ApiError} from "@/scripts/error.ts";
import {fetch1} from "@/scripts/fetch1.ts";

interface ResponseKoalaActivity {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  poster: string;
  participant_counter: string;
}

export interface KoalaActivity extends ResponseKoalaActivity {
  has_start_time: boolean;
  has_end_time: boolean;
}

export class KoalaApi {
  public static async loadActivities(): Promise<Result<KoalaActivity[], ApiError>> {
    // Fetch activities, transform JSON to KoalaActivity, sort by start date
    
    return (await (await fetch1(`https://koala.svsticky.nl/api/activities`, {
      headers: {
        'Accept': 'application/json',
      }
    }))
      // Transform response to activities
      .map1(async (response) => {
        const payload: ResponseKoalaActivity[] = await response.json();
        return payload.map((activity) => <KoalaActivity> {
          has_start_time: activity.start_date.indexOf('T') > -1,
          has_end_time: activity.end_date && activity.end_date.indexOf('T') > -1,
          ...activity
        })
      })
    )
      // Sort based on activity start date, sooner to later
      .map((activities) => activities.sort((a, b) => {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      }));
  }
}