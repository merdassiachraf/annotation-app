import { Injectable } from '@angular/core';
import { Annotation } from './annotation.model'; // Adjust the path as necessary

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
    console.log('Data has been reset to initial state.');
  }
}
