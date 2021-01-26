import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../environments/environment';
import { Company } from 'core/models/companies.model';
import { MainResponse } from 'core/models/mainResponse.model';
import { HttpClientCrudService } from './http-client-crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService extends HttpClientCrudService<Company, number> {
  

  private endpoint = environment.apiUrl + "/Companies";

  private companyBehaviorSubject = new BehaviorSubject<Company[]>([]);
  private dataStoreCompany: { company: Company[] } = { company: [] };

  readonly readonlyactivitiesModel = this.companyBehaviorSubject.asObservable();

  // constructor(private http: HttpClient) { }
  constructor(protected _http: HttpClient) {
    super(_http, `${environment.apiUrl}/Companies`);
  }
  

  public getCompanies() {
    this.findAll().subscribe(
      (data: Company[]) => {
        this.dataStoreCompany.company = data;
        this.companyBehaviorSubject.next(Object.assign({}, this.dataStoreCompany).company);
      }
    );
  }

  // public getCompanies(): void {
  //   this.http.get<Company[]>(`${this.endpoint}`)
  //     .subscribe(
  //       (data: Company[]) => {
  //         this.dataStoreCompany.company = data;
  //         this.companyBehaviorSubject.next(Object.assign({}, this.dataStoreCompany).company);
  //       }
  //     );
  // }

  public CreateCompanies(company: Company): void {
    this.save(company)
      .subscribe(data => {
        this.dataStoreCompany.company.push(data);
          this.companyBehaviorSubject.next(Object.assign({}, this.dataStoreCompany).company);
      }, error => {
        console.error(error);
      });
  }
  // Update(company: Company) {
  //   this.http.put<MainResponse<Company>>(`${this.endpoint}/${company.id}`, company)
  //     .subscribe((data : MainResponse<Company>) => {
  //       for(var index = 0; index < this.dataStoreCompany.company.length; index++){
  //         if(this.dataStoreCompany.company[index].id === company.id){
  //           this.dataStoreCompany.company[index] = data.data;
  //           break;
  //         }
  //       }
          
  //         this.companyBehaviorSubject.next(Object.assign({}, this.dataStoreCompany).company);
  //     }, error => {
  //       console.error(error);
  //     });
  // }

  Update(company: Company) {
    this.update(company.id, company)
      .subscribe((data : MainResponse<Company>) => {
        debugger
        for(var index = 0; index < this.dataStoreCompany.company.length; index++){
          if(this.dataStoreCompany.company[index].id === company.id){
            this.dataStoreCompany.company[index] = data.data;
            console.log(data)
            break;
          }
        }
          
          this.companyBehaviorSubject.next(Object.assign({}, this.dataStoreCompany).company);
      }, error => {
        console.error(error);
      });
  }

  Delete(id: number): void{
    this.delete(id)
      .subscribe((data: Company) => {
        this.dataStoreCompany.company.forEach(e => {
          if(e.id === id){
            const index = this.dataStoreCompany.company.indexOf(e);
            this.dataStoreCompany.company.splice(index, 1);
            this.companyBehaviorSubject.next(Object.assign({}, this.dataStoreCompany).company);
            return;
          }
        });
      });
  }
}
