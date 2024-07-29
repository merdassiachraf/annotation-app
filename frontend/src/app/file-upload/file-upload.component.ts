import { Component } from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {

  constructor(
    private fileUploadService: FileUploadService,
    private sharedDataService: SharedDataService
  ) { }

  upload(event: any) {
    this.fileUploadService.upload(event.target.files[0]).subscribe(result => {
      this.sharedDataService.updateReportDocument(result.text.replace(" \u201c", " "));
      console.log(result.text);
    });
  }

}
