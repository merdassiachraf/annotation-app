import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../services/shared-data.service'; 

@Component({
  selector: 'app-labels-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.css']
})
export class LabelsListComponent {
  newLabel: string = '';
  labels: Array<{ text: string, color: string }> = [];
  colors: Array<string> = ['#8A2BE2', '#FF6347', '#4682B4', '#32CD32', '#FF4500', '#DA70D6'];
  errorMessage: string | null = null;

  constructor(private renderer: Renderer2, private sharedDataService: SharedDataService) {}

  addLabelButton() {
    if (this.newLabel.trim() === '') {
      return;
    }

    const formattedLabel = this.newLabel.trim().toUpperCase().replace(/ /g, '_');
    if (this.labels.some(label => label.text === formattedLabel)) {
      this.errorMessage = `Label "${formattedLabel}" already exists.`;
      return;
    }

    const color = this.colors[this.labels.length % this.colors.length];
    this.labels.push({ text: formattedLabel, color });
    this.newLabel = '';
    this.errorMessage = null; 
  }

  removeLabelButton(label: string, event: Event) {
    event.stopPropagation(); // Prevent the click event from propagating to the label click handler
    this.labels = this.labels.filter(l => l.text !== label);
  }

  applyLabel(label: { text: string, color: string }) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.toString().length === 0) {
      return;
    }

    const span = this.renderer.createElement('span');
    this.renderer.setStyle(span, 'background-color', label.color);
    this.renderer.setStyle(span, 'color', 'white');
    span.textContent = range.toString();
    range.deleteContents();
    range.insertNode(span);

    // Attach click event to span for performing all actions and logging
    span.addEventListener('click', () => {
      console.log('Label Applied:', { text: label.text, color: label.color });
      this.sharedDataService.performAllActions(label.text);
      this.resetSelection();
    });

    // Clear the selection
    selection.removeAllRanges();

    // Log the label value and color initially
    console.log('Label Applied:', { text: label.text, color: label.color });
  }

  resetSelection() {
    const selectedElements = document.querySelectorAll('.selected');
    selectedElements.forEach(element => {
      this.renderer.removeClass(element, 'selected');
    });
  }
}
