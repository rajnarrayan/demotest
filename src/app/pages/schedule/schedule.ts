import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  logoFacebook,
  logoInstagram,
  logoTwitter,
  logoVimeo,
  options,
  search,
  shareSocial,
} from 'ionicons/icons';

import { LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
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
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { Group, Session } from '../../interfaces/conference.interfaces';
import { ConferenceService } from '../../providers/conference.service';
import { UserService } from '../../providers/user.service';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
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
    ModalController,
    AlertController,
    LoadingController,
    ToastController,
    Config,
  ],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  queryText = '';
  excludeTrackNames: string[] = [];
  shownSessions: number;
  groups: Group[] = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public confService: ConferenceService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserService,
    public config: Config
  ) {
    addIcons({
      search,
      options,
      shareSocial,
      logoVimeo,
    });
  }

  // Logic to ensure only the schedule menu is displayed
  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
    this.queryText = '';
    this.excludeTrackNames = [];
    this.shownSessions = 0;
    this.groups = [];
    this.confDate = '';
    this.loadSchedule();
  }

  loadSchedule() {
    this.confService
      .getTimeline(0, this.queryText, this.excludeTrackNames, 'all')
      .subscribe(data => {
        this.shownSessions = data.shownSessions;
        this.groups = data.groups;
        this.router.navigate(['/schedule']); // Redirect to /schedule after loading
      });
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTrackNames },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTrackNames = data;
      this.loadSchedule();
    }
  }
}
