import '../css/keystone.css';
import { createPopper } from '@popperjs/core';
import Axios from 'axios';
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);

const indexAPI = 'https://api.blended.kr/close_by_date/KeystIndex';

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
  const rawData = Object.entries(res.data.KeystIndex);
  let chartData = [];
  for (let data of rawData) {
    let date = Date.UTC(data[0].slice(0, 4), Number(data[0].slice(4, 6))-1, data[0].slice(6));
    chartData.push([date, data[1]])
  }
  return chartData;
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

window.addEventListener('load', async () => {
  const data = await getIndexData();
  const values = data.map((d) => { return d[1] });
  const maxData = Math.max.apply(null, values);
  const minData = Math.min.apply(null, values);
  const indexScore = Math.trunc((values.slice(-1)[0] - minData) / (maxData - minData) * 100);
  drawIndexChart(data);
  document.getElementById("thumb-div").style.width = `${indexScore}%`;
  const barThumb = document.querySelector('#bar-thumb');
  const barThumbTooltip = document.querySelector('#bar-thumb-tooltip');
  barThumbTooltip.innerText = `${indexScore}`

  createPopper(barThumb, barThumbTooltip, {
      placement: 'bottom',
  });
});