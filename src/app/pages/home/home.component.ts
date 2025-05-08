import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName:string  = "";
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setUserName();
  }

  setUserName(){
    const user = localStorage.getItem('userToken')
    if(user != null){
      this.userName = JSON.parse( user).name;
    }
    
  }
}
