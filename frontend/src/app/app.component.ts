import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploadComponent } from "./file-upload/file-upload.component"
import { LabelsListComponent } from "./labels-list/labels-list.component"
import { SelectorAreaComponent } from "./selector-area/selector-area.component"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileUploadComponent, LabelsListComponent, SelectorAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
