import axios from "@/con/config";
import dayjs from "dayjs";
import 'dayjs/locale/th'
// import { GChart } from 'vue-google-charts'
import isAdmin from "@/middleware/is-admin";
// import { chartType, chartData, chartOptions } from './GoogleChartData';

export default {
  layout: "seller-layout",
  head() {
    return {
      title: this.headTitle
    }
  },
  middleware: ['auth'],

  computed: {
    chartOptions() {
      const ctx = this
      return {
        credits: {
          enabled: false
        },
        accessibility: {enabled: false},
        // caption: {
        //   text: this.caption,
        //   style: {
        //     // @ts-ignore
        //     color: this.sexy ? this.invertedColor(0) : '#black'
        //   }
        // },
        chart: {
          backgroundColor: this.sexy
            ? {
              linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
              stops: [
                [0, this.seriesColor],
                [0.5, '#ffffff'],
                [1, this.seriesColor]
              ]
            }
            : '#ffffff',
          className: 'my-chart',
          type: this.chartType.toLowerCase()
        },
        // plotOptions: {
        //   series: {
        //     cursor: 'pointer',
        //     point: {
        //       events: {
        //         click() {
        //           ctx.$emit('pointClicked', this)
        //         }
        //       }
        //     }
        //   }
        // },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 1
          }
        },
        // yAxis: [{
        //   title: {
        //     text: this.yAxis,
        //     style: {
        //       color: '#000000'
        //     }
        //   }
        // }],
        title: {
          style: {
            // @ts-ignore
            color: this.sexy ? this.invertedColor(0) : '#black'
          },
          text: `${this.title} ` +
            (this.lastPointClicked.timestamp !== ''
              ? `(Point clicked: ${this.lastPointClicked.timestamp})`
              : '')
        },
        // subtitle: {
        //   style: {
        //     // @ts-ignore
        //     color: this.sexy ? this.invertedColor(0) : '#black'
        //   },
        //   text: `${this.subtitle}`
        // },
        // legend: {
        //   itemStyle: {
        //     // @ts-ignore
        //     color: this.sexy ? this.invertedColor(0) : '#black'
        //   }
        // },
        series: [
          {
            name: this.seriesName,
            data: this.points,
            color: this.seriesColor
          },
          {
            name: "eeee",
            data: this.points1,
            color: this.seriesColor
          },
          {
            name: "eeeegg",
            data: this.points2,
            color: this.seriesColor
          }
        ]
      }
    }
  },

  data() {
    return {
      headTitle: "",
      loading: true,

      caption: 'Chart caption here',
      title: 'Basic Chart',
      subtitle: 'More details here',
      points: [10, 0, 8, 2, 6, 4, 5, 5],
      points1: [100, 20, 38, 42, 61, 42, 51, 25],
      points2: [20, 20, 38, 12, 61, 42, 21, 225],
      seriesColor: '',
      animationDuration: 1000,
      chartType: '',
      colorInputIsSupported: null,
      chartTypes: [],
      durations: [0, 500, 1000, 2000],
      seriesName: 'My Data',
      yAxis: 'My Values',
      watchers: [
        'options.title',
        'options.series'
      ],
      colors: [
        'Red',
        'Green',
        'Blue',
        'Pink',
        'Orange',
        'Brown',
        'Black',
        'Purple'
      ],
      lastPointClicked: {
        timestamp: '',
        x: '',
        y: ''
      },
      sexy: false,

      category: [
        {
          name: "งายงานตามสาขา",
          route: "branch"
        },
        {
          name: "งายงานตามเจ้าหน้าที่",
          route: "emp"
        },
      ],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateEnd: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modal: false,
      dialogDateEnd: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false
      // this.$nuxt.$loading.start()
      this.headTitle = this.category.find(f => f.route === this.$route.params.category).name
    })
  },
  methods: {},
}
