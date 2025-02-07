import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserJoinPage } from '../user/userJoin';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  userInfo: { userId: string, userPw: string } = {
    userId: "", userPw: ""
  };
  // userId: "sss";
  // userPw: "s1ers";
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  // account: { email: string, password: string } = {
  //   email: 'test@example.com',
  //   password: 'test'
  // };

  // Our translated text strings
  // private loginErrorString: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private alertCtrl: AlertController, private http: Http, public menuCtrl: MenuController) {
    // this.translateService.get('LOGIN_ERROR').subscribe((value) => {
    //   this.loginErrorString = value;
    // })
    this.menuCtrl.enable(false);
  }
  
  // Attempt to login in through our User service
  // doLogin()
  // {
  //   console.log(this.userId + " : " + this.userPw);
  // }


  // btnLogin(userId, userPw)
  doLogin() {
    // console.log(this.userInfo.userId + " : " + this.userInfo.userPw);

    var result;
    var userInfo;
    var addr = "http://192.168.0.87:8080/mobile/LoginAction";
    /*let body = {
      userId : userId,
      userPw : userPw
    };*/
    let body = "userId=" + this.userInfo.userId + "&userPw=" + this.userInfo.userPw;
    //let headers = new Headers({"Content-Type": "application/json"});
    let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    let options = new RequestOptions({ headers: headers });

    //let body2 = JSON.stringify(body);

    this.http.post(addr, body, options)
      .map(res => res.json())
      .subscribe((res) => {
        result = res.result;
        userInfo = res.userInfo;
        
        // console.log("result : " + result);
        // console.log("userInfo : " + JSON.stringify(userInfo));

        if (result == 0) {
          alert("아이디를 찾을 수 없습니다.");
          return false;
        }
        else if (result == 1) {
          alert("비밀번호가 잘 못 되었습니다.");
          return false;
        }
        else if (result == 2) {
          alert("회원승인이 되지 않았습니다.\n관리자에게 문의하세요.");
          return false;
        }
        else if (result == 3) {
          // alert("Login Success!!!");
          
          this.menuCtrl.enable(true);
          // this.navCtrl.push(TabsPage);
          this.navCtrl.setRoot(TabsPage);
          localStorage.setItem("userId", userInfo.userId);
          localStorage.setItem("userNm", userInfo.userNm);
          localStorage.setItem("userEmail", userInfo.userEmail);
          localStorage.setItem("userPhone", userInfo.userPhone);
          localStorage.setItem("userBirth", userInfo.userBirth);
          localStorage.setItem("userRegDate", userInfo.userRegDate);
          
          localStorage.setItem("userInfo", res.userInfo);
        
          //localStorage.setItem("isLogin", userInfo.isLogin);
        }
      });
  }

  btnJoin() {
    this.navCtrl.push(UserJoinPage);
  }

  btnTest() {

  }
}
