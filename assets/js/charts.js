import '../css/charts.css';
window.$ = window.jQuery = require('jquery');
const sparkline = require('./sparkline.min.js');
import Axios from 'axios';

const formatString = (stringValue, replacementsArray) => {
  let formatted = stringValue;
  for (let i = 0; i < replacementsArray.length; i += 1) {
      const regexp = new RegExp(`\\{${i}\\}`, 'gi');
      formatted = formatted.replace(regexp, replacementsArray[i]);
  }
  return formatted;
};

const codelistURL = 'http://127.0.0.1:8081/api/codelist';
const codeDataURL = 'http://127.0.0.1:8081/api/{0}';

let CHART = {
  sparklineSection: document.getElementsByClassName('sparklines')[0],
  chartSectionHTML: `
  <div class="chart" draggable="true">
    <div class="title">{0}</div>
    <div id="{1}"></div>
  </div>
  `,
  codelist: [],
  totalCodeNum: 0,
  chartDataDict: {},
  filteredChartDataDict: {},
  dateFilter: 'ALL',
  chartNum: 150,
  totalChartNumOnPage: 0
}

const createSparkline = (chartID, width, height, data) => {
  $(chartID).sparkline(data, {
    type: 'line',
    // barColor: 'green',
    width: width,
    height: height,
    fillColor: '#fcfcfc',
    lineColor: '#6b6b6b',
    spotColor: '#FF385A', // 차트 맨 마지막에 찍히는 점 색
    spotRadius: '2',
    minSpotColor: '#ff59ea',
    maxSpotColor: '#b32aff',
    highlightSpotColor: '#777777', // 라인 차트 위에 있는 데이터점
    highlightLineColor: '#ff99f2', // 마우스 호버할 때 생기는 수직선
    // highlightLineColor: '#D1D1D1',
    lineWidth: '1',
    disableTooltips: 'true',
  });
};

const getCodelist = async () => {
  const codelist = await Axios.get(codelistURL);
  return codelist.data;
};

const getCodeData = async (code) => {
  const codeData = await Axios.get(formatString(codeDataURL, [code]));
  return Object.values(codeData.data);
};

const main = async () => {
  const sparklineSection = CHART.sparklineSection;
  CHART.codelist = await getCodelist();
  CHART.totalCodeNum = CHART.codelist.length;
  let html = '';
  if (CHART.totalChartNumOnPage == 0) {
    let renderList = CHART.codelist.slice(CHART.totalChartNumOnPage, CHART.chartNum * 2);
    for (let code of renderList) {
      html += formatString(CHART.chartSectionHTML, [code, code]);
    }
    sparklineSection.innerHTML = html;
    for (let code of renderList) {
      getCodeData(code).then((codeData) => {
        CHART.chartDataDict[code] = codeData;
        createSparkline('#' + code, '60px', '25px', codeData);
      });
    }
    CHART.totalChartNumOnPage += CHART.chartNum * 2;
  }
};

window.addEventListener('load', async () => {

  const addCharts = async () => {
    const sparklineSection = CHART.sparklineSection;
    let html = '';
    let from = CHART.totalChartNumOnPage;
    let to = CHART.totalChartNumOnPage + CHART.chartNum;
    if (to > CHART.totalCodeNum) {
      to = CHART.totalCodeNum;
    }
    let renderList = CHART.codelist.slice(from, to);
    for (let code of renderList) {
      html += formatString(CHART.chartSectionHTML, [code, code]);
    }
    sparklineSection.insertAdjacentHTML('beforeend', html);
    for (let code of renderList) {
      getCodeData(code).then((codeData) => {
        CHART.chartDataDict[code] = codeData;
        createSparkline('#' + code, '60px', '25px', codeData);
      });
    }
    CHART.totalChartNumOnPage += CHART.chartNum;
  };

  // window.addEventListener('resize', (event) => {
  //   console.log(window.innerWidth);
  // });

  const moreBtn = document.getElementById('view-more');

  moreBtn.addEventListener('click', async (event) => {
    await addCharts();
  });

  const dateRangeBtns = document.getElementsByClassName('date-range-btn');

  for (let btn of dateRangeBtns) {
    btn.addEventListener('click', (event) => {
      CHART.dateFilter = btn.innerText;
      for (let code in CHART.chartDataDict) {
        console.log(code);
      }
    });
  }

  main();

});