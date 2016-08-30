# DONG Cloud 

## Nodejs server

**2016/07/20**
 - upload project.  
**2016/07/22**  
 - 前端測試與後端街口完成(架構尚未調整)  
 - Test git boundle Slack(Mark)  
**2016/07/27**  
 - 更新一版改寫swift motion code, 加入初版Markdown API說明*_(Fiscol)_*  
 - 測試slack同步訊息(source tree push)  
 - 建立api router(routes/api.js)(BigQ)  
 - 建立數據管理雛形(adim.ejs)(BigQ)  
**2016/07/28**  
 - 將socket.io導入routes、動態數據管理頁面資料更新(BigQ)  
**2016/08/03**  
 - RealTimeData與DBData異步功能完成(BigQ)  
 - 先更新一版可運算Score，暫時寫死的Minder API*_(Fiscol)_* 
 - 整合Minder至API中進行測試(BigQ)  
 - 發指令到DONG Slide與DONG Motion(BigQ)    
**2016/08/05**
 - 將iOS端input(SDKRawCode)從字串改成陣列   
 - 增加辨識門檻觸發DONG Motion  
**2016/08/09**  
 - 開了一組簡易的登入API, 用Promise的方法做回傳*_(Fiscol)_*  
**2016/08/11**  
 - 加入Server端的第一版註冊/登入/登出API*_(Fiscol)_*  
**2016/08/15**  
 - 串接api/iOS內的兩隻API, 到可接收兩種種類的RawCode*_(Fiscol)_*  
**2016/08/17**  
 - 增加 libraries/tool 歸納無家可歸小工具(DONG_Calaulate.js)，並修改相依路徑。*_(BigQ)_*  
**2016/08/18**  
 - 調整 將部分共用函式，移至libraries底下檔案。*_(Fiscol)_*  
 - 更新一版資料夾分層架構在Readme.md*_(Fiscol)_*  
**2016/08/19**  
 - 加入每日定時更新與用戶端查詢MotionURL的API*_(Fiscol)_*  
**2016/08/21**  
 - 加入APIDoc.md，說明目前的API傳入/輸出與呼叫的URL*_(Fiscol)_*  
**2016/08/22**  
 - 調整一版專案架構，修復Server端Rate運算的BUG*_(Fiscol)_*  
**2016/08/23**  
 - 修正TraceBack重複加入的BUG，加入devapi供內部測試使用*_(Fiscol)_*  
 - 將Pattern來源搬到DB測試*_(Fiscol)_*  
 **2016/08/29**  
 - 增加拳擊Demo(/demo-boxing)，修改routes/index.js，增加views/demo/demo-boxing.ejs, public/demo/demo-boxing *_(BigQ)_*  
 


# DONG Cloud Document
## 命名規範 V1.0 (20160722)
*全域變數(小寫 + 大寫)* 

    var firstUser = "John";
    var cookieParser = require('cookie-parser');

*函式內部變數(大寫 + 大寫)*

    var UserName = "Cathy";

*自定義函式傳入參數(底線 + 大寫 + 大寫)*

    function(req, res, _ChildName){};

*函式名稱(底線 + 小寫 + 大寫)*

    exports._setUserData = function(path, _ChildName ,value, error){};



## 專案分層與檔案說明 (20160823更新)

 - 使用Express專案架構
 - README.md (專案說明檔)
 - documents
 	 - APIDoc.md (API說明檔)
 - 後端Controller(只負責路徑 + 定義I/O，由Service層處理運算)：
 - routes
	 - api.js (以MotionData觸發服務API)
	 - devapi.js (內部測試用API)
	 - index.js (監控頁面相關API)
	 - users.js (使用者相關，註冊，登入相關API)
 - 後端Service(商業邏輯，依功能區分子資料夾)：
 - services
	 - api(內部開發測試相關)
		 - demo.js (觸發其他Demo相關的Dong Services)
		 - train.js (機器學習使用，目前還沒開始使用)
		 - unit.js (呼叫MotionData解算，儲存回DB)
	 - unit(單元運算)
	 	 - kernal(動作核心演算)
		   - accefilter.js (G-Sensor Filter)
		   - lcslength.js (運算Score，TraceBack)
		   - minderbeta.js (將一維陣列運算為Rate，ActionCode)
		   - processbeta.js (解算三維RawData為一維陣列)
		 - train(機器學習)
		   - ann.js (目前未使用)
		   - pca.js (目前未使用)
		   - pnn.js (目前未使用)
		   - svm.js (目前未使用)
	 - users(使用者相關)
	 	 - users.js (註冊，登入相關處理函式)
 - 後端函式庫(包含Firebase，內部共用函式)：
 - libraries
 	 - tool (內部共用函式)
	  	 - crypt.js (加解密相關函式)
	  	 - dongservices.js (按鍵精靈，投影片切換等DEMO介接函式)
		 - gettime.js (取得日期時間相關函式)
		 - postdata.js (組MotionData相關輸出物件)
		 - string.js (處理字串相關類型函式)
	 - DONG-TEST-e4e5735fa7bb.json (Firebase相關設定)
	 - firebase_db.js (Firebase CRUD相關函式)

> Project Source : [Link](https://bitbucket.org/pvdplus_tech/dongserverfmq)  
> Monitor Page : [Link](https://dongcloud.herokuapp.com)  
> Heroku App : [Link](https://dashboard.heroku.com/apps/dongcloud)  