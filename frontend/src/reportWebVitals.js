// Web Vitals performans ölçümlerini başlatan fonksiyon
const reportWebVitals = onPerfEntry => {
  // Eğer bir ölçüm fonksiyonu verilmişse, web-vitals paketini dinamik olarak yükle
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
