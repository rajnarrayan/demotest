import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ConferenceData,
  Group,
  ScheduleDay,
  Session,
  Speaker,
} from '../interfaces/conference.interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  http = inject(HttpClient);
  user = inject(UserService);
  data: ConferenceData | null = null;

  loadFullConferenceData() {
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get<ConferenceData>('assets/data/data.json')
        .pipe(map(this.processData, this));
    }
  }

  /*loadSimplifiedScheduleData() {
    return this.http.get<{ schedule: ScheduleDay[] }>(     
      'https://localhost:7150/Dashboard/GetAllSchedule'
    );
  }*/
/*loadSimplifiedScheduleData() {
  
const payload = {
    username: "admin",
    password: "Shift@123"
  };

  return this.http.post<{ schedule: ScheduleDay[] }>(
    'https://localhost:7150/Dashboard/GetAllScheduleNew',payload
     // 👈 request body (use {} if no payload required)
  );
}*/
/*loadSimplifiedScheduleData() { 

  return this.http.post<{ schedule: ScheduleDay[] }>(
    'https://localhost:7150/Dashboard/GetAllSchedulePost',{}
     // 👈 request body (use {} if no payload required)
  );
}*/
/*loadSimplifiedScheduleData() { 

  return this.http.get<{ schedule: ScheduleDay[] }>(
    'https://localhost:7150/Dashboard/GetAllScheduleGet',{}
     
  );
}*/
loadSimplifiedScheduleData() { 

  return this.http.post<{ schedule: ScheduleDay[] }>(
    'https://mobileapi.neonintelli.com/Dashboard/GetAllSchedule',{}
     
  );
}



  processData(data: ConferenceData): ConferenceData {
    this.data = data;

    this.data.schedule.forEach((day: ScheduleDay) => {
      if (day.groups) { // Check if groups exist for this day
        day.groups.forEach((group: Group) => {
          group.sessions.forEach((session: Session) => {
            session.speakers = [];
            if (session.speakerNames) {
              session.speakerNames.forEach((speakerName: string) => {
                const speaker = this.data.speakers.find(
                  (s: Speaker) => s.name === speakerName
                );
                if (speaker) {
                  session.speakers.push(speaker);
                  speaker.sessions = speaker.sessions || [];
                  speaker.sessions.push(session);
                }
              });
            }
          });
        });
      }
    });

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', segment = 'all') {
    return this.loadSimplifiedScheduleData().pipe(
      map(data => {
        const day = data.schedule[dayIndex];
        day.shownSessions = 0;

        queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        const queryWords = queryText
          .split(' ')
          .filter(w => !!w.trim().length);

        day.sessions?.forEach((session: Session) => { // Use optional chaining for sessions
          this.filterSession(session, queryWords, segment);

          if (!session.hide) {
            day.shownSessions++;
          }
        });

        return day;
      })
    );
  }

  filterSession(session: Session, queryWords: string[], segment: string) {
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }

    let matchesSegment = false;
    if (segment === 'favorites') {
      if (session.name && this.user.hasFavorite(session.name)) { // Check session.name for safety
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    session.hide = !(matchesQueryText && matchesSegment);
  }

  getSpeakers() {
    return this.loadFullConferenceData().pipe(map((data: ConferenceData) => data.speakers));
  }

  getTracks() {
    return this.loadFullConferenceData().pipe(map((data: ConferenceData) => data.tracks));
  }

  getMap() {
    return this.loadFullConferenceData().pipe(map((data: ConferenceData) => data.map));
  }
}
