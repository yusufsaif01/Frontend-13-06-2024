import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/core';

const routes = {
  addAwards: (c: any) => '/achievement/add',
  updateAwards: (id: any) => `/achievement/${id}`,
  getAwardsList: (c: CommonContext) => '/achievement/list'
};

interface CommonContext {
  page_no?: number;
  page_size?: number;
}
interface AwardsListResponseContext {
  data: {
    total: number;
    records: {
      type: string;
      name: string;
      year: string;
      position: string;
      media: string;
    }[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AwardCertificateService {
  constructor(
    private httpClient: HttpClient,
    private credentialsService: CredentialsService
  ) {}

  addAwards(context: any): Observable<any> {
    for (var pair of context.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    return this.httpClient.post<any>(
      routes.addAwards(context),
      context,
      httpOptions
    );
  }

  updateAwards(id: any, context: any): Observable<any> {
    for (var pair of context.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    return this.httpClient.put<any>(
      routes.updateAwards(id),
      context,
      httpOptions
    );
  }
  // /api/achievement/list?page_no=1&page_size=20
  getAwardsList(context: CommonContext): Observable<AwardsListResponseContext> {
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    let query = '?';
    if (context['page_no']) {
      query += 'page_no=' + context['page_no'];
    }
    if (context['page_size']) {
      query += '&page_size=' + context['page_size'];
    }
    return this.httpClient.get<AwardsListResponseContext>(
      routes.getAwardsList(context) + query,
      httpOptions
    );
  }
}
