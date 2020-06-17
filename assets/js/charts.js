import '../css/charts.css';
window.$ = window.jQuery = require('jquery');
const sparkline = require('./sparkline.min.js');
import Axios from 'axios';

// https://atomiks.github.io/tippyjs/ --> 툴팁 적용하기

const formatString = (stringValue, replacementsArray) => {
  let formatted = stringValue;
  for (let i = 0; i < replacementsArray.length; i += 1) {
      const regexp = new RegExp(`\\{${i}\\}`, 'gi');
      formatted = formatted.replace(regexp, replacementsArray[i]);
  }
  return formatted;
};

const codelistURL = 'https://api.blended.kr/codelist/{0}';
const codeDataURL = 'https://api.blended.kr/adj_close/{0}';

let CHART = {
  sparklineSection: document.getElementsByClassName('sparklines')[0],
  chartSectionHTML: `
  <div class="chart" draggable="true">
    <div class="title">{0}</div>
    <div id="{1}"></div>
  </div>
  `,
  codelist: [],
  codeNameDict: {},
  totalCodeNum: 0,
  chartDataDict: {},
  dateFilter: 'ALL',
  sizeFilter: '소',
  showFilter: '이름',
  chartWidth: '60px',
  chartHeight: '25px',
  cutNameIndex: 6,
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

const getCodelist = async (type) => {
  let url = formatString(codelistURL, [type])
  const codelist = await Axios.get(url);
  return codelist.data;
};

const getCodeData = async (code) => {
  const codeData = await Axios.get(formatString(codeDataURL, [code]));
  CHART.codeNameDict[code] = codeData.data.name;
  return Object.values(codeData.data.data);
};

const getDateFilteredCodeData = (codeData, filter) => {
  let filterLength;
  let chartCodeData;

  if (filter == 'ALL') {
    filterLength = codeData.length;
  } else if (filter == '1M') {
    filterLength = 20;
  } else if (filter == '3M') {
    filterLength = 60;
  } else if (filter == '6M') {
    filterLength = 120;
  } else if (filter == '1Y') {
    filterLength = 240;
  } else if (filter == '3Y') {
    filterLength = 240 * 3;
  } else if (filter == '5Y') {
    filterLength = 240 * 5;
  } else if (filter == '10Y') {
    filterLength = 240 * 10;
  }
  chartCodeData = codeData.slice(Math.max(codeData.length - filterLength, 0));
  return chartCodeData;
}

const main = async () => {
  const sparklineSection = CHART.sparklineSection;
  CHART.codelist = await getCodelist('stock');
  CHART.totalCodeNum = CHART.codelist.length;
  let html = '';
  if (CHART.totalChartNumOnPage == 0) {
    let renderList = CHART.codelist.slice(CHART.totalChartNumOnPage, CHART.chartNum * 2);
    for (let code of renderList) {
      let ticker = code.split('|')[0];
      let name = code.split('|')[1];
      if (CHART.showFilter == '코드') {
        html += formatString(CHART.chartSectionHTML, [ticker, ticker]);
      } else if (CHART.showFilter == '이름') {
        html += formatString(CHART.chartSectionHTML, [name.slice(0, CHART.cutNameIndex), ticker]);
      }
    }
    sparklineSection.innerHTML = html;
    for (let code of renderList) {
      let ticker = code.split('|')[0];
      getCodeData(ticker).then((codeData) => {
        CHART.chartDataDict[ticker] = codeData;
        let chartCodeData = getDateFilteredCodeData(codeData, CHART.dateFilter);
        createSparkline('#' + ticker, CHART.chartWidth, CHART.chartHeight, chartCodeData);
      });
    }
    CHART.totalChartNumOnPage += CHART.chartNum * 2;
  }
};

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
    let ticker = code.split('|')[0];
    let name = code.split('|')[1];
    if (CHART.showFilter == '코드') {
      html += formatString(CHART.chartSectionHTML, [ticker, ticker]);
    } else if (CHART.showFilter == '이름') {
      html += formatString(CHART.chartSectionHTML, [name.slice(0, CHART.cutNameIndex), ticker]);
    }
  }
  sparklineSection.insertAdjacentHTML('beforeend', html);
  for (let code of renderList) {
    let ticker = code.split('|')[0];
    if (!(ticker in CHART.chartDataDict)) {
      getCodeData(ticker).then((codeData) => {
        CHART.chartDataDict[ticker] = codeData;
        let chartCodeData = getDateFilteredCodeData(codeData, CHART.dateFilter);
        createSparkline('#' + ticker, CHART.chartWidth, CHART.chartHeight, chartCodeData);
      });
    } else {
      let codeData = CHART.chartDataDict[ticker];
      let chartCodeData = getDateFilteredCodeData(codeData, CHART.dateFilter);
      createSparkline('#' + ticker, CHART.chartWidth, CHART.chartHeight, chartCodeData);  
    }
  }
  CHART.totalChartNumOnPage += CHART.chartNum;
};

const redrawPageCharts = async () => {
  const sparklineSection = CHART.sparklineSection;
  let html = '';
  let from = 0;
  let to = CHART.totalChartNumOnPage;
  let renderList = CHART.codelist.slice(from, to);
  for (let code of renderList) {
    let ticker = code.split('|')[0];
    let name = code.split('|')[1];
    if (CHART.showFilter == '코드') {
      html += formatString(CHART.chartSectionHTML, [ticker, ticker]);
    } else if (CHART.showFilter == '이름') {
      html += formatString(CHART.chartSectionHTML, [name.slice(0, CHART.cutNameIndex), ticker]);
    }
  }
  sparklineSection.innerHTML = '';
  sparklineSection.insertAdjacentHTML('beforeend', html);
  for (let code of renderList) {
    let ticker = code.split('|')[0];
    if (!(ticker in CHART.chartDataDict)) {
      getCodeData(ticker).then((codeData) => {
        CHART.chartDataDict[ticker] = codeData;
        let chartCodeData = getDateFilteredCodeData(codeData, CHART.dateFilter);
        createSparkline('#' + ticker, CHART.chartWidth, CHART.chartHeight, chartCodeData);
      });
    } else {
      let codeData = CHART.chartDataDict[ticker];
      let chartCodeData = getDateFilteredCodeData(codeData, CHART.dateFilter);
      createSparkline('#' + ticker, CHART.chartWidth, CHART.chartHeight, chartCodeData);  
    }
  }
};

const changeCodelist = async (type) => {
  CHART.codelist = await getCodelist(type);
  CHART.totalCodeNum = CHART.codelist.length;
  if (CHART.codelist.length < CHART.chartNum) {
    CHART.totalChartNumOnPage = CHART.codelist.length;
  } else if (CHART.totalCodeNum >= CHART.chartNum * 2) {
    CHART.totalChartNumOnPage = CHART.chartNum * 2;
  } else {
    CHART.totalChartNumOnPage = CHART.chartNum;
  }
  redrawPageCharts();
}

//////////////////////
///// MAIN EVENT /////
//////////////////////
window.addEventListener('load', async () => {

  const logo = document.getElementById('logo');

  logo.addEventListener('click', (event) => {
    window.location.href = "/service";
  });

  const serviceBtns = document.getElementsByClassName('service');

  for (let serviceBtn of serviceBtns) {
    serviceBtn.addEventListener('click', (event) => {
      if (serviceBtn.innerText == '서비스') {
        window.location.href = "/service";
      }
    });
  }

  const moreBtn = document.getElementById('view-more');

  moreBtn.addEventListener('click', async (event) => {
    await addCharts();
  });

  await main();

  const dateRangeBtns = document.getElementsByClassName('date-range-btn');

  for (let btn of dateRangeBtns) {
    btn.addEventListener('click', (event) => {
      CHART.dateFilter = btn.innerText;
      redrawPageCharts();
    });
  }

  const chartSizeBtns = document.getElementsByClassName('chart-style-btn');

  for (let btn of chartSizeBtns) {
    btn.addEventListener('click', (event) => {
      if (CHART.sizeFilter != btn.innerText) {
        CHART.sizeFilter = btn.innerText;
        if (CHART.sizeFilter == '소') {
          CHART.chartWidth = '60px'
          CHART.chartHeight = '25px'
          CHART.cutNameIndex = 6
        } else if (CHART.sizeFilter == '중') {
          CHART.chartWidth = '100px'
          CHART.chartHeight = '45px'
          CHART.cutNameIndex = 12
        } else if (CHART.sizeFilter == '대') {
          CHART.chartWidth = '200px'
          CHART.chartHeight = '95px'
          CHART.cutNameIndex = 24
        }
        redrawPageCharts();
      }
    });
  }

  const chartNameBtns = document.getElementsByClassName('chart-name-btn');

  for (let btn of chartNameBtns) {
    btn.addEventListener('click', (event) => {
      CHART.showFilter = btn.innerText;
      redrawPageCharts();
    });
  }

  const marketTypeBtns = document.getElementsByClassName('market-type-btn');

  for (let btn of marketTypeBtns) {
    btn.addEventListener('click', (event) => {
      if (btn.innerText == '주식') {
        changeCodelist('stock');
      } else if (btn.innerText == 'ETF') {
        changeCodelist('etf');
      } else if (btn.innerText == '스팩') {
        changeCodelist('spac');
      } else if (btn.innerText == '전체') {
        changeCodelist('all');
      }
    });
  }

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("main-modal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});