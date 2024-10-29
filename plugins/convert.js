import dayjs from "dayjs";

export default {
  formatPhoneNumber(phoneNumberString) {
    if (phoneNumberString === null) return
    return phoneNumberString.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3')
  },
  formatIc(phoneNumberString) {
    return phoneNumberString.replace(/^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/, '$1-$2-$3-$4-$5')
  },

  datetime(val = dayjs(), _format = "DD/MM/YYYY HH:mm") {
    return dayjs(val).format(_format)
  },

  money(val = "0.00", fraction = 2) {
    return parseFloat(val).toLocaleString(undefined, {
      minimumFractionDigits: fraction
    });
  },

  generatePasswork(length){
    let newPassword = ""
    const getRandomChar = () => {
      const charSets = [
        [48, 57],  // Numbers (0-9)
        [65, 90],  // Uppercase letters (A-Z)
        [97, 122], // Lowercase letters (a-z)
        // [33],  // Special characters (!"#$%&'()*+,-./)
        // [35],  // Special characters (!"#$%&'()*+,-./)
        // [42, 43],  // Special characters (!"#$%&'()*+,-./)
        // [91, 96],  // Special characters ([\]^_`)

      ];

      // Select a random character set
      const charSet = charSets[Math.floor(Math.random() * charSets.length)];
      // Generate a random character code from the selected set
      const charCode = Math.floor(Math.random() *
        (charSet[1] - charSet[0] + 1)) + charSet[0];
      // Convert the character code to a character
      return String.fromCharCode(charCode);
    };

    for (let i = 0; i < length; i++) {
      newPassword += getRandomChar();
    }
    return newPassword
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

  groupChildren(originalArray) {
    // Create a mapping of parent IDs to their corresponding items
    const idToItem = originalArray.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});

    // Use reduce to create the final nested structure
    return originalArray.reduce((result, item) => {
      if (item.parent === null) {
        result.push(item);
      } else {
        const parentItem = idToItem[item.parent];
        if (!parentItem.children) {
          parentItem.children = [];
        }
        parentItem.children.push(item);
      }
      return result;
    }, []);
  },

  height (val) {
    if(val) {
      return val.breakpoint.name
    }
    return ""
  }
}
