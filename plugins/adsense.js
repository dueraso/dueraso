// plugins/adsense.js
export default ({ route }, inject) => {
  const enableAds = route.name === 'target-page'; // Define your condition here

  if (enableAds) {
    const script = document.createElement('script');
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }
}
