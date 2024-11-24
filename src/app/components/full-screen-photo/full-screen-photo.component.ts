import { Component } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { PhotoSignalStore } from '../../store/photo.store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-full-screen-photo',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './full-screen-photo.component.html',
  styleUrl: './full-screen-photo.component.scss',
})
export class FullScreenPhotoComponent {
  photo: Photo | null = null;
  isLoading = true;

  constructor(
    private photoStore: PhotoSignalStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the photo ID from the route parameter
    const photoId = this.route.snapshot.paramMap.get('id');
    if (photoId) {
      this.loadPhoto(photoId);
    }
  }

  loadPhoto(id: string): void {
    // Check if the photo is already in the store
    const existingPhoto = this.photoStore
      .photos$()
      .find((photo) => photo.id === id);
    if (existingPhoto) {
      this.photo = existingPhoto;
      this.isLoading = false;
    } else {
      // If not in the store, load it via the PhotoService
      this.photoStore.loadPhotos(10); // Load more photos if not already in the store
      const missingPhoto = this.photoStore
        .photos$()
        .find((photo) => photo.id === id);
      if (missingPhoto) {
        this.photo = missingPhoto;
      }
      this.isLoading = false;
    }
  }

  close(): void {
    this.router.navigate(['/']); // Navigate back to the photo grid or previous page
  }
}
