import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperTextService {

  countriesList: any = [
    { "name": "Afghanistan", "code": "AF" },
    { "name": "land Islands", "code": "AX" },
    { "name": "Albania", "code": "AL" },
    { "name": "Algeria", "code": "DZ" },
    { "name": "American Samoa", "code": "AS" },
    { "name": "AndorrA", "code": "AD" },
    { "name": "Angola", "code": "AO" },
    { "name": "Anguilla", "code": "AI" },
    { "name": "Antarctica", "code": "AQ" },
    { "name": "Antigua and Barbuda", "code": "AG" },
    { "name": "Argentina", "code": "AR" },
    { "name": "Armenia", "code": "AM" },
    { "name": "Aruba", "code": "AW" },
    { "name": "Australia", "code": "AU" },
    { "name": "Austria", "code": "AT" },
    { "name": "Azerbaijan", "code": "AZ" },
    { "name": "Bahamas", "code": "BS" },
    { "name": "Bahrain", "code": "BH" },
    { "name": "Bangladesh", "code": "BD" },
    { "name": "Barbados", "code": "BB" },
    { "name": "Belarus", "code": "BY" },
    { "name": "Belgium", "code": "BE" },
    { "name": "Belize", "code": "BZ" },
    { "name": "Benin", "code": "BJ" },
    { "name": "Bermuda", "code": "BM" },
    { "name": "Bhutan", "code": "BT" },
    { "name": "Bolivia", "code": "BO" },
    { "name": "Bosnia and Herzegovina", "code": "BA" },
    { "name": "Botswana", "code": "BW" },
    { "name": "Bouvet Island", "code": "BV" },
    { "name": "Brazil", "code": "BR" },
    { "name": "British Indian Ocean Territory", "code": "IO" },
    { "name": "Brunei Darussalam", "code": "BN" },
    { "name": "Bulgaria", "code": "BG" },
    { "name": "Burkina Faso", "code": "BF" },
    { "name": "Burundi", "code": "BI" },
    { "name": "Cambodia", "code": "KH" },
    { "name": "Cameroon", "code": "CM" },
    { "name": "Canada", "code": "CA" },
    { "name": "Cape Verde", "code": "CV" },
    { "name": "Cayman Islands", "code": "KY" },
    { "name": "Central African Republic", "code": "CF" },
    { "name": "Chad", "code": "TD" },
    { "name": "Chile", "code": "CL" },
    { "name": "China", "code": "CN" },
    { "name": "Christmas Island", "code": "CX" },
    { "name": "Cocos (Keeling) Islands", "code": "CC" },
    { "name": "Colombia", "code": "CO" },
    { "name": "Comoros", "code": "KM" },
    { "name": "Congo", "code": "CG" },
    { "name": "Congo, The Democratic Republic of the", "code": "CD" },
    { "name": "Cook Islands", "code": "CK" },
    { "name": "Costa Rica", "code": "CR" },
    { "name": `"Cote D"Ivoire"`, "code": "CI" },
    { "name": "Croatia", "code": "HR" },
    { "name": "Cuba", "code": "CU" },
    { "name": "Cyprus", "code": "CY" },
    { "name": "Czech Republic", "code": "CZ" },
    { "name": "Denmark", "code": "DK" },
    { "name": "Djibouti", "code": "DJ" },
    { "name": "Dominica", "code": "DM" },
    { "name": "Dominican Republic", "code": "DO" },
    { "name": "Ecuador", "code": "EC" },
    { "name": "Egypt", "code": "EG" },
    { "name": "El Salvador", "code": "SV" },
    { "name": "Equatorial Guinea", "code": "GQ" },
    { "name": "Eritrea", "code": "ER" },
    { "name": "Estonia", "code": "EE" },
    { "name": "Ethiopia", "code": "ET" },
    { "name": "Falkland Islands (Malvinas)", "code": "FK" },
    { "name": "Faroe Islands", "code": "FO" },
    { "name": "Fiji", "code": "FJ" },
    { "name": "Finland", "code": "FI" },
    { "name": "France", "code": "FR" },
    { "name": "French Guiana", "code": "GF" },
    { "name": "French Polynesia", "code": "PF" },
    { "name": "French Southern Territories", "code": "TF" },
    { "name": "Gabon", "code": "GA" },
    { "name": "Gambia", "code": "GM" },
    { "name": "Georgia", "code": "GE" },
    { "name": "Germany", "code": "DE" },
    { "name": "Ghana", "code": "GH" },
    { "name": "Gibraltar", "code": "GI" },
    { "name": "Greece", "code": "GR" },
    { "name": "Greenland", "code": "GL" },
    { "name": "Grenada", "code": "GD" },
    { "name": "Guadeloupe", "code": "GP" },
    { "name": "Guam", "code": "GU" },
    { "name": "Guatemala", "code": "GT" },
    { "name": "Guernsey", "code": "GG" },
    { "name": "Guinea", "code": "GN" },
    { "name": "Guinea-Bissau", "code": "GW" },
    { "name": "Guyana", "code": "GY" },
    { "name": "Haiti", "code": "HT" },
    { "name": "Heard Island and Mcdonald Islands", "code": "HM" },
    { "name": "Holy See (Vatican City State)", "code": "VA" },
    { "name": "Honduras", "code": "HN" },
    { "name": "Hong Kong", "code": "HK" },
    { "name": "Hungary", "code": "HU" },
    { "name": "Iceland", "code": "IS" },
    { "name": "India", "code": "IN" },
    { "name": "Indonesia", "code": "ID" },
    { "name": "Iran, Islamic Republic Of", "code": "IR" },
    { "name": "Iraq", "code": "IQ" },
    { "name": "Ireland", "code": "IE" },
    { "name": "Isle of Man", "code": "IM" },
    { "name": "Israel", "code": "IL" },
    { "name": "Italy", "code": "IT" },
    { "name": "Jamaica", "code": "JM" },
    { "name": "Japan", "code": "JP" },
    { "name": "Jersey", "code": "JE" },
    { "name": "Jordan", "code": "JO" },
    { "name": "Kazakhstan", "code": "KZ" },
    { "name": "Kenya", "code": "KE" },
    { "name": "Kiribati", "code": "KI" },
    { "name": `"Korea, Democratic People"S Republic of"`, "code": "KP" },
    { "name": "Korea, Republic of", "code": "KR" },
    { "name": "Kuwait", "code": "KW" },
    { "name": "Kyrgyzstan", "code": "KG" },
    { "name": `"Lao People"S Democratic Republic"`, "code": "LA" },
    { "name": "Latvia", "code": "LV" },
    { "name": "Lebanon", "code": "LB" },
    { "name": "Lesotho", "code": "LS" },
    { "name": "Liberia", "code": "LR" },
    { "name": "Libyan Arab Jamahiriya", "code": "LY" },
    { "name": "Liechtenstein", "code": "LI" },
    { "name": "Lithuania", "code": "LT" },
    { "name": "Luxembourg", "code": "LU" },
    { "name": "Macao", "code": "MO" },
    { "name": "Macedonia, The Former Yugoslav Republic of", "code": "MK" },
    { "name": "Madagascar", "code": "MG" },
    { "name": "Malawi", "code": "MW" },
    { "name": "Malaysia", "code": "MY" },
    { "name": "Maldives", "code": "MV" },
    { "name": "Mali", "code": "ML" },
    { "name": "Malta", "code": "MT" },
    { "name": "Marshall Islands", "code": "MH" },
    { "name": "Martinique", "code": "MQ" },
    { "name": "Mauritania", "code": "MR" },
    { "name": "Mauritius", "code": "MU" },
    { "name": "Mayotte", "code": "YT" },
    { "name": "Mexico", "code": "MX" },
    { "name": "Micronesia, Federated States of", "code": "FM" },
    { "name": "Moldova, Republic of", "code": "MD" },
    { "name": "Monaco", "code": "MC" },
    { "name": "Mongolia", "code": "MN" },
    { "name": "Montenegro", "code": "ME" },
    { "name": "Montserrat", "code": "MS" },
    { "name": "Morocco", "code": "MA" },
    { "name": "Mozambique", "code": "MZ" },
    { "name": "Myanmar", "code": "MM" },
    { "name": "Namibia", "code": "NA" },
    { "name": "Nauru", "code": "NR" },
    { "name": "Nepal", "code": "NP" },
    { "name": "Netherlands", "code": "NL" },
    { "name": "Netherlands Antilles", "code": "AN" },
    { "name": "New Caledonia", "code": "NC" },
    { "name": "New Zealand", "code": "NZ" },
    { "name": "Nicaragua", "code": "NI" },
    { "name": "Niger", "code": "NE" },
    { "name": "Nigeria", "code": "NG" },
    { "name": "Niue", "code": "NU" },
    { "name": "Norfolk Island", "code": "NF" },
    { "name": "Northern Mariana Islands", "code": "MP" },
    { "name": "Norway", "code": "NO" },
    { "name": "Oman", "code": "OM" },
    { "name": "Pakistan", "code": "PK" },
    { "name": "Palau", "code": "PW" },
    { "name": "Palestinian Territory, Occupied", "code": "PS" },
    { "name": "Panama", "code": "PA" },
    { "name": "Papua New Guinea", "code": "PG" },
    { "name": "Paraguay", "code": "PY" },
    { "name": "Peru", "code": "PE" },
    { "name": "Philippines", "code": "PH" },
    { "name": "Pitcairn", "code": "PN" },
    { "name": "Poland", "code": "PL" },
    { "name": "Portugal", "code": "PT" },
    { "name": "Puerto Rico", "code": "PR" },
    { "name": "Qatar", "code": "QA" },
    { "name": "Reunion", "code": "RE" },
    { "name": "Romania", "code": "RO" },
    { "name": "Russian Federation", "code": "RU" },
    { "name": "RWANDA", "code": "RW" },
    { "name": "Saint Helena", "code": "SH" },
    { "name": "Saint Kitts and Nevis", "code": "KN" },
    { "name": "Saint Lucia", "code": "LC" },
    { "name": "Saint Pierre and Miquelon", "code": "PM" },
    { "name": "Saint Vincent and the Grenadines", "code": "VC" },
    { "name": "Samoa", "code": "WS" },
    { "name": "San Marino", "code": "SM" },
    { "name": "Sao Tome and Principe", "code": "ST" },
    { "name": "Saudi Arabia", "code": "SA" },
    { "name": "Senegal", "code": "SN" },
    { "name": "Serbia", "code": "RS" },
    { "name": "Seychelles", "code": "SC" },
    { "name": "Sierra Leone", "code": "SL" },
    { "name": "Singapore", "code": "SG" },
    { "name": "Slovakia", "code": "SK" },
    { "name": "Slovenia", "code": "SI" },
    { "name": "Solomon Islands", "code": "SB" },
    { "name": "Somalia", "code": "SO" },
    { "name": "South Africa", "code": "ZA" },
    { "name": "South Georgia and the South Sandwich Islands", "code": "GS" },
    { "name": "Spain", "code": "ES" },
    { "name": "Sri Lanka", "code": "LK" },
    { "name": "Sudan", "code": "SD" },
    { "name": "Suriname", "code": "SR" },
    { "name": "Svalbard and Jan Mayen", "code": "SJ" },
    { "name": "Swaziland", "code": "SZ" },
    { "name": "Sweden", "code": "SE" },
    { "name": "Switzerland", "code": "CH" },
    { "name": "Syrian Arab Republic", "code": "SY" },
    { "name": "Taiwan, Province of China", "code": "TW" },
    { "name": "Tajikistan", "code": "TJ" },
    { "name": "Tanzania, United Republic of", "code": "TZ" },
    { "name": "Thailand", "code": "TH" },
    { "name": "Timor-Leste", "code": "TL" },
    { "name": "Togo", "code": "TG" },
    { "name": "Tokelau", "code": "TK" },
    { "name": "Tonga", "code": "TO" },
    { "name": "Trinidad and Tobago", "code": "TT" },
    { "name": "Tunisia", "code": "TN" },
    { "name": "Turkey", "code": "TR" },
    { "name": "Turkmenistan", "code": "TM" },
    { "name": "Turks and Caicos Islands", "code": "TC" },
    { "name": "Tuvalu", "code": "TV" },
    { "name": "Uganda", "code": "UG" },
    { "name": "Ukraine", "code": "UA" },
    { "name": "United Arab Emirates", "code": "AE" },
    { "name": "United Kingdom", "code": "GB" },
    { "name": "United States", "code": "US" },
    { "name": "United States Minor Outlying Islands", "code": "UM" },
    { "name": "Uruguay", "code": "UY" },
    { "name": "Uzbekistan", "code": "UZ" },
    { "name": "Vanuatu", "code": "VU" },
    { "name": "Venezuela", "code": "VE" },
    { "name": "Viet Nam", "code": "VN" },
    { "name": "Virgin Islands, British", "code": "VG" },
    { "name": "Virgin Islands, U.S.", "code": "VI" },
    { "name": "Wallis and Futuna", "code": "WF" },
    { "name": "Western Sahara", "code": "EH" },
    { "name": "Yemen", "code": "YE" },
    { "name": "Zambia", "code": "ZM" },
    { "name": "Zimbabwe", "code": "ZW" }
  ]

  fbsdkCode = `
  var outerFlag = true;

  function login(){

  var userId = "";
  var accessToken = "";

  window.fbAsyncInit = function () {
    outerFlag=false;

      FB.init({
          appId: '2915126152079198',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v10.0'
      });
      

      FB.getLoginStatus(function (response) {
          if(response.authResponse){
            // console.log(response);
            userId = response.authResponse.userID;
            accessToken = response.authResponse.accessToken;
            console.log("userId: "+userId)
            console.log("accessToken: "+accessToken)
            var x = document.getElementById("fb-button-custom");
            localStorage.setItem("fb-user-accessToken",accessToken);
            localStorage.setItem("fb-user-id",userId);  
            document.getElementById('hidden-button-click').click();
            x.style.display = "none";
            allPermissionsGranted();
          }else{
            var x = document.getElementById("fb-button-custom");
            x.style.display = "block";
            localStorage.setItem("fb-user-accessToken",null)
            document.getElementById("fb-button-custom").onclick = function(){
              FB.login(function (response) {
                console.log(response);
                localStorage.setItem("fb-user-accessToken",response.authResponse.accessToken);
                localStorage.setItem("fb-user-id",response.authResponse.userID); 
                location.reload(); 
            }, {
                scope: ['public_profile', 'email', 'pages_messaging', 'pages_messaging_subscriptions', 
                'pages_manage_metadata']
            });
            };


          }

      });

  };
 
  if(outerFlag){
    document.getElementById('hidden-button-click').click();

  }
}

  login();





function allPermissionsGranted(){
  var permissions = ['public_profile', 'email', 'pages_messaging', 'pages_messaging_subscriptions', 
  'pages_manage_metadata']
  var flag=false;
  var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      const permissionsGranted = JSON.parse(xhttp.responseText)
       // Typical action to be performed when the document is ready:
       for (var i=0; i < permissionsGranted.data.length; i++) {

        for(var k=0;k<permissions.length;k++){
         
          if(permissions[k]==(permissionsGranted.data[k].permission)){
            // console.log(permissionsGranted.data[i].permission)
            flag=false;
            break;
          }else{
            flag=true;
          }
        }

        if(flag){
          FB.login(function (response) {
            console.log(response);
            localStorage.setItem("fb-user-accessToken",response.authResponse.accessToken);
            localStorage.setItem("fb-user-id",response.authResponse.userID);
            location.reload(); 
            
        }, {
            scope: ['public_profile', 'email', 'pages_messaging', 'pages_messaging_subscriptions', 
            'pages_manage_metadata']
        });
        break;
        }


    }
    }
};
xhttp.open("GET", "https://graph.facebook.com/${localStorage.getItem('fb-user-id')}/permissions?access_token=${localStorage.getItem('fb-user-accessToken')}",true);
xhttp.send();
}
    `

  public contactNo:any=localStorage.getItem('phoneNumber');
  public domain:any=localStorage.getItem('store-domain');

  /**
   * Data related to vertices
   * such as dataVariables
   */
  verticesData: any = [{"type":"TEXT_MESSAGE","vertexId":"2","buttons":[],"dataVariables":[{"id":0,"dataVariable":"uName","path":"","optional":""}]},{"type":"MENU_MESSAGE","buttons":[{"btnTitle":"About Bon Appétit","btnValue":"1"},{"btnTitle":"Order Now","btnValue":"2"},{"btnTitle":"Contact Us","btnValue":"3"}],"vertexId":"5","dataVariables":[{"id":1,"dataVariable":"uName","path":"","optional":""}]},{"type":"IMMEDIATE_TEXT_MESSAGE","vertexId":"15","buttons":[],"dataVariables":[{"id":2,"dataVariable":"","path":"","optional":""}]},{"type":"HANDOVER","vertexId":"19","buttons":[],"dataVariables":[{"id":3,"dataVariable":"","path":"","optional":""}]},{"type":"TEXT_MESSAGE","vertexId":"25","buttons":[],"dataVariables":[{"id":4,"dataVariable":"complain","path":"","optional":""}]},{"type":"IMMEDIATE_TEXT_MESSAGE","vertexId":"29","buttons":[],"dataVariables":[{"id":5,"dataVariable":"","path":"","optional":""}]},{"type":"IMMEDIATE_TEXT_MESSAGE","vertexId":"34","buttons":[],"dataVariables":[{"id":6,"dataVariable":"","path":"","optional":""}]}]



  defaultJson: any = {
    "mxGraphModel":{"root":{"mxCell":[{"@id":"0"},{"@id":"1","@parent":"0"},{"@id":"22","@parent":"1","@source":"16","@target":"21","@edge":"1","mxGeometry":{"@relative":"1","@as":"geometry"}},{"@id":"24","@parent":"1","@source":"6","@target":"7","@edge":"1","mxGeometry":{"@relative":"1","@as":"geometry"}},{"@id":"39","@parent":"1","@source":"14","@target":"17","@edge":"1","mxGeometry":{"@relative":"1","@as":"geometry"}},{"@id":"40","@parent":"1","@source":"12","@target":"36","@edge":"1","mxGeometry":{"@relative":"1","@as":"geometry"}},{"@id":"41","@parent":"1","@source":"10","@target":"31","@edge":"1","mxGeometry":{"@relative":"1","@as":"geometry"}}],"UserObject":[{"@id":"5","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@parent":"1","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"190","@y":"-310","@width":"300","@height":"310","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow1","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","div":[{"@id":"card-header1","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"assets/messenger.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header1","@class":"header","#text":"Main Menu"}}},{"@id":"card-body1","@class":"card-body flow-start-trigger-list","@style":"height: 228px;","span":{"@id":"initial-message1","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":"Dear customer, thank you for reaching out to us. We will try our best to respond to your enquiry via Messenger chat as soon as possible. Should require immediate attention kindly select from the following options:"}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"assets/delete.png"}},"img":{"@class":"copy","@src":"assets/copy.png"}}},"br":null}}},{"@id":"15","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@parent":"1","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"960","@y":"-30","@width":"300","@height":"200","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow2","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","div":[{"@id":"card-header2","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"assets/reply.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header2","@class":"header","#text":"Contact Us"}}},{"@id":"card-body2","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@id":"initial-message2","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":`Thank you and please feel free to visit ${this.domain}.symplified.store or contact us @ +${this.contactNo} for further details.`}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"assets/delete.png"}},"img":{"@class":"copy","@src":"assets/copy.png"}}},"br":null}}},{"@id":"19","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@parent":"1","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"160","@y":"280","@width":"300","@height":"200","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow3","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","div":[{"@id":"card-header3","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"assets/hand.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header3","@class":"header","#text":"Please wait while we attend to you"}}},{"@id":"card-body3","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@id":"initial-message3","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":"Your chat is being redirected to our agent"}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"assets/delete.png"}},"img":{"@class":"copy","@src":"assets/copy.png"}}},"br":null}}},{"@id":"29","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@parent":"1","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"770","@y":"270","@width":"300","@height":"200","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow5","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","div":[{"@id":"card-header5","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"assets/reply.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header5","@class":"header","#text":"About Us"}}},{"@id":"card-body5","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@id":"initial-message5","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":"Please visit us @ "+this.domain+".symplified.store"}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"assets/delete.png"}},"img":{"@class":"copy","@src":"assets/copy.png"}}},"br":null}}},{"@id":"34","mxCell":{"@style":"rounded=1;whiteSpace=wrap;autosize=0;resizable=0;opacity=0","@parent":"1","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"670","@y":"-290","@width":"300","@height":"200","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@id":"flow6","@class":"custom-card flow-start-container shadow-lg bg-white","@style":"border-radius: 33px; border-color: transparent;","div":[{"@class":"tooltip-parent"},{"@class":"card","@style":"border-radius:35px;border:0px;width:300px; min-height:200px;","div":[{"@id":"card-header6","@class":"card-header","@style":"background-color:white;border-radius:35px;border:0px;","img":{"@src":"assets/reply.svg","@class":"start-icon float-left","@alt":"...","@style":"width:35px;height=35px"},"div":{"@style":"margin-left:60px;margin-top:5px;","h4":{"@id":"header6","@class":"header","#text":"Our store"}}},{"@id":"card-body6","@class":"card-body flow-start-trigger-list","@style":"height:63px","span":{"@id":"initial-message6","@class":"initial-message","@style":"font-size: 1.1rem; position: absolute;left: 10px;right: 10px;top: 65px;font-weight: 500","#text":`Follow below link to continue. https://${this.domain}.symplified.store`}}]}],"span":{"@class":"tooltip-text","div":{"@class":"d-inline img-icon mr-2","img":{"@class":"delete","@src":"assets/delete.png"}},"img":{"@class":"copy","@src":"assets/copy.png"}}},"br":null}}}],"ConnectionEnd":[{"@id":"7","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"5","@vertex":"1","mxGeometry":{"@width":"20","@height":"20","@relative":"1","@as":"geometry","mxPoint":{"@y":"45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"white","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"17","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"15","@vertex":"1","mxGeometry":{"@width":"20","@height":"20","@relative":"1","@as":"geometry","mxPoint":{"@y":"45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"white","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"21","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"19","@vertex":"1","mxGeometry":{"@width":"20","@height":"20","@relative":"1","@as":"geometry","mxPoint":{"@y":"45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"white","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"31","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"29","@vertex":"1","mxGeometry":{"@width":"20","@height":"20","@relative":"1","@as":"geometry","mxPoint":{"@y":"45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"white","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"36","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"34","@vertex":"1","mxGeometry":{"@width":"20","@height":"20","@relative":"1","@as":"geometry","mxPoint":{"@y":"45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"white","@stroke-width":"2","@fill":"white"}},"br":null}}}],"triggers":[{"@id":"9","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;","@parent":"5","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"85","@y":"120","@width":"150","@height":"55","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@style":"position: relative","button":{"@type":"button","@style":"width:200px; height:50px;text-overflow: ellipsis;","@class":"btn btn-primary btn-block customTrigger1","#text":"About Bon Appétit"}},"br":null}}},{"@id":"11","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;","@parent":"5","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"85","@y":"175","@width":"150","@height":"55","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@style":"position: relative","button":{"@type":"button","@style":"width:200px; height:50px;text-overflow: ellipsis;","@class":"btn btn-primary btn-block customTrigger1","#text":"Order Now"}},"br":null}}},{"@id":"13","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;","@parent":"5","@vertex":"1","@connectable":"0","mxGeometry":{"@x":"85","@y":"230","@width":"150","@height":"55","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","div":{"@style":"position: relative","button":{"@type":"button","@style":"width:200px; height:50px;text-overflow: ellipsis;","@class":"btn btn-primary btn-block customTrigger1","#text":"Contact Us"}},"br":null}}}],"ConnectionStart":[{"@id":"10","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;","@parent":"9","@vertex":"1","mxGeometry":{"@x":"140","@y":"10","@width":"20","@height":"20","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"gray"}},"br":null}}},{"@id":"12","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;","@parent":"11","@vertex":"1","mxGeometry":{"@x":"140","@y":"10","@width":"20","@height":"20","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"gray"}},"br":null}}},{"@id":"14","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;","@parent":"13","@vertex":"1","mxGeometry":{"@x":"140","@y":"10","@width":"20","@height":"20","@as":"geometry"},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"gray"}},"br":null}}},{"@id":"6","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"5","@vertex":"1","mxGeometry":{"@x":"1","@y":"1","@width":"15","@height":"15","@relative":"1","@as":"geometry","mxPoint":{"@x":"-7","@y":"-45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"gray"}},"br":null}}},{"@id":"16","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"15","@vertex":"1","mxGeometry":{"@x":"1","@y":"1","@width":"15","@height":"15","@relative":"1","@as":"geometry","mxPoint":{"@x":"-7","@y":"-45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"20","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"19","@vertex":"1","mxGeometry":{"@x":"1","@y":"1","@width":"15","@height":"15","@relative":"1","@as":"geometry","mxPoint":{"@x":"-7","@y":"-45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"30","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"29","@vertex":"1","mxGeometry":{"@x":"1","@y":"1","@width":"15","@height":"15","@relative":"1","@as":"geometry","mxPoint":{"@x":"-7","@y":"-45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"br":null}}},{"@id":"35","mxCell":{"@style":"resizable=0;constituent=1;movable=0;strokeColor=none;opacity=0;port=1;","@parent":"34","@vertex":"1","mxGeometry":{"@x":"1","@y":"1","@width":"15","@height":"15","@relative":"1","@as":"geometry","mxPoint":{"@x":"-7","@y":"-45","@as":"offset"}},"div":{"@xmlns":"http://www.w3.org/1999/xhtml","@as":"div","svg":{"@xmlns":"http://www.w3.org/2000/svg","@height":"20","@width":"20","@class":"connect-icon","circle":{"@cx":"10","@cy":"10","@r":"8","@stroke":"gray","@stroke-width":"2","@fill":"white"}},"br":null}}}]}}
    }
  
  constructor() { }
  
}
