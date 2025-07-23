import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../Constants';
import { ICollectionLink } from '../models/ICollection';

@Injectable({ providedIn: 'root' })
export class CollectionLinkService {
  private apiUrl = `${Constants.ApiBase}/collection-link`;

  constructor(private http: HttpClient) {}

  getLinksBySource(
    sourceId: number,
    relationType: string
  ): Observable<ICollectionLink[]> {
    const url = `${this.apiUrl}/get-links.php?sourceId=${sourceId}&relationType=${relationType}`;
    return this.http.get<ICollectionLink[]>(url);
  }

  addLink(link: Omit<ICollectionLink, 'id' | 'created_at'>): Observable<ICollectionLink> {
    return this.http.post<ICollectionLink>(`${this.apiUrl}/add.php`, link);
  }

  removeLinkById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete.php?id=${id}`);
  }

  removeLink(sourceId: number, targetId: number): Observable<any> {
    const url = `${this.apiUrl}/delete-by-nodes.php?sourceId=${sourceId}&targetId=${targetId}`;
    return this.http.delete(url);
  }
}
