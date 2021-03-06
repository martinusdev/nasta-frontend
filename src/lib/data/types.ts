export interface ReportItem {
  report_name: string;
  report_value: number;
  report_time: number;
}

// dalsie len rovnako
export interface AnotherType {
  report_name: string;
  report_value: number;
  report_time: number;
}

export interface BarChartData {
  label: string;
  backgroundColor: string;
  data: number[];
}
