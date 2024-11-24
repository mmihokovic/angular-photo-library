import { Routes } from '@angular/router';
import { PhotoStreamComponent } from './components/photo-stream/photo-stream.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: 'photos', component: PhotoStreamComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'photos' },
];
