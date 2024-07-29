import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}


@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FileUploadModule, ToastModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
  providers: [MessageService]
})

export class FileUploadComponent {
  constructor(private messageService: MessageService) { }

  onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
}
