import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'startpage', pathMatch: 'full' },
  // { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'startpage', loadChildren: './pages/startpage/startpage.module#StartpagePageModule' },
  // { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  // { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'requestride', loadChildren: './pages/requestride/requestride.module#RequestridePageModule' },
  { path: 'bookingconfirmation', loadChildren: './pages/bookingconfirmation/bookingconfirmation.module#BookingconfirmationPageModule' },
  { path: 'pickup', loadChildren: './pages/pickup/pickup.module#PickupPageModule' },
  { path: 'promo', loadChildren: './pages/promo/promo.module#PromoPageModule' },
  { path: 'addcard', loadChildren: './pages/addcard/addcard.module#AddcardPageModule' },
  { path: 'feedbackgiven', loadChildren: './pages/feedbackgiven/feedbackgiven.module#FeedbackgivenPageModule' },
  // { path: 'history', loadChildren: './pages/history/history.module#HistoryPageModule' },
  // { path: 'list', loadChildren: './pages/list/list.module#ListPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
