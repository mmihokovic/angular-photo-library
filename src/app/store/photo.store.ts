import { computed, inject, Injectable, signal } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoSignalStore {
  private photoService = inject(PhotoService);

  // Signal to hold the photos array
  private photos = signal<Photo[]>([]);

  // Signal to track loading state
  private loading = signal(false);

  // Read-only signal for photos
  photos$ = this.photos.asReadonly();

  // Read-only signal for loading state
  loading$ = this.loading.asReadonly();

  // Computed signal for favorite photos
  favoritePhotos = computed(() =>
    this.photos().filter((photo) => photo.favorite)
  );

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  // Load photos into the store and handle localStorage for favorites
  loadPhotos(count: number): void {
    if (this.loading()) return; // Prevent multiple concurrent requests

    this.loading.set(true); // Set loading state to true before loading
    this.photoService.loadPhotos(count).subscribe({
      next: (newPhotos) => {
        this.photos.update((currentPhotos) => [...currentPhotos, ...newPhotos]);
        this.loading.set(false); // Set loading state to false after photos are loaded
        this.loadFavoritesFromLocalStorage(); // Load favorites from localStorage after loading photos
      },
      error: (error: Error) => {
        console.error('Error loading photos:', error);
        this.loading.set(false); // Set loading state to false in case of error
      },
    });
  }

  // Toggle favorite status of a photo
  toggleFavorite(photoId: string): void {
    this.photos.update((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
      )
    );

    this.saveFavoritesToLocalStorage(); // Save updated favorites to localStorage
  }

  // Method to reset photos
  resetPhotos(): void {
    this.photos.set([]);
  }

  private loadFavoritesFromLocalStorage(): void {
    const storedFavorites = localStorage.getItem('favoritePhotos');
    if (storedFavorites) {
      const favoritePhotoIds = JSON.parse(storedFavorites);
      const photosInStore = this.photos();

      // Find missing photo IDs
      const missingPhotoIds = favoritePhotoIds.filter(
        (id: string) => !photosInStore.some((photo) => photo.id === id)
      );

      if (missingPhotoIds.length > 0) {
        // Fetch missing photos using their IDs
        this.photoService.loadPhotosByIds(missingPhotoIds).subscribe({
          next: (missingPhotos) => {
            this.photos.update((currentPhotos) => [
              ...currentPhotos,
              ...missingPhotos,
            ]);
            // Mark these photos as favorites
            this.photos.update((currentPhotos) =>
              currentPhotos.map((photo) =>
                favoritePhotoIds.includes(photo.id)
                  ? { ...photo, favorite: true }
                  : photo
              )
            );
          },
          error: (error) => {
            console.error('Error loading missing favorite photos:', error);
          },
        });
      } else {
        // If all favorite photos are in the store, just update the favorites
        this.photos.update((currentPhotos) =>
          currentPhotos.map((photo) =>
            favoritePhotoIds.includes(photo.id)
              ? { ...photo, favorite: true }
              : photo
          )
        );
      }
    }
  }

  // Save favorite photos to localStorage
  private saveFavoritesToLocalStorage(): void {
    const favoritePhotoIds = this.photos()
      .filter((photo) => photo.favorite)
      .map((photo) => photo.id);

    localStorage.setItem('favoritePhotos', JSON.stringify(favoritePhotoIds));
  }
}
