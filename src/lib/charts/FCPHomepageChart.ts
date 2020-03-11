import FCPChart from "@/components/FCPChart.vue";

export default class FCPHomepageChart extends FCPChart {
    constructor() {
        super();

        this.reportNames = [
            'fcp_home_page_tablet',
            'fcp_home_page_desktop',
            'fcp_home_page_mobile',
        ];

        this.values = new Map();
        this.values.set('fcp_home_page_tablet', {
            label: 'HP Tablet',
            backgroundColor: '#00aa00',
            data: [],
        });
        this.values.set('fcp_home_page_desktop', {
            label: 'HP Desktop',
            backgroundColor: '#d37778',
            data: [],
        });
        this.values.set('fcp_home_page_mobile', {
            label: 'HP Mobile',
            backgroundColor: '#5e7cff',
            data: [],
        });
    }
}
