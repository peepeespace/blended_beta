import "../css/trader.css";
import { createPopper } from "@popperjs/core";
import Axios from "axios";
import Highcharts from "highcharts/highstock";
import Exporting from "highcharts/modules/exporting";

import * as ChartModuleMore from "highcharts/highcharts-more.js";
import HCSoldGauge from "highcharts/modules/solid-gauge";

ChartModuleMore(Highcharts);
HCSoldGauge(Highcharts);
Exporting(Highcharts);

Highcharts.setOptions({
  lang: {
    months: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    shortMonths: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    weekdays: ["월", "화", "수", "목", "금", "토", "일"],
  },
});

const formatString = (stringValue, replacementsArray) => {
  let formatted = stringValue;
  for (let i = 0; i < replacementsArray.length; i += 1) {
    const regexp = new RegExp(`\\{${i}\\}`, "gi");
    formatted = formatted.replace(regexp, replacementsArray[i]);
  }
  return formatted;
};

const getCodeData = async (code) => {
  const codeData = await Axios.get(formatString(codeDataURL, [code]));
  let data = Object.entries(codeData.data.data);
  data = data.map((val, idx) => {
    return [
      Date.UTC(
        val[0].slice(0, 4),
        Number(val[0].slice(4, 6)) - 1,
        val[0].slice(6)
      ),
      val[1],
    ];
  });
  return data;
};

const drawSingleChart = (name, chartID, seriesData) => {
  Highcharts.stockChart(chartID, {
    chart: {
      backgroundColor: "#fafafa",
      style: { fontFamily: "NotoSans" },
    },
    rangeSelector: {
      enabled: false,
    },
    navigator: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
    scrollbar: { enabled: false },
    title: { text: "" },
    yAxis: {
      gridLineColor: "transparent",
    },
    series: [
      {
        name: name,
        data: seriesData,
        type: "spline",
        tooltip: {
          valueDecimals: 2,
        },
        lineWidth: 0.7,
        color: "#6e6e6e",
      },
    ],
  });
};

const createPortfolioSectionChart = (idName) => {
  Highcharts.chart(idName, {
    chart: {
      type: "column",
      backgroundColor: "#fafafa",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["1주일", "1개월", "3개월", "6개월", "1년"],
    },
    yAxis: {
      title: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: "포트폴리오",
        data: [5, 3, 4, 7, 2],
      },
      {
        name: "KOSPI",
        data: [2, -2, -3, 2, 1],
      },
      {
        name: "NASDAQ",
        data: [3, 4, 4, -2, 5],
      },
    ],
  });
};

const createSummarySectionChart = (idName) => {
  Highcharts.chart(idName, {
    chart: {
      type: "solidgauge",
      height: "110%",
      reflow: true,
    },

    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },

    tooltip: {
      style: {
        display: "none",
      },
    },

    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [
        {
          // Track for Move
          outerRadius: "112%",
          innerRadius: "88%",
          backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
            .setOpacity(0.3)
            .get(),
          borderWidth: 0,
        },
      ],
    },

    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: "round",
        stickyTracking: false,
        rounded: true,
      },
    },

    series: [
      {
        name: "Move",
        data: [
          {
            color: Highcharts.getOptions().colors[0],
            radius: "112%",
            innerRadius: "88%",
            y: 80,
          },
        ],
      },
    ],
  });
};

createPortfolioSectionChart("portfolio-chart");
createSummarySectionChart("summary-chart");

// initial section event listners
// CURR_PAGE_CONTENT --> MAIN, MBTI, HISTORY, DIARY
let CURR_PAGE_CONTENT = "MAIN";

const actionBtns = document.getElementsByClassName("action-btn");
for (let btn of actionBtns) {
  btn.addEventListener("click", (e) => {
    let btnText = btn.innerText;
    console.log(btnText);
    if (btnText == "내 주식 성향 파악하기 😘") {
      // MBTI
      CURR_PAGE_CONTENT = "MBTI";

      document.getElementById("initial").style.display = "none";
      document.getElementById("mbti").style.display = "block";
    } else if (btnText == "내 매매내역 분석하기 🤫") {
      // HISTORY
    } else if (btnText == "내 매매일지 작성하기 ✍") {
      // DIARY
    }
  });
}

const codeDataURL = "https://api.blended.kr/adj_close/{0}";

const getData = async () => {
  let data = await getCodeData("005930");
  drawSingleChart("삼성전자", "005930", data);

  data = await getCodeData("024810");
  drawSingleChart("이화전기", "024810", data);
};

getData();
