## Summary
This visualization is all about the air quality measures for **mainland China**.
Each frame reflects all cities' measurement(AQI/PM2.5/PM10/SO2/NO2)
in a certain hour's average on a certain date.
You can adjust the date, hour, and measure type in the uppper side.
Zoom in/out or drag the map for your free,
detail information will appears on the upper-right corner
when your mouse float a certain city.

本作品记录中国大陆地区空气质量数据。
每幅图反映某日某时全国各地的污染物指标（包括AQI，PM2.5，PM10，二氧化硫，二氧化氮）。
通过调整上方的日期，时间，指标类型的各项选择器，您能得到不同的图示。
您还可以放大／缩小或者拖拽地图。
当鼠标悬置于某地区时，于右上角将显示此地区污染物指标具体值。

## Design
d3.js is used for the map's visualization.
Map's geographical data comes from geojson files shared on the [Internet](http://www.ourd3js.com/map/china_mapdata/mapdata.zip).
Air quality measurement data comes from [PM25.in](http://pm25.in), 
and necessary reshape and refine works (**refine.sh, split.py**) have done for loading convenient.

地图数据和空气质量数据皆来源于网络，但在本项目实施前进行了必要的筛选和变形。

json zip files:
[Google Drive]()
[Baidu Yunpan](https://pan.baidu.com/s/1c1SdK7A)



Tools used for wrangling:

- sed (text filter)
- python pandas (split csv by hour)
- csvjson (csv to json by key)
- perl (text filter)
- jq (compress json)

After **refine.sh**,
each json file in `json/` is for each hour's record.

## Feedback
- 可以考虑只提供一年份的数据
- 日期的设置也可以考虑设置成滑块
- 除了展示数据以为最好提供一些统计结论


## Resources
- https://ckhung.github.io/d3-stat-map/main.html
- http://www.ourd3js.com/collection/xunmeng/GDPMap/index.html
