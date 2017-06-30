"use strict"

var G = {} // Global variables box

G.MAP_FILE = "mapdata/china.json";

G.WIDTH = 1260;
G.MAP_H = 820;
G.BACKCOLOR = "#D1EEEE";

G.svg = d3.select("#content")
            .append("svg")
            .attr("width", G.WIDTH)
            .attr("height", G.MAP_H)
            .call(d3.behavior.zoom()
                    .scaleExtent([0.1, 300])
                    .on('zoom', function() {
                        d3.select('#china-map').attr('transform', 'translate(' +
                        d3.event.translate + ')scale(' + d3.event.scale + ')');
            })).append("g")
            .attr("id", "zoom-canvas") //for legend layout
            .append("g")
            .attr("id", "china-map")
            .attr("transform", "translate(0,0)");
/***********document struct ********
 *
#content
|_ svg
    |_g#zoom-canvas
         |_g#china-map
         |    |_ <path>
         |    |_ <path>
         |    |_ ...
         |_g#color-legend
*
************************************/

G.aqd = {};  // air quality data box
G.axis = {}; // input value box
G.axis.calendar = {
        "year": "2016",
        "month": "01",
        "day": "01",
};
G.axis.hour = "12";
G.axis.aqtype = "AQI";

G.province = {"11":"北京","12":"天津","13":"河北","14":"山西","15":"内蒙古","21":"辽宁","22":"吉林","23":"黑龙江","31":"上海","32":"江苏","33":"浙江","34":"安徽","35":"福建","36":"江西","37":"山东","41":"河南","42":"湖北","43":"湖南","44":"广东","45":"广西","46":"海南","50":"重庆","51":"四川","52":"贵州","53":"云南","54":"西藏","61":"陕西","62":"甘肃","63":"青海","64":"宁夏","65":"新疆","70":"台湾","81":"香港特别行政区"};

// 颜色标尺设定
G.colorScale = {};
G.colorScale["AQI"] = d3.scale.linear()
                    .range([d3.hsl(120, 0.7, 0.6),
                            d3.hsl(90, 0.7, 0.6),
                            d3.hsl(60, 0.7, 0.6),
                            d3.hsl(10, 0.7, 0.6),
                            d3.hsl(-10, 0.7, 0.6),
                            d3.hsl(-30, 0.7, 0.6)])
                    .interpolate(d3.interpolateLab)
                    .domain(Object.values([0, 50, 150, 200, 300, 500]));

window.query = function(el) { return document.querySelector(el); }
window.queryAll = function(el) { return document.querySelectorAll(el); }

/******************** Global variables End **********************/

// 初始化各种选择器的值和显示
query('#current-date input').value = 1; //偷懒
query('#current-hour input').value = G.axis.hour + ":00";
query('#current-aqtype select').value = G.axis.aqtype;
query('#stat-aqtype').innerHTML = G.axis.aqtype;
query('#date-text').innerHTML = Object.values(G.axis.calendar).join('-');
query('#hour-text').innerHTML = G.axis.hour + ":00";

// 用于日期选择滑块
function nthDaysOf(year, value) {
    // year 2016 is not prime
    var daysOfMonth = [0, 31,28,31,30,31,30,31,31,30,31,30,31];
    var cumm, prev_cumm;
    var month, day;
    var value = + value;

    for(var cumm=0, i=0; i<=12; i++) {
        prev_cumm = cumm;
        cumm += daysOfMonth[i];
        if(cumm >= value) {
            month = i;
            day = value - prev_cumm;
            break;
        }
    }
    month += "";
    day += "";
    if(month.length == 1) {month = "0" + month;}
    if(day.length == 1) {day = "0" + day;}

    return month+'-'+day;
}

// 仅绘制前 N 个地区
d3.select('#stat-control').on('change', function(){
    colorMap(G.axis);
})
query('#current-aqtype').addEventListener('input',function(){
    G.axis.aqtype = query('#current-aqtype select').value;
    query('#stat-aqtype').innerHTML = G.axis.aqtype;
    colorMap(G.axis);
});

// Listen time and type control
d3.select("#time-axis").on('change', function() {
    var date = "2016-" + nthDaysOf("2016", query("#current-date input").value);
    var hour = query("#current-hour input").value + "";
    if(hour.length == 1) { hour = "0" + hour; }
    var aqtype = query("#current-aqtype select").value;
    var date_ar = date.split('-');
    G.axis.calendar.year = date_ar[0];
    G.axis.calendar.month = date_ar[1];
    G.axis.calendar.day = date_ar[2];
    G.axis.hour = hour;
    G.axis.aqtype = aqtype;

    query('#date-text').innerHTML = date;
    query('#hour-text').innerHTML = hour + ":00";

    //重绘地图，并消除详细信息面板
    colorMap(G.axis);
    hideDetails();
})

// 全文最重要的入口函数
drawMap();
