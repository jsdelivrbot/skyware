import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

//import { NoticeListPage } from '../notice/noticeList';

@Component({
  selector: 'page-noticeWrite',
  templateUrl: 'noticeWrite.html'
})
export class NoticeWritePage
{
  notice: { title: string, body: string } = {
    title: "", body: ""
  };

  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http)
  {
    
  }

  btnNoticeWrt()
  {
    var userId = localStorage.getItem("userId");

    // console.log(userId + " : " + this.notice.title + " : " + this.notice.body);

    if (userId == null || userId == "")
    {
      alert("로그인 해주세요!");
      return false;
    }

    if (this.notice.title.trim() == "")
    {
      alert("제목을 입력해주세요.");
      return false;
    }

    if (this.notice.body.trim() == "")
    {
      alert("내용을 입력해주세요.");
      return false;
    }

    var result;
    var addr = "http://localhost:8080/mobile/board/noticeWrite";
    let body = "noticeTitle=" + this.notice.title
      + "&noticeBody=" + this.notice.body
      + "&noticeWriterId=" + userId
    ;
    //let headers = new Headers({"Content-Type": "application/json"});
    let headers = new Headers({"Content-Type": "application/x-www-form-urlencoded"});
    let options = new RequestOptions({ headers: headers });

    this.http.post(addr, body, options)
      .map(res=>res.json())
      .subscribe((res)=>{
        result = res.result;

        if (result == "S00000")
        {
          alert("등록이 완료되었습니다.");
          this.navCtrl.pop();
        }
        else
        {
          alert("등록에 실패하였습니다.");
          return false;
        }
      });
  }

  btnCancel()
  {
    this.navCtrl.pop();
  }
}
