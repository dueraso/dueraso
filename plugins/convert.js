import dayjs from "dayjs";

export default {

  datetime(val = dayjs(), _format = "DD/MM/YYYY HH:mm") {
    return dayjs(val).format(_format)
  },

  money(val = 0.00, fraction = 2) {
    return parseFloat(val).toLocaleString(undefined, {
      minimumFractionDigits: fraction
    });
  },

  calculateArray(val, isMoney = false) {
    if (val.length <= 0) return 0
    if (!isMoney) {
      return val.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.total;
      }, 0);
    } else {
      let convertedArray = 0.00;
      val.forEach(item => {
        convertedArray += item.price * item.total;
      });
      return convertedArray;
    }
  },

  countObjectArray(originalArray) {
    const convertedArray = [];

    originalArray.forEach(item => {
      const existingItem = convertedArray.find(
        convertedItem => convertedItem.id === item.id && convertedItem.name === item.name
      );

      if (existingItem) {
        existingItem.total += item.total;
      } else {
        convertedArray.push({...item})
      }
    });

    return convertedArray;
  },
}
