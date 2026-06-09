import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { MainComponent } from './views/main/main.component';
import { BlogComponent } from './views/blog/blog.component';
import { DetailsComponent } from './views/details/details.component';
import { AuthForwardGuard } from './core/auth/auth-forward.guard';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    { path: '', component: MainComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'article/:url', component: DetailsComponent },
    { path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule), canActivate: [AuthForwardGuard] },
  ]
},
{ path: 'privacy-policy', component: PrivacyPolicyComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
