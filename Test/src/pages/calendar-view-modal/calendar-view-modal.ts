import { Component, ModuleWithProviders } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CalendarWriteModalPage } from '../calendar-write-modal/calendar-write-modal';

/**
 * Generated class for the CalendarViewModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-calendar-view-modal',
  templateUrl: 'calendar-view-modal.html',
})
export class CalendarViewModalPage {
  cate1 = [];
  cate2 = [];
  currentDate = moment(new Date()).format('YYYY/MM/DD HH:mm');
  event = { calendarNo: String(), startTime: String(), endTime: String(), saveTime: String(), cate1: String(), cate2: String(), title: String(), content: String(), memo: String(), completion: Number(), writerId: String(), allDay: Boolean, modifyFlag: String(), userNm: String() }
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private http: Http, private alertCtrl: AlertController) {
    console.log(this.navParams.get('calendarNo') + "navparamsssssssssssssss");

    this.event.calendarNo = this.navParams.get('calendarNo');
    this.event.startTime = moment(this.navParams.get('startTime')).format("YYYY/MM/DD HH:mm");
    this.event.endTime = moment(this.navParams.get('endTime')).format("YYYY/MM/DD HH:mm");
    this.event.title = this.navParams.get('title');
    this.event.cate1 = this.navParams.get('cate1');
    this.event.cate2 = this.navParams.get('cate2');
    this.event.content = this.navParams.get('content');
    this.event.memo = this.navParams.get('memo');
    this.event.completion = this.navParams.get('completion');
    this.event.writerId = this.navParams.get('writerId');
    this.event.allDay = this.navParams.get('allDay');
    this.event.userNm = this.navParams.get('userNm');

    console.log("올데이 : " +this.event.allDay)
    console.log("카테1 : "+this.event.cate1);
    console.log("카테2 : "+this.event.cate2);
  }

  cancel() {
    this.viewCtrl.dismiss(this.event);
  }

  cateReq() {
    var addr = "http://localhost:8080/mobile/scheduleGetCate";
    let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
    let options = new RequestOptions({ headers: headers });
    let data = "CATE=" + 'CATE';

    this.http.post(addr, data, options)
      .map(res => res.json())
      .subscribe((res) => {
          console.log(res);
        for (var index = 0; index < res.scheduleCateList.length; index++) {
          let temp1 = res.scheduleCateList[index];    
          let temp2 = res.scheduleCateList[index];

          if (res.scheduleCateList[index].codeDiv == "CATE01") {
            temp1.codeId = res.scheduleCateList[index].codeId;
            temp1.codeNm = res.scheduleCateList[index].codeNm;
            this.cate1.push(temp1);
          } else {
            temp2.codeId = res.scheduleCateList[index].codeId;
            temp2.codeNm = res.scheduleCateList[index].codeNm;
            this.cate2.push(temp2);
          }
        }
      }, (err) => {
        console.log(err);
        let alert = this.alertCtrl.create({
          title: '카테고리가 없습니다. 관리자에게 문의하세요',
          buttons: ['확인']
        });
        alert.present();
      });
  }

  modify(event) {
    
    var endDate = this.navParams.get('endTime');
    if (localStorage.getItem("userId") != this.event.writerId) {
      let alert = this.alertCtrl.create({
        title: '작성자만 수정할 수 있습니다.',
        buttons: ['확인']
      });
      alert.present();
    } else if (endDate < this.currentDate) {
      let alert = this.alertCtrl.create({
        title: '지난 일정입니다. 수정할 수 없습니다.',
        buttons: ['확인']
      });
      alert.present();
    } else {
      
      this.cateReq();

      let modal = this.modalCtrl.create(
        'CalendarModifyModalPage', {
          calendarNo: event.calendarNo, startTime: event.startTime, endTime: event.endTime, cate1: event.cate1, cate2: event.cate2,
          title: event.title, content: event.content, memo: event.memo, completion: event.completion, writerId: event.writerId,
          allDay: event.allDay, temp1: this.cate1, temp2: this.cate2
        })
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
          console.log(data);
          this.event.startTime = moment(data.startTime).format('YYYY/MM/DD HH:mm');
          this.event.endTime = moment(data.endTime).format('YYYY/MM/DD HH:mm');
          this.event.content = data.content;
          this.event.cate1 = data.cate1;
          this.event.cate2 = data.cate2;
          this.event.title = data.title;
          // this.event.saveTime = new Date().toString;
          this.event.completion = data.completion;
          this.event.calendarNo = data.calendarNo;
          this.event.userNm = localStorage.getItem("userNm");
          this.event.writerId = localStorage.getItem("userId");
          this.event.allDay = data.allDay;
          this.event.memo = data.memo;

        }
      });

      // this.viewCtrl.dismiss(this.event);
    }
  }


  delete() {
    if (this.event.writerId != localStorage.getItem("userId")) {
      let alert = this.alertCtrl.create({
        title: '작성자만 삭제할 수 있습니다.',
        buttons: ['확인']
      });
      alert.present();
    } else if (this.currentDate > this.event.endTime) {
      let alert = this.alertCtrl.create({
        title: '지난 일정은 삭제할 수 없습니다.',
        buttons: ['확인']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: '삭제하시겠습니까?',
        buttons: [
          {
            text: '취소',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              return;
            }
          },
          {
            text: '삭제',
            handler: () => {
              console.log('Delete clicked');
              var addr = "http://localhost:8080/mobile/scheduleDelete";
              let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
              let options = new RequestOptions({ headers: headers });
              let data = "calendarNo=" + this.event.calendarNo;

              this.http.post(addr, data, options)
                // .map(res => res.json())
                .subscribe((res) => {
                  this.viewCtrl.dismiss(this.event);
                }, (err) => {
                  console.log(err);
                  let alert = this.alertCtrl.create({
                    title: '삭제할 수 없습니다. 관리자에게 문의하세요',
                    buttons: ['확인']
                  });
                  alert.present();
                });
            }
          }
        ]
      });
      alert.present();
    }
  }
}
