import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionNames, ICollectionData } from '../models/ICollection';
import { Constants } from '../Constants';

@Injectable({
  providedIn: 'root',
})
export class CollectionDataService<T = any, J = any> {
  private apiUrl = `${Constants.ApiBase}/collection-data`;

  constructor(private http: HttpClient) {}

  // Get all data entries for a specific collection
  /// @param collectionId The ID of the collection to retrieve data from
  /// @param childrenCollection Whether to include children collections example collectionId=variations&childrenCollection=variations_options
  /// @returns An observable of ICollectionData array
  getDataByCollectionId(
    collectionId: string,
    childrenCollection = ''
  ): Observable<ICollectionData<T, J>[]> {
    const url = `${this.apiUrl}/list.php?collectionId=${collectionId}&childrenCollection=${childrenCollection}&websiteId=${CollectionNames.WebsiteId}`;
    return this.http.get<ICollectionData<T, J>[]>(url);
  }

  getChildren(
    parentId: number,
    collectionId: string = ''
  ): Observable<ICollectionData<T, J>[]> {
    const url = `${this.apiUrl}/get-children.php?parentId=${parentId}&collectionId=${collectionId}`;
    return this.http.get<ICollectionData<T, J>[]>(url);
  }
  getWithChildren(parentId: number) {
    const url = `${this.apiUrl}/get-with-children.php?parentId=${parentId}`;
    return this.http.get<ICollectionData<T, J>>(url);
  }

  //find-parents-that-have-children.php
  findParentsThatHaveChildren(
    collectionId: string
  ): Observable<ICollectionData<T, J>[]> {
    const url = `${this.apiUrl}/find-parents-that-have-children.php?collectionId=${collectionId}&websiteId=${CollectionNames.WebsiteId}`;
    return this.http.get<ICollectionData<T, J>[]>(url);
  }

  // Get a data entry by ID
  getDataById(id: number): Observable<ICollectionData<T, J>> {
    const url = `${this.apiUrl}/get.php?id=${id}`;
    return this.http.get<ICollectionData<T, J>>(url);
  }

  // Get all data entries for a specific collection with pagination
  categoryTree<T, J>(): Observable<ICollectionData<T, J>[]> {
    const url = `${this.apiUrl}/category-tree.php`;
    return this.http.get<ICollectionData<T, J>[]>(url);
  }

  // Add a new data entry
  addData(data: ICollectionData<T, J>): Observable<ICollectionData<T, J>> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.post<ICollectionData<T, J>>(url, data);
  }

  // Update a data entry
  updateData(data: ICollectionData<T, J>): Observable<ICollectionData<T, J>> {
    const url = `${this.apiUrl}/save.php`;
    return this.http.put<ICollectionData<T, J>>(url, data);
  }

  // Delete a data entry by ID
  deleteData(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete.php?id=${id}`;
    return this.http.delete(url);
  }

  // Delete all data entries for a specific collection
  deleteDataByCollectionId(collectionId: number): Observable<any> {
    const url = `${this.apiUrl}/delete.php?collection_id=${collectionId}`;
    return this.http.delete(url);
  }
}
