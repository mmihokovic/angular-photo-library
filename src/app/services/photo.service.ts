import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, forkJoin, map, Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photoApi = 'https://picsum.photos/200/300'; // Updated API endpoint to reflect ID-based URLs

  private http = inject(HttpClient);

  // Load a single random photo (as before)
  loadPhoto(): Observable<Photo> {
    return this.http
      .get(this.photoApi, { observe: 'response', responseType: 'blob' })
      .pipe(
        delay(200 + Math.random() * 100), // Simulate random loading delay
        map((response) => {
          if (response.body) {
            // Check if response.body is not null
            const photoUrl = URL.createObjectURL(response.body);
            const url = new URL(response.url ?? '');
            const hmac = url.searchParams.get('hmac') ?? Date.now().toString(); // Fallback to timestamp if no hmac
            return {
              id: hmac,
              url: photoUrl,
              favorite: false,
            } as Photo;
          }
          throw new Error('Failed to load photo');
        })
      );
  }

  // Load multiple random photos
  loadPhotos(count: number): Observable<Photo[]> {
    const photoRequests = Array.from({ length: count }, () => this.loadPhoto());
    return forkJoin(photoRequests);
  }

  // Load photos by their IDs (e.g., the 'hmac' or unique identifier)
  loadPhotosByIds(photoIds: string[]): Observable<Photo[]> {
    // Create a request for each photo ID
    const photoRequests = photoIds.map((photoId) => {
      return this.http
        .get(`${this.photoApi}.jpg?hmac=${photoId}`, {
          observe: 'response',
          responseType: 'blob',
        })
        .pipe(
          map((response) => {
            if (response.body) {
              const photoUrl = URL.createObjectURL(response.body);
              return {
                id: photoId,
                url: photoUrl,
                favorite: false,
              } as Photo;
            }
            throw new Error(`Failed to load photo with ID: ${photoId}`);
          })
        );
    });

    // Combine all photo requests into a single observable
    return forkJoin(photoRequests);
  }
}
