# 大作业2  Report

- 队长：马彪

  - 邮箱：ma-b21@mails.tsinghua.edu.cn
  
- 队员：刘淞熙
  - 邮箱：liusx21@mails.tsinghua.edu.cn
  
- 队员：杨楠
  - 邮箱：yangn21@mails.tsinghua.edu.cn
  
- 队员：许多坤
  - 邮箱：xdk21@mails.tsinghua.edu.cn

## 实现思路

对于整个大作业我们组将工作分为了五个模块，分别是绘制时钟、时钟功能的实现、秒表功能的实现、计时器功能的实现以及闹钟功能的实现。基本思路就是在绘制的时钟的基础上根据不同功能的需要去对时钟进行相应的设置来实现最终的效果。

其中马彪负责绘制时钟以及时钟功能的实现，刘淞熙负责秒表功能的实现，杨楠负责计时器功能的实现，许多坤负责闹钟功能的实现。

## 使用说明

### 代码结构

```powershell
root
 │  report.pdf
 │  
 └─src
     │  .gitignore
     │  index.html
     │  
     ├─audio
     │      alarm1.mp3
     │      alarm2.mp3
     │      alarm3.mp3
     │      
     ├─css
     │      clock.css
     │      
     ├─images
     │      background.png
     │      icon.png
     │      reset.png
     │      start.png
     │      stop.png
     │      
     └─js
             clock.js
```

### 使用方法

首先要保证代码目录结构如上，然后在`Chrome`浏览器中打开`index.html`文件，页面如下：

#### 时钟功能

默认会获取当前系统时间，要更改时间需要先点击"设置时间"按钮，接着会支持两种方式来进行时间设置：

- 拖动表盘上的指针，需要设置`AM`和`PM`时点击表盘上的"AM"或"PM"字样即可切换。

- 在时间输入框中设置


需要注意的是时间输入框和拖动表盘同时设置时会以输入框内时间为准。

#### 秒表功能

点击"秒表"按钮进入秒表功能页面

此时表盘右侧会出现两个按钮，分别为归零按钮和开始按钮，点击开始按钮开始计时，此时开始按钮会变为暂停按钮。

#### 计时器功能

点击"计时器"按钮进入计时器页面

点击时间选择框来设置倒计时时间，点击开始进行倒计时，结束之后会弹窗提示并有响铃：

#### 闹钟功能

点击"闹钟"按钮进入闹钟页面

点击"添加闹钟"弹出闹钟设置页面

默认有闹铃，也可以选择文件自定义闹铃，同样通过时间输入框设置闹铃时间

时间到之后会有提示并有铃声

## 遇到问题及解决办法

### 时钟模块

1. 在实现鼠标拖动指针的响应事件时，经常出现拖动两次指针之后时间进度加速的情况。 最终定位到问题出在释放鼠标的事件函数，在指针上的释放函数和在表盘上的释放函数都会设置一个时钟继续进行的定时器，时钟因此会同时执行两个定时器，时间进度就会加快。解决办法是在鼠标释放函数中阻止事件冒泡即可。
2. 在切换到其他功能后回到时钟功能时原实现会重新读取系统时间，与闹钟实现相冲突，因此重新设计让时钟在切换到其他页面之后后台运行时钟，切换回来时的时钟就会按照原时间进度运行。

### 秒表模块

1. 本来有四个按钮，感觉不够精简，于是通过精简只有重置和在`start`和`stop`之间转换的按钮。

2. 在秒表运行中切换`reset`后，`start`/`stop`按钮显示会不做任何变换，即功能会和图标不对应，在添加判断是否运行的变量后，通过查询该变量的值，解决问题。

### 计时器模块

1. 如何让时钟倒着走。
   类似于关键帧rotate，设计关键帧rotateReverse，将rotate中旋转的角度改为负值。类似于类`playSecond`，`playMinute`，`playHour`，添加类`playSecondReverse`，`playMinuteReverse`，`playHourReverse`，将其中动画的`rotate`改为`rotateReverse`。类似于函数`start_animation()`和`stop_animation()`，设计函数`start_animation_reverse()`和`stop_animation_reverse()`。
2. 如何让计时器在暂停后，点击“开始”能接着计时。
   点击暂停的时候，要`clearInterval()`，`stop_animation_reverse()`，还要更新表盘时间和指针的起始位置，以便下次“开始”的时候，直接从当前位置接着计时。

### 闹钟模块

1. 如何实现某个模块的隐藏：使用`setAttribute()`修改`display`属性或使用`classList.add()`增加类，设置`display：none`。
2. 如何实现函数每秒执行一次且可以取消：使用`setInterval`，且使用`interValid = setInterval()`的形式保存id，用`clearInterval(interValid)`来取消。
3. 如何从`input[type = "file"]`中获取文件名称：使用`${file.name}`的方法获取文件名称。

## 参考链接

- [input type=file 获取选择文件名称、路径方法及input上传按钮美化](https://blog.csdn.net/m0_47901007/article/details/121995985)
- [Web 开发技术 | MDN](https://developer.mozilla.org/zh-CN/docs/Web)
- [现代 JavaScript 教程](https://zh.javascript.info/)
- [关于CSS3旋转属性rotate,在js点击事件中只触发一次的问题](https://blog.csdn.net/Leven_E/article/details/80526327)
- [鼠标事件](https://blog.csdn.net/JEFF_luyiduan/article/details/102231358)
- [SVG渲染顺序及z轴显示问题(zIndex)](https://www.cnblogs.com/tianma3798/p/7383486.html)
- [巧妙利用label标签实现input file上传文件自定义样式](https://www.cnblogs.com/tu-0718/p/11890557.html)
- [SVG 阴影](https://www.cainiaojc.com/svg/svg-drop-shadow-effect.html)
- [w3school 在线教程](https://www.w3school.com.cn/)
- [HTML5 - 使用JavaScript控制<audio>音频的播放](https://www.hangge.com/blog/cache/detail_897.html)
- [html中怎么设置点按钮一下开第二下停止,按钮内的 HTML href（如 chrome 标签） 1 个按钮中有 2 个不同的点击功能...](https://blog.csdn.net/weixin_33585152/article/details/118288125)
- [html - 如何通过单击按钮来改变按钮的图像](https://www.coder.work/article/3437100)

