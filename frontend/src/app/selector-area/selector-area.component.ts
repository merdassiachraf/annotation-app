import { Component, Renderer2 } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SharedDataService } from '../services/shared-data.service';
import { Annotation } from '../services/annotation.model';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-selector-area',
  standalone: true,
  templateUrl: './selector-area.component.html',
  styleUrls: ['./selector-area.component.css'],
  imports: [ButtonModule, HttpClientModule]
})
export class SelectorAreaComponent {
  loading: boolean = false;

  constructor(
    private renderer: Renderer2,
    private sharedDataService: SharedDataService,
    private http: HttpClient
  ) { }

  onMouseUp() {
    const selectedText = window.getSelection();
    if (selectedText && selectedText.rangeCount) {
      const range = selectedText.getRangeAt(0);
      this.adjustRangeToWholeWords(range);

      const span = this.renderer.createElement('span');
      this.renderer.addClass(span, 'selected');
      range.surroundContents(span);

      selectedText.removeAllRanges();

      const fullText = document.body.innerText;
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      let start = fullText.indexOf(startContainer.textContent!.substring(range.startOffset));
      let end = start + range.toString().length;

      const annotation: Annotation = {
        start: start + 1,
        end: end + 1,
        text: range.toString(),
        label: ''
      };

      this.sharedDataService.addAnnotationData(annotation);
    }
  }

  private adjustRangeToWholeWords(range: Range) {
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const textContent = startContainer.textContent!;
      let start = range.startOffset;
      while (start > 0 && !this.isWordBoundary(textContent[start - 1])) {
        start--;
      }
      range.setStart(startContainer, start);
    }

    if (endContainer.nodeType === Node.TEXT_NODE) {
      const textContent = endContainer.textContent!;
      let end = range.endOffset;
      while (end < textContent.length && !this.isWordBoundary(textContent[end])) {
        end++;
      }
      range.setEnd(endContainer, end);
    }
  }

  private isWordBoundary(char: string): boolean {
    return /\s/.test(char) || /[.,!?;:]/.test(char);
  }

  load() {
    this.loading = true;
    const report = this.sharedDataService.report;
    this.http.post('http://127.0.0.1:8000/annotation/export/', report, { responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.json';
        a.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error sending report', error);
        this.loading = false;
      }
    });
  }
}
