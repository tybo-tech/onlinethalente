import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../Constants';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Company,
  templateTypes,
  ICompanyMetadata,
} from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private url: string;
  private companyListSubject = new BehaviorSubject<Company[]>([]);
  public $companies = this.companyListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.url = `${Constants.ApiBase}/company`;
  }

  // Get all companies (optionally, you can pass filters in the future)
  list(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.url}/list.php`);
  }

  // Get a single company by ID
  get(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.url}/get.php?companyId=${id}`);
  }

  // Save (create or update) a company
  save(data: Company): Observable<Company> {
    return this.http.post<Company>(`${this.url}/save.php`, data);
  }

  // Delete a company by ID
  delete(companyId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/delete.php`, { companyId });
  }

  // Optionally, sync to BehaviorSubject for caching/state
  updateCompanyListState(companies: Company[]) {
    this.companyListSubject.next(companies);
  }

  formBasicInfo(data: any): Partial<Company> {
    return {
      name: data.name,
      industry: data.industry,
      logo: data.logo,
    };
  }

  formBankingInfo(data: any): ICompanyMetadata {
    return {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      branchCode: data.branchCode,
      accentColor: data.accentColor || '#23272F',
      primaryColor: data.primaryColor || '#6366F1',
      textColor: data.textColor || '#23272F',
      templateType: data.templateType || 'classic',
    };
  }

  listPaginated(
    params: {
      statusId?: number;
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    } = {}
  ): Observable<Company[]> {
    const query = new URLSearchParams({
      statusId: (params.statusId ?? 1).toString(),
      limit: (params.limit ?? 100).toString(),
      offset: (params.offset ?? 0).toString(),
      sortBy: params.sortBy ?? 'created_at',
      sortOrder: params.sortOrder ?? 'DESC',
    });
    return this.http.get<Company[]>(`${this.url}/list.php?${query.toString()}`);
  }
  search(query: string, statusId = 1): Observable<Company[]> {
    return this.http.get<Company[]>(
      `${this.url}/search.php?query=${encodeURIComponent(
        query
      )}&statusId=${statusId}`
    );
  }
  findByRegistrationOrName(
    registration: string,
    name?: string
  ): Observable<Company | null> {
    const query = new URLSearchParams();
    if (registration) query.set('registration', registration);
    if (name) query.set('name', name);
    return this.http.get<Company>(`${this.url}/find.php?${query.toString()}`);
  }

  count(statusId = 1): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.url}/count.php?statusId=${statusId}`
    );
  }

  // Import a company and its users (used for walk-in import)
  importCompany(companies: Company[]): Observable<any> {
    return this.http.post<any>(
      `${Constants.ApiBase}/company-import/import.php`,
      companies
    );
  }
}
