import { Component, HostListener, inject, OnInit } from '@angular/core';
import { PhotoSignalStore } from '../../store/photo.store';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatGridListModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private photoStore = inject(PhotoSignalStore);

  favorites = this.photoStore.favoritePhotos;

  cols: number = 3;

  ngOnInit(): void {
    this.calculateColumns(); // Initial calculation of columns
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
