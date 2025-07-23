// apply.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInput } from '../../../../models/FormInput';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../models/ICollection';
import { Application } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { UserService } from '../../../../services/user.service';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
  ],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss',
})
export class ApplyComponent implements OnInit {
  formInputs: FormInput[] = [
    {
      key: 'amount',
      label: 'Loan Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter the amount you wish to borrow',
    },
    {
      key: 'type',
      label: 'Loan Type',
      type: 'select',
      required: true,
      options: [
        { label: '15th Loan', value: '15th' },
        { label: '25th Loan', value: '25th' },
        { label: '30th Loan', value: '30th' },
      ],
      placeholder: 'Select repayment date',
    },
    {
      key: 'purpose',
      label: 'Purpose',
      type: 'textarea',
      placeholder: 'What is the purpose of this loan?',
    },

      {
      key: 'bankStatement',
      label: '3 Months Bank Statement',
      type: 'image',
      placeholder: 'Upload your 3 months bank statement',
    },
  ];
  initialData: any = {};
  loading = false;

  constructor(
    private service: CollectionDataService<Application>,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const localData = localStorage.getItem('applicationDraft');
    if (localData) {
      const parsed = JSON.parse(localData);
      this.initialData = {
        amount: parsed.amount,
        type: parsed.cycle, // map 'cycle' to 'type'
      };
    }
  }

  onSave(data: any) {
    const user = this.userService.getUser;
    if (!user || !user.id) {
      alert('Please log in first.');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    const payload: ICollectionData<Application> = {
      id: 0,
      website_id: CollectionNames.WebsiteId,
      collection_id: CollectionNames.Applications,
      parent_id: user.id,
      data: {
        ...data,
        status: 'pending',
      },
    };

    this.service.addData(payload).subscribe({
      next: () => {
        localStorage.removeItem('applicationDraft');
        alert('Application submitted!');
        this.router.navigate(['/profile']);
        this.loading = false;
      },
      error: () => {
        alert('Error submitting your application.');
        this.loading = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
