import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedReposService {
  private reposSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  repos$: Observable<any[]> = this.reposSubject.asObservable();

  constructor() {}

  updateRepos(repos: any[]): void {
    this.reposSubject.next(repos);
  }

  addRepo(newRepo: any): void {
    const currentRepos = this.reposSubject.getValue();
    const updatedRepos = [...currentRepos, newRepo];
    this.reposSubject.next(updatedRepos);
  }

  getRepos(): any[] {
    return this.reposSubject.getValue();
  }
}
