import '../css/keystone.css';
import { createPopper } from '@popperjs/core';
import Axios from 'axios';
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);

const indexAPI = 'https://api.blended.kr/keyst/KeystIndex';
const scaledIndexBmAPI = 'https://api.blended.kr/keyst/KeystScaledIndexWithBM';
const indexFactorsAPI = 'https://api.blended.kr/keyst/KeystIndexFactors';

const formatString = (stringValue, replacementsArray) => {
  let formatted = stringValue;
  for (let i = 0; i < replacementsArray.length; i += 1) {
      const regexp = new RegExp(`\\{${i}\\}`, 'gi');
      formatted = formatted.replace(regexp, replacementsArray[i]);
  }
  return formatted;
};

const getIndexData = async () => {
  const res = await Axios.get(indexAPI);
  const rawData = Object.entries(res.data.data.KeystIndex);
  let chartData = [];
  for (let data of rawData) {
    let date = Date.UTC(data[0].slice(0, 4), Number(data[0].slice(4, 6))-1, data[0].slice(6));
    chartData.push([date, data[1]])
  }
  return chartData;
};

const getScaledIndexData = async () => {
  const res = await Axios.get(scaledIndexBmAPI);
  const indexRawData = Object.entries(res.data.data['Index_scaled']);
  const bmRawData = Object.entries(res.data.data['KS11_c']);
  let indexChartData = [];
  let bmChartData = [];
  for (let i = 0; i < indexRawData.length; i++) {
    let index = indexRawData[i];
    let bm = bmRawData[i];
    let date = Date.UTC(index[0].slice(0, 4), Number(index[0].slice(4, 6))-1, index[0].slice(6));
    indexChartData.push([date, index[1]]);
    bmChartData.push([date, bm[1]]);
  }
  return [indexChartData, bmChartData];
};

const getIndexFactorsAPI = async () => {
  const res = await Axios.get(indexFactorsAPI);
  const realEconData = Object.entries(res.data.data['real_econ']);
  const indEconData = Object.entries(res.data.data['ind_econ']);
  const currencyData = Object.entries(res.data.data['currency']);
  const riskData = Object.entries(res.data.data['risk']);
  let realEconChartData = [];
  let indEconChartData = [];
  let currencyChartData = [];
  let riskChartData = [];
  for (let i = 0; i < realEconData.length; i++) {
    let realEcon = realEconData[i];
    let indEcon = indEconData[i];
    let currency = currencyData[i];
    let risk = riskData[i];
    let date = Date.UTC(realEcon[0].slice(0, 4), Number(realEcon[0].slice(4, 6))-1, realEcon[0].slice(6));
    realEconChartData.push([date, realEcon[1]]);
    indEconChartData.push([date, indEcon[1]]);
    currencyChartData.push([date, currency[1]]);
    riskChartData.push([date, risk[1]]);
  }
  return [realEconChartData, indEconChartData, currencyChartData, riskChartData];
};

Highcharts.setOptions({
  lang: {
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    shortMonths: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    weekdays: ['월', '화', '수', '목', '금', '토', '일'],
  }
});

const drawIndexChart = (seriesData) => {
  // let seriesData = [[Date.UTC(2020, 0, 1), 100], [Date.UTC(2020, 0, 2), 105], [Date.UTC(2020, 0, 3), 97]]
  Highcharts.stockChart('emerging-market-chart', {
    chart: {
      backgroundColor: '#fafafa',
      style: { fontFamily: 'NotoSans' },
    },
    rangeSelector: {
      inputEnabled:false,
      buttonTheme: { // styles for the buttons
        fill: 'none',
        stroke: 'none',
        'stroke-width': 0,
        r: 8,
        style: {
          color: '#6c5ce7',
          fontWeight: 'bold'
        },
        states: {
          hover: {
          },
          select: {
            fill: '#6c5ce7',
            style: {
              color: 'white',
            }
          }
          // disabled: { ... }
        }
      },
      inputBoxBorderColor: 'gray',
      inputBoxWidth: 120,
      inputBoxHeight: 18,
      inputStyle: {
        color: '#4564ff',
        fontWeight: 'bold'
      },
      labelStyle: {
        color: 'silver',
        fontWeight: 'bold'
      },
      selected: 1
    },
    navigator : { enabled : false, },
    credits: { enabled: false, },
    exporting: { enabled: false, },
    scrollbar: { enabled: false, },
    title: { text: '', },
    series: [{
      name: '수익',
      data: seriesData,
      type: 'spline',
      tooltip: {
          valueDecimals: 2,
      },
      color: {
        linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
        },
        stops: [
            [0, '#ff7675'],
            // [0.5, '#ffaa6e'],
            [1, '#74b9ff'],
        ],
      },
    },],
  });
};

const drawSingleChart = (name, chartID, seriesData) => {
  Highcharts.stockChart(chartID, {
    chart: {
      backgroundColor: '#fafafa',
      style: { fontFamily: 'NotoSans', },
    },
    rangeSelector: {
      enabled: false,
    },
    navigator : { enabled : false, },
    credits: { enabled: false, },
    exporting: { enabled: false, },
    scrollbar: { enabled: false, },
    title: { text: '', },
    yAxis: {
      gridLineColor: 'transparent',
    },
    series: [{
      name: name,
      data: seriesData,
      type: 'spline',
      tooltip: {
          valueDecimals: 2,
      },
      lineWidth: 0.7,
      color: '#6e6e6e',
    },],
  });
};

const drawTwoCharts = (seriesData) => {
  Highcharts.stockChart('emerging-market-chart', {
    chart: {
      backgroundColor: '#fafafa',
      style: { fontFamily: 'NotoSans', },
    },
    rangeSelector: {
      inputEnabled:false,
      buttonTheme: { // styles for the buttons
        fill: 'none',
        stroke: 'none',
        'stroke-width': 0,
        r: 8,
        style: {
          color: '#6c5ce7',
          fontWeight: 'bold'
        },
        states: {
          hover: {
          },
          select: {
            fill: '#6c5ce7',
            style: {
              color: 'white',
            }
          }
          // disabled: { ... }
        }
      },
      inputBoxBorderColor: 'gray',
      inputBoxWidth: 120,
      inputBoxHeight: 18,
      inputStyle: {
        color: '#4564ff',
        fontWeight: 'bold'
      },
      labelStyle: {
        color: 'silver',
        fontWeight: 'bold'
      },
      selected: 1
    },
    navigator : { enabled : false, },
    credits: { enabled: false, },
    exporting: { enabled: false, },
    scrollbar: { enabled: false, },
    title: { text: '', },
    series: [{
      name: '지표',
      data: seriesData[0],
      type: 'spline',
      tooltip: {
          valueDecimals: 2,
      },
      color: {
        linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
        },
        stops: [
            [0, '#ff7675'],
            // [0.5, '#ffaa6e'],
            [1, '#74b9ff'],
        ],
      },
    },
    {
      name: '코스피',
      data: seriesData[1],
      type: 'spline',
      tooltip: {
          valueDecimals: 2,
      },
      color: '#e6e6e6',
    },],
  });
};

window.addEventListener('load', async () => {
  const data = await getIndexData();
  const values = data.map((d) => { return d[1] });
  const maxData = Math.max.apply(null, values);
  const minData = Math.min.apply(null, values);
  const indexScore = Math.trunc((values.slice(-1)[0] - minData) / (maxData - minData) * 100);
  // drawIndexChart(data);
  document.getElementById("thumb-div").style.width = `${indexScore}%`;
  const barThumb = document.querySelector('#bar-thumb');
  const barThumbTooltip = document.querySelector('#bar-thumb-tooltip');
  barThumbTooltip.innerText = `${indexScore}`

  createPopper(barThumb, barThumbTooltip, {
      placement: 'bottom',
  });

  let res = await getScaledIndexData();
  drawTwoCharts(res);

  // let res = await getIndexFactorsAPI();
  // drawSingleChart('수익', data);

  res = await getIndexFactorsAPI();
  drawSingleChart('실물경기', 'sd-chart', res[0]);
  drawSingleChart('기업경기', 'business-chart', res[1]);
  drawSingleChart('환율', 'currency-chart', res[2]);
  drawSingleChart('리스크', 'risk-chart', res[3]);

  const logo = document.getElementById('logo');
  const keystLogo = document.getElementById('keyst-logo');

  logo.addEventListener('click', (event) => {
      window.location.href = "/";
  });

  keystLogo.addEventListener('click', (event) => {
    let win = window.open('http://keyst.co.kr/', '_blank');
    win.focus();
  });
});