import Component from "vue-class-component";
import Vue from "vue";
import BarChart from "@/lib/charts/BarChart";

@Component({
    components: {
        BarChart
    }
})
export default class TestChartContainer extends Vue {
    private loaded: boolean | undefined;

    async mounted () {
        this.loaded = false;
        try {
            // const { userlist } = await fetch('/api/userlist');
            // this.chartdata = userlist;
            this.loaded = true;
        } catch (e) {
            console.error(e)
        }
    }
}
