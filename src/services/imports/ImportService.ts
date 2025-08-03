import { Injectable } from '@angular/core';
import { WALKINGS_OLD_DATA } from './walkins';
import { Company, initCompany } from '../../models/company.model';
import { User, UserRole, initUser } from '../../models/User';
import { CompanyProgram } from '../../models/company.program.model';
import { IDocument } from '../../models/document.model';

@Injectable({ providedIn: 'root' })
export class ImportService {
  oldWalkins: WalkInVisitor[] = WALKINGS_OLD_DATA;
  readonly DEFAULT_PROGRAM_ID = 1;

  convertWalkinsToCompanies(): Company[] {
    return this.oldWalkins
      .filter((walkin) => walkin.ItemValue?.CompanyName)
      .map((walkin) => this.convertWalkinToCompany(walkin));
  }

  private convertWalkinToCompany(walkin: WalkInVisitor): Company {
    const item = walkin.ItemValue;

    const company: Company = {
      ...initCompany(item.CompanyName || 'Unnamed Company'),
      email: item.EmailAddress || '',
      phone: item.ContactDetails || item.CellNumber || '',
      address: item.AddressLine1 || '',
      sector: item.Sector || '',
      suburb: item.Suburb || '',
      city: item.City || '',
      postal_code: item.PostalCode || '',
      address_line1: item.AddressLine1 || '',
      bbbee_level: item.BBBEELevel || '',
      bbbee_expiry_date: item.BBBEEExpiryDate || '',
      registration_no: item.CompanyRegistrationNo || '',
      turnover_estimated: this.parseTurnover(item.CompanyAnnualTurnover),
      turnover_actual: this.parseTurnover(item.ActualCompanyAnnualTurnover),
      turnover_verified: item.CompanyAnnualTurnoverVerified || false,
      permanent_employees: item.NoOfPermanentEmployees || 0,
      temporary_employees: item.NoOfTemporaryEmployees || 0,
      description: item.DescriptionOfBusiness || '',
      metadata: {
        comments: [],
      },
      users: this.createUsers(item),
      documents: this.createDocuments(item.documents),
      programs: [this.createDefaultCompanyProgram(walkin)],
    };

    return company;
  }

  private createUsers(item: WalkInItemValue): User[] {
    const users: User[] = [];

    if (item.NameAndSurname || item.DirectorId) {
      users.push(
        this.createUserFromDirector({
          name: item.NameAndSurname || '',
          idNo: item.DirectorId || '',
          email: item.EmailAddress || '',
          phone: item.ContactDetails || item.CellNumber || '',
          gender: item.Gender || '',
          date_of_birth: item.DateOfBirth || '',
          role: 'Client',
          isPrimary: true,
        })
      );
    }

    if (item.otherDirectors?.length) {
      item.otherDirectors.forEach((dir) => {
        users.push(
          this.createUserFromDirector({
            name: dir.name,
            idNo: dir.idNo,
            email: dir.email,
            phone: dir.cell,
            gender: dir.gender,
            date_of_birth: dir.dob,
            role: 'Client',
            isPrimary: false,
          })
        );
      });
    }

    return users;
  }

  private createDocuments(docs: any[] | undefined): IDocument[] {
    if (!docs || !Array.isArray(docs)) return [];

    return docs.map((doc) => ({
      name: doc.name,
      company_id: 0, // This will be set later when the company is saved
      url: doc.url,
      type: this.getDocumentType(doc.name),
      date_uploaded: this.parseDate(doc.dateUploaded),
    }));
  }

  private createDefaultCompanyProgram(walkin: WalkInVisitor): CompanyProgram {
    const date = walkin.ItemValue?.DateOfVisit || walkin.CreateDate || '';
    const reason =
      walkin.ItemValue?.ReasonForConsultingESDCentre ||
      walkin.ItemValue?.ReasonForConsultingESDCentre2 ||
      walkin.Decription ||
      'Walk-in';

    return {
      program_id: this.DEFAULT_PROGRAM_ID,
      registration_date: this.parseDate(date),
      description: reason.trim(),
      company_id: 0, // This will be set later when the company is saved
    };
  }

  private createUserFromDirector(data: {
    name: string;
    idNo: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: string;
    role: UserRole;
    isPrimary: boolean;
  }): User {
    return {
      ...initUser(),
      name: data.name,
      id_number: data.idNo,
      email:
        data.email ||
        `${data.name.replace(/\s+/g, '.').toLowerCase()}@company.com`,
      phone: data.phone,
      gender: data.gender,
      date_of_birth: this.formatDateOfBirth(data.date_of_birth),
      role: data.role,
      job_title: data.isPrimary ? 'Director' : 'Co-Director',
      statusId: 1,
      is_verified: 1,
    };
  }

  private parseTurnover(value: string | undefined): number {
    if (!value) return 0;
    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  }

  private formatDateOfBirth(raw: string): string {
    if (!raw) return '';
    if (raw.includes('/')) {
      const [day, month, year] = raw.split('/');
      return `${year}-${month}-${day}`;
    } else if (raw.includes(' ')) {
      const date = new Date(raw);
      return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    }
    const date = new Date(raw);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  }

  private parseDate(raw: string): string {
    if (!raw) return '';
    const date = new Date(raw);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  }

  private getDocumentType(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('id')) return 'ID';
    if (lower.includes('bank')) return 'Bank';
    if (lower.includes('registration')) return 'Registration';
    if (lower.includes('bbe')) return 'BBBEE';
    return 'Other';
  }
}
// Existing interfaces for the old data
interface Director {
  dob: string;
  cell: string;
  idNo: string;
  name: string;
  race: string;
  email: string;
  gender: string;
}

interface WalkInItemValue {
  No: string;
  City?: string;
  Race?: string;
  Gender?: string;
  Sector?: string;
  Suburb?: string;
  documents?: any[];
  BBBEELevel?: string;
  CellNumber?: string;
  DirectorId?: string;
  PostalCode?: string;
  CompanyName?: string;
  DateOfBirth?: string;
  DateOfVisit?: string;
  AddressLine1?: string;
  EmailAddress?: string;
  ActionOutcome?: string;
  ContactDetails?: string;
  NameAndSurname?: string;
  TypesOfAddress?: string;
  otherDirectors?: Director[];
  BBBEEExpiryDate?: string;
  CompanyAnnualTurnover?: string;
  CompanyRegistrationNo?: string;
  DescriptionOfBusiness?: string;
  NoOfPermanentEmployees?: number;
  NoOfTemporaryEmployees?: number;
  ActualCompanyAnnualTurnover?: string;
  ReasonForConsultingESDCentre?: string;
  CompanyAnnualTurnoverVerified?: boolean;
  ReasonForConsultingESDCentre2?: string;
}

interface WalkInVisitor {
  Id: number;
  Name: string;
  ItemType: string;
  ImageUrl: string;
  ParentId: string;
  Notes: string;
  ItemValue: WalkInItemValue;
  Status: string;
  Decription: string;
  Rules: string;
  ItemCode: string;
  CreateDate: string;
  Slug: string;
  CreatedBy: string;
}
