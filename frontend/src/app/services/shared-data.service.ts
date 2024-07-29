import { Injectable } from '@angular/core';
import { Annotation } from './annotation.model'; // Adjust the path as necessary
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private reportData = {
    report: {
      document: '',
      annotation: [] as Annotation[]
    }
  };

  private reportSubject = new BehaviorSubject(this.reportData);
  report$ = this.reportSubject.asObservable();

  private cacheAnnotationData: Annotation[] = [];

  addAnnotationData(annotation: Annotation) {
    // Check for duplicates
    const isDuplicate = this.cacheAnnotationData.some(ann =>
      ann.text === annotation.text && ann.start === annotation.start && ann.end === annotation.end
    );

    if (!isDuplicate) {
      this.cacheAnnotationData.push(annotation);
      console.log('Cache Annotation Data:', this.cacheAnnotationData);
    } else {
      console.log('Duplicate annotation found, not adding:', annotation);
    }
  }

  getAnnotationData() {
    console.log('Cache Annotation Data:', this.cacheAnnotationData);
    return this.cacheAnnotationData;
  }

  updateAllAnnotationLabels(label: string) {
    this.cacheAnnotationData = this.cacheAnnotationData.map(annotation => ({
      ...annotation,
      label: label
    }));
    console.log('Updated Annotation Data:', this.cacheAnnotationData);
  }

  appendAnnotationsToReport() {
    this.reportData.report.annotation.push(...this.cacheAnnotationData);
    this.cacheAnnotationData = [];
    console.log('Report Annotations:', this.reportData);
    console.log('Cache Cleared:', this.cacheAnnotationData);
  }

  logReport() {
    console.log('Current Report:', this.reportData);
  }

  performAllActions(label: string) {
    this.updateAllAnnotationLabels(label);
    this.appendAnnotationsToReport();
    console.log('Label Applied:', label);
    this.logReport();
  }

  updateReportDocument(text: string) {
    // Replace common Unicode escape sequences with actual characters
    const replacements: { [key: string]: string } = {
      '\\u201c': '"',
      '\\u201d': '"',
      '\\u2018': "'",
      '\\u2019': "'",
      '\\u2014': '—',
      '\\u2026': '…',
      '\\u2013': '–',
      '\"':""

    };

    let cleanedText = text;
    for (const [unicode, char] of Object.entries(replacements)) {
      const regex = new RegExp(unicode, 'g');
      cleanedText = cleanedText.replace(regex, char);
    }

    this.reportData.report.document = cleanedText;
    this.reportSubject.next(this.reportData);
    console.log('Updated Report Document:', this.reportData.report.document);
  }

  get report() {
    return this.reportData;
  }

  // Method to reset the data to the initial state
  resetData() {
    this.reportData = {
      report: {
        document: '',
        annotation: []
      }
    };
    this.cacheAnnotationData = [];
    this.reportSubject.next(this.reportData);
    console.log('Data has been reset to initial state.');
  }
}

