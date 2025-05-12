import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly id = inject (PLATFORM_ID);
  userName:string  = "";
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(isPlatformBrowser(this.id)){
      this.flowbiteService.loadFlowbite((flowbite) => {
        initFlowbite();
      });
    }

    this.setUserName();
  }

  setUserName(){
    const user = localStorage.getItem('userToken-AuthApp')
    if(user != null){
      this.userName = JSON.parse( user).name;
    }
    
  }
}
