export default (_, inject) => {
  inject('headUtil', data =>
    ({
      htmlAttrs: {
        lang: data.lang
      },
      title: data.title,
      meta:
        [
          {
            hid: 'description',
            name: 'description',
            content: data.description || 'เว็บไซต์จัดการร้านค้าขนาดเล็ก'
          },
          {
            name: 'pos',
            content: ['pos', 'จัดการรายรับรายจ่ายร้าน', 'จัดการร้าน']
          },
          {
            property: 'og:title',
            name: 'og:title',
            content: data.title || 'เว็บไซต์จัดการร้านค้าขนาดเล็ก'
          },
          {
            property: 'og:description',
            name: 'og:description',
            content: data.description
          },
          {
            property: 'og:url',
            name: 'og:url',
            content: 'www.dueraso.com'
          },
          {
            property: 'og:site_name',
            name: 'og:site_name',
            content: 'MylebSite'
          },
          {
            property: 'og: image',
            name: 'og: image',
            content: data.image
          }
        ],
      link: [
        {
          rel: 'canonical',
          href: data.urlPath ? data.urlPath : ''
        }
      ]
    })
  )
}
