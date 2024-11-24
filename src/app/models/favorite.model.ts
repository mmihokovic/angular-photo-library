import { Photo } from './photo.model';

export interface Favorite extends Photo {
  addedDate: Date; // Date when the photo was added to favourites
}
