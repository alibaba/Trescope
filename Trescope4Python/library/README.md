# Trescope 

Guide as below:
> Install
``` bash
$ pip3 install git+ssh://git@gitlab.alibaba-inc.com/iHome-3dv/Trescope-Python-Release.git@0.0.1#egg=trescope
```
> Launch backend when installed
``` bash
$ trescope
```
> Import trescope and coding
``` python
from trescope import Trescope , LayoutManager , Layout
from trescope.config import Scatter3DConfig , ImageConfig
(Trescope().initialize(
	True , 'your/temp/trescope/file/dir' , 
	LayoutManager()
		.divide(1 , 2)
		.toRegions(
			Layout().index(0).title('scatterPlot').startAt(0, 0).withSpan(1, 1),
			Layout().index(1).title('imagePlot').startAt(0, 1).withSpan(1, 1))))
(Trescope()
	.selectRegion(0)
	.plotScatter3D([1 , 2 , 3] , [2 , 4 , 6] , [7 , 8 , 9])
	.withConfig(Scatter3DConfig().name('scatter1').color(0xffff0000).size(5)))
Trescope().breakPoint('plotScatter3D')
(Trescope()
	.selectRegion(1)
	.plotImage('/some/dir/constains/image.png')
	.withConfig(ImageConfig().scale(.5)))
Trescope().breakPoint('plotImage')
print('finish')
```
> Then you will see something as below in your browser at http://localhost:8080/

![trescope](http://gw.alicdn.com/mt/LB1Z4CYfAY2gK0jSZFgXXc5OFXa-3330-1820.png)