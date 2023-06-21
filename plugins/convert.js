import dayjs from "dayjs";
export default {

  datetime(val = dayjs(), _format = "DD/MM/YYYY HH:mm") {

    return dayjs(val).format(_format)
    // Your extended function logic here
  },

  money(val = 0.00) {
    return parseInt(val).toLocaleString(undefined, {minimumFractionDigits: 2});
  },

  calculateArray(val = [0]){
    return val.reduce((accumulator, currentValue) => accumulator + currentValue)
  }
}
