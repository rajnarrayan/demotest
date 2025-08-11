import { Routes } from '@angular/router';
import { canDeactivateSupportPage } from './providers/can-deactivate-support.guard';
import { checkTutorialGuard } from './providers/check-tutorial.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginPage),
    canActivate: [() => {
      // Logic to check login status and redirect
      const isLoggedIn = true; // Replace with actual login check
      return isLoggedIn ? '/app/tabs/schedule' : true;
    }],
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account').then(m => m.AccountPage),
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./pages/support/support').then(m => m.SupportPage),
    canDeactivate: [canDeactivateSupportPage],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup').then(m => m.SignupPage),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/tabs-page/routes').then(m => m.TABS_ROUTES),
  },
  {
    path: 'tutorial',
    loadComponent: () =>
      import('./pages/tutorial/tutorial').then(m => m.TutorialPage),
    canMatch: [checkTutorialGuard],
  },
];
