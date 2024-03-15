import axios from "@/con/config";
import dayjs from "dayjs";
import 'dayjs/locale/th'
// import { GChart } from 'vue-google-charts'
import {GChart} from 'vue-google-charts/legacy'
import isAdmin from "@/middleware/is-admin";
import convert from "../../../plugins/convert";
// import { chartType, chartData, chartOptions } from './GoogleChartData';
import Summary from '@/components/Summary.vue'

export default {
  computed: {
    convert() {
      return convert
    }
  },
  layout: "seller-layout",
  head() {
    return {
      title: 'รายงาน'
    }
  },
  middleware: ['auth', isAdmin],
  components: {
    GChart,
    Summary
  },
  data() {
    return {
      loading: true,
      rules: [
        v => !!v || 'จำเป็น',
      ],
      instead: null,
      insteadSelect: null,
      typeChart: [
        {
          id: 0,
          name: "บุคลากร",
          url: ""
        },
        {
          id: 2,
          name: "อาจารย์",
          url: ""
        },
        {
          id: 1,
          name: "นักศึกษา"
        }
      ],
      typeChartSelect: [],
      typeRoom: [],
      typeRoomSelect: [],
      type: 'PieChart',
      pieChartData: [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7],
      ],
      pieChartOptions: {
        title: '',
        pieHole: 0.4,
        height: 344,
        legend: 'none',
      },
      data: [],
      options: {
        title: '',
        pieHole: 0.4,
        height: 600,
      },
      chartData: [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350],
      ],
      chartOptions: {
        title: '',
        width: 300,
        height: 100,
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
      },
      menuDate: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateEnd: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modal: false,
      dialogDateEnd: false,
      headerTable: [],
      desserts: [],

      emps: {},
      chartDatas: {
        datasets: [
            {
            type: 'bar',
            label: 'Bar Dataset',
            data: [10, 20, 30, 40]
          },
          // {
          //   type: 'line',
          //   label: 'Line Dataset',
          //   data: [50, 50, 50, 50],
          // }
        ],
        labels: ['January', 'February', 'March', 'April']
      },
      options1: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
      summary:{}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
      this.getCount()
    })

    const items2D = [
      {id: 1, name: 'Item 1', parent: 'A'},
      {id: 2, name: 'Item 2', parent: 'B'},
      {id: 3, name: 'Item 3', parent: 'A'},
      {id: 4, name: 'Item 4', parent: 'B'},
      {id: 5, name: 'Item 5', parent: 'C'},
    ];

// Use reduce to group items by parent property
    const groupedItems2D = items2D.reduce((grouped, item) => {
      const parent = item.parent;

      if (!grouped[parent]) {
        grouped[parent] = [];
      }

      grouped[parent].push(item);

      return grouped;
    }, {});
  },
  methods: {
    async getData() {
      this.$axios.$get("report_employee").then((res) => {
        this.emps = res.data
        // console.log(res)
      })
    },

    async getCount() {
      this.$axios.$get("getCount").then((res) => {
        this.summary = res
        // console.log(this.summary)
      })
    }
  },
}
