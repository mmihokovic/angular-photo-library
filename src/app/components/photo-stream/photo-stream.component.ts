import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { PhotoSignalStore } from '../../store/photo.store';
import { Photo } from '../../models/photo.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-photo-stream',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './photo-stream.component.html',
  styleUrls: ['./photo-stream.component.scss'],
})
export class PhotoStreamComponent implements OnInit {
  private photoStore = inject(PhotoSignalStore);
  photos = this.photoStore.photos$;
  isLoading = this.photoStore.loading$;

  // Control scroll behavior
  scrollDistance = 1;
  scrollUpDistance = 1;
  throttle = 300;

  private loadedPhotosCount = 0;

  // Dynamically calculated columns based on screen size
  cols: number = 3;

  ngOnInit(): void {
    this.calculateColumns(); // Initial calculation of columns
    this.loadedPhotosCount = this.cols * 3;

    if (this.photoStore.photos$().length < this.loadedPhotosCount) {
      this.loadMorePhotos();
    }
  }

  loadMorePhotos(): void {
    this.photoStore.loadPhotos(this.loadedPhotosCount);
    this.loadedPhotosCount += 10;
  }

  onScroll(): void {
    this.loadMorePhotos();
  }

  toggleFavorite(photo: Photo): void {
    this.photoStore.toggleFavorite(photo.id);
  }

  calculateColumns(): void {
    // Calculate columns based on screen width and the fixed tile size (300px)
    this.cols = Math.floor(window.innerWidth / 300);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.calculateColumns(); // Recalculate columns on window resize
  }
}
