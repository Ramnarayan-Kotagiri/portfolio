import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConversationalForm, EventDispatcher } from 'conversational-form';
import { Router, ParamMap, ActivatedRoute, NavigationExtras } from "@angular/router"

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})


export class ChatbotComponent implements OnInit {
  business_capabilities = ['Authentication','Authorization','CRM','BPM']
  technology_capabilities = ['AI/ML','AZURE','Google','AWS']
  business_tools = ['eNotify','Amazon SNS']
  public querySubscription: any;
  public businessCapability: boolean;

  constructor (
    private router: Router,
    private route: ActivatedRoute
  ) {  }

  ngOnInit() {
    this.router.navigate(['/about'], {queryParams: {}});
    this.businessCapability = false
    const cfInstance = new ConversationalForm({
      formEl: document.getElementById("form"),
      theme: 'light',
      context: document.getElementById("cf-context"),
      hideUserInputOnNoneTextInput: false,
      submitCallback: function() {
        cfInstance.addRobotChatResponse("Alright, you are done."); 
       }
    });
    this.getParams();
  }

  getParams() {
    this.querySubscription = this.route.queryParamMap.subscribe((params: ParamMap) => {
      if (params.has('cfc-step3-business')){
        this.businessCapability = true;
      }
    });
  }

}
