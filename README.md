# Trescope
## Introduction
Trescope is a comprehensive 3D machine learning development tool devoted to improve developing experience and speed in 3D field, which helps researchers and developers to label, debug, visualize various 3D data

## Key features

### Labeling
Support labeling multiple attributes of 3D data, such as enumeration attributes, pose(coming soon), point cloud segmentation(coming soon) and so on

![Labeling](readme/trescope-label-case.png)

Enumeration attributes labeling example

### Debug
Support breakpoint and 3D data visualization when you debug your program

![Debug](readme/trescope-step-debug.gif)

Step-by-step debug example

### Visualization
Support visualization of various 3D data types, such as mesh, voxel, point cloud and so on, it is worth mentioning that we also support [3D-FRONT dataset](https://tianchi.aliyun.com/specials/promotion/alibaba-3d-scene-dataset) visualization(which is a fantastic scene dataset from Alibaba)

![Visualization](readme/trescope-plot-front3d.gif)

3D-FRONT dataset visualization example

### Heterogeneous language support architecture
Support multiple development languages, and it is easy to support a new language under trescope architecture

### Online/Offline visualization
Support visualize 3D data by two way:
* Online mode(display output): you can visualize 3D data in browser with interaction(zoom, rotate...)
* Offline mode(file output): you can visualize 3D data to file, in this way, you can check plenty of 3D data quickly

## Build

When first build, you need to use `npm install` to install dependencies:
```
cd TrescopeServer/third/plotly.js
npm install
cd TrescopeServer/universal/scene-json-renderer
npm install
cd TrescopeServer/frontend
npm install
cd TrescopeServer/backend
npm install
cd TrescopeServer/backend/node_modules/gl
HOME=~/.electron-gyp node-gyp rebuild --target=8.2.0 --arch=x64 --dist-url=https://electronjs.org/headers
```
Once the step above finishes, just `package`
```
./package
```

## Install
* Installing from source code: after build, the python archive will under directory `Trescope4Python/library/dist`
* Installing by `pip install` directly: it is comming soon!

## Communication
If you have any suggestion or issue, you can contact with us by Dingtalk or issue at github directly, scan the QR code below to enter Dingtalk group:
![Dintalk group0](readme/dingtalk-group0.jpg)

## License
MIT

## Thanks

Trescope uses a number of open source projects to work properly:

* [Plotly.js](https://github.com/plotly/plotly.js/)
* [Electron](https://github.com/electron/electron)
