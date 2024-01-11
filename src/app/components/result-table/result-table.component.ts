import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrl: './result-table.component.css',
  template: '<p>Document ID: {{ documentId }}, Other Param: {{ name }}</p>',
})
export class ResultTableComponent implements OnInit {
  clientDocumentId!: string | null;
  name!: string | null;
  paymentsHistory!:any;
  isLoaded = false;
  constructor(private route: ActivatedRoute,private router:Router,private apiService:ApiService,private encryptionService: EncryptionService) {}

  async ngOnInit(): Promise<void> {
    this.clientDocumentId = this.encryptionService.decrypt(this.route.snapshot.paramMap.get('documentId')!);
    this.name = this.transformToSentenceForm(this.encryptionService.decrypt(this.route.snapshot.paramMap.get('name')!));

    if (this.clientDocumentId === null || this.name === null) {
      // Redirect to the home page or any other desired route
      this.router.navigate(['home']);
    }

    try {
      // Use async/await to wait for the asynchronous operation
      this.paymentsHistory = await this.apiService.getPaymentHistory(this.clientDocumentId);
      this.isLoaded = true;
    } catch (error) {
      // Handle the error as needed
    }
  }

  private transformToSentenceForm(name: string | null): string | null {
    if (name) {
      // Convert the first letter to uppercase and the rest to lowercase
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    } else {
      return null;
    }
  }
}
