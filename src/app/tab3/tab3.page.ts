import { Component, OnInit } from '@angular/core';
import { GitHubService } from '../services/git-hub.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
user: any ={}
  constructor(private githubService: GitHubService){}

  ngOnInit(): void {
    this.githubService.getUserInfo().subscribe(data => {
      this.user = data;
      console.log("usuario ", this.user);
    }, error => {
      console.error("Error", error);
    });
    
  }

}
