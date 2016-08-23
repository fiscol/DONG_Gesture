# DONG API Document

## api.js
**api/iOS/Raw**
`POST`

PURPOSE:  
 - Calculate with input g-sensor values, retrieve Rate and ActionCode output.  
 - Save Data to DONGCloud/MotionData  
 - Refresh monitor page when *Rate >= 0.5*  
 - Call DongSlide and DongMotion when *Rate >= 0.5* and *ActionCode == 19*  

INPUT Parameters:

    {
      "UID": "70Hfhlb3P9VFEIeIozSqfoFy3eA2",
      "AX": "[0.2, 0.16, -0.12]",
      "AY": "[0.2, 0.16, -0.12]",
      "AZ": "[0.2, 0.16, -0.12]"
    }

OUTPUT Data:

    {
      "Rate": 0.5476190476190477,
      "ActionCode": 19
    }

**api/iOS/Minder**
`POST`

PURPOSE:  
 - Calculate with input one-dimentional processed Minder values, retrieve Rate and ActionCode output.  
 - Save Data to DONGCloud/MotionData  
 - Refresh monitor page when *Rate >= 0.5*  
 - Call DongSlide and DongMotion when *Rate >= 0.5* and *ActionCode == 19*   

INPUT Parameters:

    {
      "UID":"70Hfhlb3P9VFEIeIozSqfoFy3eA2",
      "Code":"[2,2,4,5,3,3,7]"
    }

OUTPUT Data:

    {
      "Rate": 0.5476190476190477,
      "ActionCode": 19
    }

**api/getMotionUrl**
`POST`

PURPOSE:  
 - Use UID as input, return daily refreshed random motion URL.  

INPUT Parameters:

    {
      "UID": "70Hfhlb3P9VFEIeIozSqfoFy3eA2"
    }

OUTPUT Data:

    {
      "URL": "6sk6tco"
    }

**api/Raw/:motionurl**
`POST`

PURPOSE:  
 - Calculate with input g-sensor values, retrieve Rate and ActionCode output.  
 - Save Data to DONGCloud/MotionData  
 - If motionurl wasn't fit, returns error message without cloud computing.

INPUT Parameters:

    {
      "UID": "70Hfhlb3P9VFEIeIozSqfoFy3eA2",
      "AX": "[0.2, 0.16, -0.12]",
      "AY": "[0.2, 0.16, -0.12]",
      "AZ": "[0.2, 0.16, -0.12]"
    }

OUTPUT Data:

    {
      "Rate": 0.5476190476190477,
      "ActionCode": 19
    }

**api/Minder/:motionurl**
`POST`

PURPOSE:  
 - Calculate with input one-dimentional processed Minder values, retrieve Rate and ActionCode output.  
 - Save Data to DONGCloud/MotionData  
 - If motionurl wasn't fit, returns error message without cloud computing.

INPUT Parameters:

    {
      "UID":"70Hfhlb3P9VFEIeIozSqfoFy3eA2",
      "Code":"[2,2,4,5,3,3,7]"
    }

OUTPUT Data:

    {
      "Rate": 0.5476190476190477,
      "ActionCode": 19
    }

***

## users.js
**users/register**
`POST`

PURPOSE:  
 - Save UserData to DONGCloud/DongService  

INPUT Parameters:

    {
      "UID":"70Hfhlb3P9VFEIeIozSqfoFy3eA2",
      "Email":"david1@gmail.com",
      "UserName":"David"
    }

OUTPUT Data:

    {
      "Message": "您已註冊成功"
    }

**users/register_trial**
`POST`

PURPOSE:  
 - Save random created UserData to DONGCloud/DongService/Trial  
 - Trial Users have 20 free trial computing limit.  

INPUT Parameters:

    {
      "UID":"randomUID"
    }

OUTPUT Data:

    {
      "Message": "新增試用帳號成功"
    }
  

**users/login**
`POST`

PURPOSE:  
 - Change DONGCloud/DongService/UserName/Status to "On".  

INPUT Parameters:

    {
      "UID":"70Hfhlb3P9VFEIeIozSqfoFy3eA2"
    }

OUTPUT Data:

    {
      "Message": "登入成功"
    }
  
**users/logout**
`POST`

PURPOSE:  
 - Change DONGCloud/DongService/UserName/Status to "Off".  

INPUT Parameters:

    {
      "UID":"70Hfhlb3P9VFEIeIozSqfoFy3eA2"
    }

OUTPUT Data:

    {
      "Message": "已登出"
    }

***

## devapi.js
**devapi/:devcode/LCS**
`POST`

PURPOSE:  
 - devcode == "pvdplus" (temporarily as default)  
 - Compare a pair of MinderData.  
 - Returns Rate and TraceBack.

INPUT Parameters:

    {
      "input1":"[4, 2, 4, 6, 3, 3, 1, 4, 4, 6]",
      "input2":"[1, 4, 4, 6, 3, 2, 2, 5, 3, 2]"
    }

OUTPUT Data:

    {
      "Rate": 0.5,
      "TraceBack": "[4,4,6,3,3]"
    }
