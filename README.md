## Summary
This visualization is all about the air quality measures for **mainland China**.
Each frame reflects all cities' measurement(AQI/PM2.5/PM10/SO2/NO2)
in a certain hour's average on a certain date.
You can adjust the date, hour, and measure type in the uppper side.
Zoom in/out or drag the map for your free,
detail information will appears on the upper-right corner
when your mouse float a certain city.

## Design
d3.js is used for the map's visualization.
Map's geographical data comes from geojson files shared on the [Internet](http://www.ourd3js.com/map/china_mapdata/mapdata.zip).
Air quality measurement data comes from [PM25.in](pm25.in), 
and necessary reshape and refine works (**refine.sh, split.py**) have done for loading convenient.

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

What do you notice in the visualization?
What questions do you have about the data?
What relationships do you notice?
What do you think is the main takeaway from this visualization?
Is there something you don’t understand in the graphic?


## Resources
https://ckhung.github.io/d3-stat-map/main.html
http://www.ourd3js.com/collection/xunmeng/GDPMap/index.html
