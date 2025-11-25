import convert from "@/plugins/convert";

export default {
  name: 'CashFlowReport',
  layout: 'seller-layout',
  middleware: ['is-admin'],
  computed: {
    convert() {
      return convert
    },
  },
  data() {
    return {
      loading: true,
      branchList: [],
      branchSelect: null,
      periodSelect: 'month',

      // Raw data
      billsData: [],
      paymentMethodsData: [],
      dailySummary: [],

      // Summary
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        netCashFlow: 0,
        totalTransactions: 0,
        avgTransaction: 0,
        discountRate: 0,
      },

      // Table
      tableHead: [
        { title: 'ช่องทางชำระเงิน', text: 'text-left', width: '25%' },
        { title: 'จำนวนรายการ', text: 'text-center', width: '12%' },
        { title: 'ยอดรวม (บาท)', text: 'text-right', width: '15%' },
        { title: 'เฉลี่ยต่อรายการ', text: 'text-right', width: '13%' },
        { title: '% ของทั้งหมด', text: 'text-center', width: '10%' },
        { title: 'สัดส่วน', text: 'text-center', width: '25%' },
      ],

      // Chart data
      paymentMethodChartData: null,
      paymentMethodPieData: null,
      cashFlowTrendData: null,

      // Chart options
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return convert.money(context.parsed.y) + ' บาท'
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => {
                return convert.money(value)
              },
            },
          },
        },
      },

      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${convert.money(value)} บาท (${percentage}%)`
              },
            },
          },
        },
      },

      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return context.dataset.label + ': ' + convert.money(context.parsed.y) + ' บาท'
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return convert.money(value)
              },
            },
          },
        },
      },
    }
  },

  async mounted() {
    await this.getBranch()
    if (this.branchList.length > 0) {
      this.branchSelect = this.branchList[0]
      await this.getData()
    }
    this.loading = false
  },

  methods: {
    async getBranch() {
      try {
        let res = await this.$axios.$get('/branch')
        this.branchList = res.data || []
      } catch (error) {
        console.error('Error fetching branches:', error)
      }
    },

    async getData() {
      if (!this.branchSelect) return

      this.loading = true
      try {
        // Get bills data
        const res = await this.$axios.$get('/getBillList', {
          params: {
            branch: this.branchSelect.id,
          },
        })

        this.billsData = res.data || []

        // Process cash flow data
        this.processCashFlowData()
        this.calculateSummary()
        this.prepareChartData()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      this.loading = false
    },

    changePeriod() {
      this.getData()
    },

    processCashFlowData() {
      const dayjs = this.$dayjs
      const now = dayjs()

      // Filter bills by selected period
      const filteredBills = this.billsData.filter((bill) => {
        const billDate = dayjs(bill.timestamp)

        switch (this.periodSelect) {
          case 'week':
            return billDate.isAfter(now.subtract(7, 'day'))
          case 'month':
            return billDate.isAfter(now.subtract(1, 'month'))
          case 'year':
            return billDate.isAfter(now.subtract(1, 'year'))
          default:
            return true
        }
      })

      // Group by payment method
      const paymentMap = new Map()

      filteredBills.forEach((bill) => {
        const method = bill.paymentMethod || 'เงินสด'

        if (!paymentMap.has(method)) {
          paymentMap.set(method, {
            method,
            count: 0,
            totalAmount: 0,
          })
        }

        const payment = paymentMap.get(method)
        payment.count += 1
        payment.totalAmount += parseFloat(bill.totalPrice || 0)
      })

      // Convert to array and calculate additional metrics
      this.paymentMethodsData = Array.from(paymentMap.values()).map((pm) => {
        const avgAmount = pm.count > 0 ? pm.totalAmount / pm.count : 0

        return {
          ...pm,
          avgAmount,
          percentOfTotal: 0, // Will be calculated after total
        }
      })

      // Calculate percent of total
      const totalAmount = this.paymentMethodsData.reduce((sum, pm) => sum + pm.totalAmount, 0)
      this.paymentMethodsData = this.paymentMethodsData.map((pm) => ({
        ...pm,
        percentOfTotal: totalAmount > 0 ? (pm.totalAmount / totalAmount) * 100 : 0,
      }))

      // Sort by total amount
      this.paymentMethodsData.sort((a, b) => b.totalAmount - a.totalAmount)

      // Prepare daily summary
      this.prepareDailySummary(filteredBills)
    },

    prepareDailySummary(bills) {
      const dayjs = this.$dayjs
      const last7Days = []

      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day')
        last7Days.push({
          date: date.format('DD/MM/YYYY'),
          dayName: date.format('dddd'),
          dateKey: date.format('DD/MM'),
          count: 0,
          income: 0,
          discount: 0,
          net: 0,
        })
      }

      // Aggregate bills per day
      bills.forEach((bill) => {
        const billDate = dayjs(bill.timestamp)
        const dayIndex = last7Days.findIndex(
          (day) => day.dateKey === billDate.format('DD/MM')
        )

        if (dayIndex !== -1) {
          last7Days[dayIndex].count += 1
          last7Days[dayIndex].income += parseFloat(bill.totalPrice || 0)
          last7Days[dayIndex].discount += parseFloat(bill.discount || 0)
        }
      })

      // Calculate net cash flow
      this.dailySummary = last7Days.map((day) => ({
        ...day,
        net: day.income - day.discount,
      }))
    },

    calculateSummary() {
      this.summary.totalTransactions = this.paymentMethodsData.reduce(
        (sum, pm) => sum + pm.count,
        0
      )
      this.summary.totalIncome = this.paymentMethodsData.reduce(
        (sum, pm) => sum + pm.totalAmount,
        0
      )
      this.summary.totalExpense = this.dailySummary.reduce(
        (sum, day) => sum + day.discount,
        0
      )
      this.summary.netCashFlow = this.summary.totalIncome - this.summary.totalExpense
      this.summary.avgTransaction = this.summary.totalTransactions > 0
        ? this.summary.totalIncome / this.summary.totalTransactions
        : 0
      this.summary.discountRate = this.summary.totalIncome > 0
        ? (this.summary.totalExpense / this.summary.totalIncome) * 100
        : 0
    },

    prepareChartData() {
      // Payment method bar chart
      if (this.paymentMethodsData.length > 0) {
        this.paymentMethodChartData = {
          labels: this.paymentMethodsData.map((pm) => pm.method),
          datasets: [
            {
              label: 'ยอดรวม',
              data: this.paymentMethodsData.map((pm) => pm.totalAmount),
              backgroundColor: this.paymentMethodsData.map((pm) =>
                this.getPaymentIcon(pm.method).color
              ),
            },
          ],
        }
      }

      // Payment method pie chart
      if (this.paymentMethodsData.length > 0) {
        this.paymentMethodPieData = {
          labels: this.paymentMethodsData.map((pm) => pm.method),
          datasets: [
            {
              data: this.paymentMethodsData.map((pm) => pm.totalAmount),
              backgroundColor: this.paymentMethodsData.map((pm) =>
                this.getPaymentIcon(pm.method).color
              ),
            },
          ],
        }
      }

      // Cash flow trend (line chart)
      if (this.dailySummary.length > 0) {
        const dayjs = this.$dayjs

        this.cashFlowTrendData = {
          labels: this.dailySummary.map((day) => {
            const date = dayjs(day.date, 'DD/MM/YYYY')
            return date.format('ddd')
          }),
          datasets: [
            {
              label: 'รายรับ',
              data: this.dailySummary.map((day) => day.income),
              borderColor: '#43e97b',
              backgroundColor: 'rgba(67, 233, 123, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'ส่วนลด',
              data: this.dailySummary.map((day) => day.discount),
              borderColor: '#f5576c',
              backgroundColor: 'rgba(245, 87, 108, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'กระแสเงินสุทธิ',
              data: this.dailySummary.map((day) => day.net),
              borderColor: '#4facfe',
              backgroundColor: 'rgba(79, 172, 254, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        }
      }
    },

    getPaymentIcon(method) {
      const icons = {
        'เงินสด': { icon: 'mdi-cash', color: '#43e97b' },
        'บัตรเครดิต': { icon: 'mdi-credit-card', color: '#4facfe' },
        'โอนเงิน': { icon: 'mdi-bank-transfer', color: '#ffa726' },
        'QR Code': { icon: 'mdi-qrcode', color: '#667eea' },
        'พร้อมเพย์': { icon: 'mdi-cellphone', color: '#f093fb' },
        'บัตรเดบิต': { icon: 'mdi-credit-card-outline', color: '#B27D41' },
      }
      return icons[method] || { icon: 'mdi-cash-multiple', color: '#846537' }
    },
  },
}
