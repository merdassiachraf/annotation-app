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
  colors: Array<string> = ['#8a3552', '#4f3f8c', '#255f61', '#b73a1b', '#FF4500', '#DA70D6'];
  errorMessage: string | null = null;

  constructor(private renderer: Renderer2, private sharedDataService: SharedDataService) { }

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
      this.resetSelection(label);
    });

    // Clear the selection
    selection.removeAllRanges();

    // Log the label value and color initially
    console.log('Label Applied:', { text: label.text, color: label.color });
  }

  resetSelection(label: { text: string, color: string }) {
    const selectedElements = document.querySelectorAll('.selected');
    selectedElements.forEach(element => {
      this.renderer.removeClass(element, 'selected');

      // Generate a random class name
      const randomClassName = `class-${Math.random().toString(36).substr(2, 9)}`;

      // Add the random class name to the element
      this.renderer.addClass(element, randomClassName);

      // Add CSS rule for the new class to the document
      const styleSheet = document.styleSheets[0];
      (styleSheet as CSSStyleSheet).insertRule(`
        .${randomClassName} { 
          background-color: ${label.color} !important; 
          border-radius: 5px !important; 
          padding: 5px 10px 5px 5px !important; 
          color: white !important;
          font-weight: bold !important; 
          word-spacing: 1rem !important;
        }
      `, styleSheet.cssRules.length);

      // Create a span element containing label.text
      const span = this.renderer.createElement('span');
      this.renderer.setStyle(span, 'background-color', 'white');
      this.renderer.setStyle(span, 'color', 'black');
      this.renderer.setStyle(span, 'margin', '0px 10px 0px 10px');
      this.renderer.setStyle(span, 'padding', '1px 1px 1px 1px');
      this.renderer.setStyle(span, 'font-weight', 'lighter');
      this.renderer.setStyle(span, 'word-spacing', '1rem');
      span.textContent = label.text;

      // Append the span to the end of the selected text
      this.renderer.appendChild(element, span);
    });
  }
}
