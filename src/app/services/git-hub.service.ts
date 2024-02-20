import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private apiUrl = environment.apiUrl;
  private authToken = environment.authToken;

  constructor(private http: HttpClient) {}

  getUserRepos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/repos`);
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  createRepo(repoName: string, repoDescription: string): Observable<any> {
    const data = {
      name: repoName,
      description: repoDescription,
    };

    return this.http.post(`${this.apiUrl}/user/repos`, data);
  }

  editRepository(owner: string, repo: string, newName: string, newDescription: string): Observable<any> {
    const data = {
      name: newName,
      description: newDescription,
    };

    return this.http.patch(`${this.apiUrl}/repos/${owner}/${repo}`, data);
  }

  deleteRepository(owner: string, repos: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repos}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${this.authToken}`
    });
    return this.http.delete(url, { headers });
  }
}
