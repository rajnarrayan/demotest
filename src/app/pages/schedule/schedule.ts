import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  logoFacebook,
  logoInstagram,
  logoTwitter,
  logoVimeo,
  search,
  shareSocial,
} from 'ionicons/icons';

import { LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Config,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonItemGroup,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonRouterOutlet,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { Session } from '../../interfaces/conference.interfaces';
import { ConferenceService } from '../../providers/conference.service';
import { UserService } from '../../providers/user.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonTitle,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonList,
    IonListHeader,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoadingController,
    ToastController,
    Config,
  ],
})
export class SchedulePage implements OnInit {
  ios: boolean;
  queryText = '';
  shownSessions: number;
  sessions: Session[] = [];
  confDate: string;

  constructor(
    public confService: ConferenceService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserService,
    public config: Config
  ) {
    addIcons({
      search,
      shareSocial,
      logoVimeo,
    });
  }

  // Logic to ensure only the schedule menu is displayed
  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
    this.queryText = '';
    this.shownSessions = 0;
    this.sessions = [];
    this.confDate = '';
    this.loadSchedule();
  }

  loadSchedule() {
    this.confService
      .getTimeline(0, this.queryText, 'all')
      .subscribe(data => {
        this.shownSessions = data.shownSessions;
        this.sessions = data.sessions;
        this.router.navigate(['/schedule']); // Redirect to /schedule after loading
      });
  }
}
