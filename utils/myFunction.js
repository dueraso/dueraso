import axios from "@/con/config";
import dayjs from "dayjs";
class A {
  // parent method
  print() {
    console.log("class A");
  }
  openItem(val) {
    console.log("val> " + JSON.stringify(val))
    return Object.assign({}, val)
  }
  getData(url, params) {
    var data = "dd"
    axios.get(url,{
      params:{
        params
      }
    })
  }
}

class B extends A {
  convertDay(){
    console.log("ddddd")
    return dayjs()
  }
  // override method
  getData(url, params) {
    return super.getData(url, params);
  }

  print() {
    console.log("class B");
  }
  parentPrint() {
    super.print();
  }
}

export default B
