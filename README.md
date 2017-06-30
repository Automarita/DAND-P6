## Summary
本作品记录中国大陆地区空气质量数据。
每幅图反映某日某时全国各地的污染物指标（包括AQI，PM2.5，PM10，二氧化硫，二氧化氮）。
通过调整上方的日期，时间，指标类型的各项选择器，您能得到不同的图示。
您还可以放大／缩小或者拖拽地图。
当鼠标悬置于某地区时，于右上角将显示此地区污染物指标具体值。

## Design

本项目使用 d3.js 框架及其插件完成。
中国地图的地理信息数据来自[网络分享资源](http://www.ourd3js.com/map/china_mapdata/mapdata.zip).
空气质量数据来自[PM25.in](http://pm25.in)，
获取空气质量数据后，为了适应方便的加载，使用了各种工具对数据进行了筛选，分割和变形，详见 **refine.sh, split.py**。

数据整理阶段使用的工具:

- sed (text filter)
- python pandas (split csv by hour)
- csvjson (csv to json by key)
- perl (text filter)
- jq (compress json)

经整理后，全国某日某时的数据储存在 json/ 目录下。
本可视化的策略将关键元信息表达成中国地图，并按时间和污染指标几个维度区分绘制面，
污染物指标数值则映射到颜色的变化，根据国际惯例，污染指标轻以绿色呈现，反之以暗红色呈现。

## Feedback

- 可以考虑只提供一年份的数据
- 日期的设置也可以考虑设置成滑块
- 除了展示数据以外最好提供一些统计结论

## Improvement(Revision)

旧版页面及相关程序提供在 old/ 目录之下。
根据反馈内容，将日期选择器改造成 range 滑块，并且仅保留2016年的数据。

另外，为了突出信息重点，新版页面还提供了一个简单的筛选器，
筛选某污染指标排序前 n 的地区。

从视觉协调角度考虑，将原有的 RGB 标尺替换成 HSL 标尺。


## Resources
参考项目
- https://ckhung.github.io/d3-stat-map/main.html
- http://www.ourd3js.com/collection/xunmeng/GDPMap/index.html
