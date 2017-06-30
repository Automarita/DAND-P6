"use strict"

//根据 #stat-control 输入 得到需保留配色的城市列表
function getTop(df, n, asc_desc) {
    var cities = Object.keys(df);
    if(n == 0) return cities; //文本框为空时

    if(asc_desc == 'asc') {
        return cities.sort(function(a,b) {
            return df[a] - df[b];
        }).slice(0, n);
    } else {
        return cities.sort(function(a,b) {
            return df[b] - df[a];
        }).slice(0, n);
    }
}

// 更新颜色标尺
function updateLegend() {
    d3.select('#color-legend').remove();
    var legendBox = d3.select('#zoom-canvas')
        .append('g')
        .attr('id', 'color-legend')
        .attr('transform', 'translate(20,20)');
}

// 显示详细内容，colorMap 内的回调
function showDetails(d) {
    var region_id = d.properties.id;
    var details = query('#details');

    // 收集用于显示的数据
    var region_name;
    if(region_id.length == 2) {
        region_name = G.province[region_id];
    } else {
        region_name = G.province[region_id.slice(0,2)] + d.properties.name;
    }

    var record_time = "";
    record_time += (G.axis.calendar.year  + "年");
    record_time += (G.axis.calendar.month + "月");
    record_time += (G.axis.calendar.day   + "日");
    record_time += (G.axis.hour   + "时");

    var aqtype_html = {"AQI": "AQI",
                       "PM2.5": "PM<sub>2.5</sub>",
                       "PM10":  "PM<sub>10</sub>",
                       "SO2": "SO<sub>2</sub>",
                       "NO2": "NO<sub>2</sub>"}

    var aqvalue = G.aqd[G.axis.aqtype][d.properties.name];

    //根据收集来的数据构造 DOM 节点
    query('#details').classList.remove('hidden');;
    query('#region-name').innerHTML = region_name;
    query('#record-time').innerHTML = record_time;
    if(aqvalue) {
        query('#aqvalue').innerHTML = aqtype_html[G.axis.aqtype] + ":" + aqvalue;
        if(G.axis.aqtype != "AQI") {
            query('#aqvalue').innerHTML += "&mu;g/m<sup>3</sup>"
        }
    } else {
        query('#aqvalue').innerHTML = '无数据';
    }
}

// 隐藏详细内容
function hideDetails() {
    query('#details').classList.add('hidden');
}

// 根据时间和污染物类型选项为地图染色
function colorMap(axis) {
    var date = Object.values(axis.calendar).join('');
    var hour = axis.hour;
    var filepath = "json/" + date + hour + ".json";
    d3.json(filepath, function(err, root) {
        if(root) { // 有数据
            G.aqd = root;
            var df = G.aqd[axis.aqtype];
            Object.keys(df).forEach(function (key) {
                df[key] = parseFloat(df[key]);
            }); // 从 json 读出的数字默认皆为字符串，需转化
            var min = d3.min(Object.values(df));
            var max = d3.max(Object.values(df));

            //色标
            G.colorScale["pollute"] = d3.scale.linear()
                          .range([d3.hsl(120, 0.7, 0.6),
                                  d3.hsl(90, 0.7, 0.6),
                                  d3.hsl(60, 0.7, 0.6),
                                  d3.hsl(0, 0.7, 0.6)])
                          .interpolate(d3.interpolateLab)
                          .domain([0, min, min+max/2, max]);


            //检查需要显示的城市
            var nums = +(query('#stat-n').value);
            var asc_desc = query('#asc-desc').value;
            var selected = getTop(df, nums, asc_desc);

            d3.selectAll('.path-city')
                .attr('fill', function(d) {    // 计算各地区染色值
                    var city_name = d.properties.name;
                    if(selected.indexOf(city_name) > -1) {
                        if(df[city_name]){
                            if(axis.aqtype == "AQI") {
                                return G.colorScale["AQI"](df[city_name]);
                            } else {
                                return G.colorScale["pollute"](df[city_name]);
                            }
                        } else {                  // 空值染背景色
                            return G.BACKCOLOR;
                        }
                    } else {
                        return G.BACKCOLOR; // 不在筛选之列
                    }
                }).on('mouseenter', function() {
                    this.classList.add("selected");
                }).on('mouseleave', function() {
                    this.classList.remove("selected");
                }).on('mouseover', showDetails)
                .on('mouseout',  hideDetails);

            // 绘制图例标尺
            updateLegend();
            G.legendPainter = d3.legend.color()
             .cells(10)
             .title('图例')
             .ascending(true);

            if(axis.aqtype == "AQI") {
                G.legendPainter.scale(G.colorScale["AQI"]);
            } else {
                G.legendPainter.scale(G.colorScale["pollute"]);
            }
            G.legendPainter(d3.select('#color-legend'));
        } else { // json获取失败，全部填背景色
            d3.selectAll('.path-city')
                .attr('fill', function(d) {
                    return G.BACKCOLOR;
                });
        }
    });

}

function drawMap() {
    var projection = d3.geo.mercator()
        .center([107, 38])
        .scale(0.8 * G.WIDTH)
        .translate([0.5 * G.WIDTH, 0.5 * G.MAP_H]);
    // 神秘的投影函数，没弄明白
    var path = d3.geo.path().projection(projection);

    d3.json(G.MAP_FILE, function(error, china) {
        if (error) return console.error(error);
        query('#progress-bar').classList.add('hidden');
        // 为地图区块涂上背景色
        G.svg.selectAll(".path-city")
            .data(china.features)
            .enter().append("path")
            .attr("class", "path-city")
            .attr("fill", function() {
                return G.BACKCOLOR;
            }).attr("d", path);

        //当地图数据加载完，根据选择器设定为地图区块上色
        colorMap(G.axis)
    }).on('progress', function(e) {
        if(e.responseURL.endsWith('china.json')) {
            query('#progress-bar').classList.remove('hidden');
        }
    });
}

