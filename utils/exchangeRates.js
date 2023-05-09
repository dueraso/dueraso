import axios from 'axios'

export async function getUpdateInDay(i18n) {
  try {
    const response = await axios.get('https://www.bangkokbank.com/api/exchangerateservice/GetDateTimeLastUpdate', {
      headers: {
        'ocp-apim-subscription-key': '7d1b09abe2ea413cbf95b2d99782ed37'
      }
    })
    // console.log(await Getfxrates(response.data[response.data.length - 1],i18n))
    return await Getfxrates(response.data[response.data.length - 1],i18n)
  } catch (error) {
    console.error(error)
    return null
  }
}
export async function Getfxrates(data, i18n){
  try {
    const res = await axios.get(`https://www.bangkokbank.com/api/exchangerateservice/Getfxrates/${data.Day}/${data.Update}/th`, {
      headers: {
        'ocp-apim-subscription-key': '7d1b09abe2ea413cbf95b2d99782ed37'
      }
    })
    return res.data.find((d)=>d.Description === (i18n === "en"?"USD: 1-2":"China"))
  } catch (e) {
    console.error(e)
    return null
  }
  // await axios.get(`https://www.bangkokbank.com/api/exchangerateservice/Getfxrates/${data.Day}/${data.Update}/th`,{
  //   headers:{
  //     "ocp-apim-subscription-key":"7d1b09abe2ea413cbf95b2d99782ed37"
  //   }
  // }).then((res)=>{
  //   // console.log(res.data)
  //   return res.data.find((d)=>d.Description === (i18n === "en"?"USD: 1-2":"China"))
  // }).catch((e)=>{
  //   console.log(e.data)
  // })
}
