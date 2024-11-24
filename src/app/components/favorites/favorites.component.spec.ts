import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { PhotoSignalStore } from '../../store/photo.store';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

// Mock PhotoSignalStore
class MockPhotoSignalStore {
  favoritePhotos = of([
    { id: '1', url: 'https://example.com/photo1.jpg', favorite: true },
    { id: '2', url: 'https://example.com/photo2.jpg', favorite: true },
    { id: '3', url: 'https://example.com/photo3.jpg', favorite: true },
  ]);
}

class ActivatedRouteStub {
  // You can mock route parameters here if needed
}

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FavoritesComponent,
        MatGridListModule,
        CommonModule,
        HttpClientTestingModule,
      ], // Add HttpClientTestingModule
      providers: [
        { provide: PhotoSignalStore, useClass: MockPhotoSignalStore }, // Mocking the store
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }, // Mocking ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate columns based on window width', () => {
    // Simulate a window resize with a width of 1200px
    spyOn(component, 'calculateColumns'); // Spy on the calculateColumns method
    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize')); // Trigger window resize event
    expect(component.calculateColumns).toHaveBeenCalled();
    expect(component.cols).toBe(4); // Expect 4 columns based on 1200px / 300px
  });

  it('should recalculate columns when window is resized', () => {
    // Initial calculation on ngOnInit
    expect(component.cols).toBe(3); // Expect 3 columns based on the default window size

    // Simulate a window resize
    window.innerWidth = 900; // New window width
    component.onResize(new Event('resize')); // Trigger the resize event handler
    fixture.detectChanges(); // Manually trigger change detection

    expect(component.cols).toBe(3); // 900px / 300px = 3 columns
  });

  it('should display the favorite photos in the grid', () => {
    const gridItems = fixture.nativeElement.querySelectorAll('mat-grid-tile');
    expect(gridItems.length).toBe(3); // Ensure we have 3 items in the grid (based on mock data)

    const firstImage = gridItems[0].querySelector('img');
    expect(firstImage.src).toContain('photo1.jpg'); // Check the first image URL
  });
});
