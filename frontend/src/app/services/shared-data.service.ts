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

  // Method to add annotation data
  addAnnotationData(annotation: Annotation) {
    this.cacheAnnotationData.push(annotation);
    console.log('Cache Annotation Data:', this.cacheAnnotationData);
  }

  // Method to get annotation data
  getAnnotationData() {
    console.log('Cache Annotation Data:', this.cacheAnnotationData);
    return this.cacheAnnotationData;
  }

  // Method to update all annotation labels
  updateAllAnnotationLabels(label: string) {
    this.cacheAnnotationData = this.cacheAnnotationData.map(annotation => ({
      ...annotation,
      label: label
    }));
    console.log('Updated Annotation Data:', this.cacheAnnotationData);
  }

  // Method to append annotation data to report and clear cache
  appendAnnotationsToReport() {
    this.reportData.report.annotation.push(...this.cacheAnnotationData);
    this.cacheAnnotationData = [];
    console.log('Report Annotations:', this.reportData);
    console.log('Cache Cleared:', this.cacheAnnotationData);
  }

  // Method to log the report
  logReport() {
    console.log('Current Report:', this.reportData);
  }

  // Method to perform all actions in one go and log everything
  performAllActions(label: string) {
    this.updateAllAnnotationLabels(label);
    this.appendAnnotationsToReport();
    console.log('Label Applied:', label);
    this.logReport();
  }

  get report() {
    return this.reportData;
  }
}
