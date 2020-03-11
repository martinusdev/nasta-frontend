import FCPChart from "@/components/FCPChart.vue";

export default class FCPDetailChart extends FCPChart {
    constructor() {
        super();

        this.reportNames = [
            'fcp_detail_tablet',
            'fcp_detail_desktop',
            'fcp_detail_mobile',
        ];

        this.values = new Map();
        this.values.set('fcp_detail_tablet', {
            label: 'Detail Tablet',
            backgroundColor: '#00aa00',
            data: [],
        });
        this.values.set('fcp_detail_desktop', {
            label: 'Detail Desktop',
            backgroundColor: '#d37778',
            data: [],
        });
        this.values.set('fcp_detail_mobile', {
            label: 'Detail Mobile',
            backgroundColor: '#5e7cff',
            data: [],
        });
    }
}
