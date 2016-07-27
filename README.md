
DONG Cloud 

Nodejs server

2016/07/20 upload project.
2016/07/22 前端測試與後端街口完成(架構尚未調整);
2016/07/22 Test git boundle Slack(Mark)
2016/07/27 更新一版改寫swift motion code, 加入初版Markdown API說明(Fiscol)
2016/07/27 測試slack同步訊息(source tree push)

<h1>DONG Cloud Document</h1>
<h2>命名規範 V1.0 (20160722)</h2>
全域變數(小寫 + 大寫) 

    var firstUser = "John";
    var cookieParser = require('cookie-parser');

函式內部變數(大寫 + 大寫) 

    var UserName = "Cathy";

自定義函式傳入參數(底線 + 大寫 + 大寫) 

    function(req, res, _ChildName){};

函式名稱(底線 + 小寫 + 大寫) 

    exports._setUserData = function(path, _ChildName ,value, error){};



<h2>專案分層與檔案說明</h2>

 - 使用Express專案架構
 - 後端Controller：
 (只負責路徑 + 定義I/O，由Service層處理運算)
 <i class="icon-folder-open"></i>routes
	 - <i class="icon-file"></i>api.js
	 - <i class="icon-file"></i>unit.js
	 - <i class="icon-file"></i>train.js
 - 後端Service
 (商業邏輯，依功能區分子資料夾)：
 <i class="icon-folder-open"></i>services
	 - <i class="icon-folder-open"></i>api(使用者驗證)
		 - <i class="icon-file"></i>api.js
	 - <i class="icon-folder-open"></i>train(機器學習)
		 - <i class="icon-file"></i>ann.js
		 - <i class="icon-file"></i>pca.js
		 - <i class="icon-file"></i>pnn.js
		 - <i class="icon-file"></i>svm.js
	 - <i class="icon-folder-open"></i>unit(單元運算)
		 - <i class="icon-file"></i>direction.js
		 - <i class="icon-file"></i>power.js
 - 前端View(ejs)：
 <i class="icon-folder-open"></i>views資料夾
 - 外部函式庫：
 <i class="icon-folder-open"></i>libraries資料夾
  - <i class="icon-file"></i>firebase_db.js

<h2>資料流UML</h2>

```flow
st1=>start: Sensor送出動作
e1=>end: 結束操作
e2=>end: 回傳動作到Sensor
sub2=>subroutine: 解析動作 + 力道
op1=>operation: 驗證使用者權限
op2=>operation: 機器學習
cond1=>condition: 有API權限?
cond2=>condition: 須經過機器學習?

st1->op1->cond1
cond1(yes)->sub2
cond1(no)->e1
sub2(right)->e2
sub2->op2
```

> Project Source : [Link](https://bitbucket.org/pvdplus_tech/dongserverfmq)