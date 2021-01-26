import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DepartmentsService } from '../../../core/services/departments.service';
import { Departments } from '../../../core/models/departments.model';
import { CompaniesService } from 'core/services/companies.service';
import { Company } from '../../../core/models/companies.model';
import { NotificationService } from '../../notification.service';


@Component({
  selector: 'app-departments-crud',
  templateUrl: './departments-crud.component.html',
  styleUrls: ['./departments-crud.component.scss']
})
export class DepartmentsCrudComponent implements OnInit {

  departmentForm: FormGroup;
  departmentObject: Departments;
  isHiddenSaveActionBtn: boolean;
  isDisabled: boolean;
  // isHiddenActionBtn: boolean;
  departmentId: number;
  isHiddenSaveCreateBtn: boolean;
  isHiddenEditActionBtn: boolean;
  isHiddenCreateActionBtn: boolean;
  isHiddendepartmentId: boolean;
  IsUpdate: boolean;
  companies: Observable<Company[]>;
  companyName: string;

  constructor(
    private fb: FormBuilder,
    private fb2: FormBuilder,
    private departmentsService: DepartmentsService,
    private companiesService: CompaniesService,
    private notifyService : NotificationService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.printDataToForm();
    this.loadComanpies();
    this.IsUpdate = false;
  }

  loadComanpies(){
    this.companies = this.companiesService.readonlyactivitiesModel;
    this.companiesService.getCompanies();
    console.log(this.companies);
  }

  initForm(){
    this.isHiddenSaveActionBtn = true;
    this.isHiddenSaveCreateBtn = true;
    this.isHiddenEditActionBtn = true;
    this.isHiddenCreateActionBtn = false;
    this.isHiddendepartmentId =  true;
    this.departmentForm = this.fb.group({
      departmentId: [0],
      companyFr: new FormControl({ value: '', disabled: true }, [Validators.required]),
      departmentEnName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      departmentArName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }
  //#region 0 printDataToForm to print data on clcik on each td on the table
  printDataToForm() {
    this.departmentsService.getDepartmentSubject().subscribe(res => {
      this.isHiddenCreateActionBtn = true;
      this.isHiddenEditActionBtn = false;
      this.departmentObject = res;
      this.departmentId = res.departmentId;

      console.log(this.departmentId);
      console.log("department Object", this.departmentObject);

      this.departmentForm = this.fb.group({
        departmentId: new FormControl({ value: res.departmentId,disabled: true }),
        companyFr: new FormControl({ value: '', disabled: true }, [Validators.required]),
        departmentEnName: new FormControl({ value: res.enName, disabled: true }, [Validators.required]),
        departmentArName: new FormControl({ value: res.arName, disabled: true }, [Validators.required])

      });

      this.companies.subscribe(data => {
        const company: Company = data.find(x => x.id === res.companyID);
        this.departmentForm.controls['companyFr'].setValue(company, { onlySelf: true });
       
      });

      this.IsUpdate = true;

    });
  }
  //#endregion

//#region 

// selectCompany(companyModel: Company) {
//   if (companyModel === null) {
//     return;
//   }
//   this.companyName = companyModel.enName;
//   this.IsUpdate = true;
// }

//#endregion

  //#region showBtns() method to show save and cancel btns on click on update btn
  showBtns() {
    // this.isDisabled = true;
    this.isHiddenSaveActionBtn = false;
    this.isHiddenCreateActionBtn = true;
    this.isHiddenSaveCreateBtn = true;
    this.departmentForm.enable();

  }
  //#endregion

  //#region showBtns() method to show save and cancel btns on click on Create btn
  showCreateSaveBtn() {
    // this.isDisabled = true;
    this.isHiddenSaveCreateBtn = false;
    this.isHiddenSaveActionBtn = true;
    this.isHiddenEditActionBtn = true;
    this.departmentForm.reset();
    this.departmentForm.enable();
  }
  //#endregion


//#region  update and create form in the same method
//#region  update and create form in the same method
onSubmit(model: any){
  debugger
  //create
  const department = new Departments();
  department.arName = model.departmentArName;
  department.enName = model.departmentEnName;

  if(model.companyFr === undefined){
    // pass error to UI
    return;
  }

  department.companyID = model.companyFr.id;

  if(department.companyID === 0){
    // pass error to UI
    return;
  }


  if(!this.IsUpdate){
    console.log(department);
    this.departmentsService.createDepartments(department);
      // Toaster Notification
    this.notifyService.showSuccess("Created successfuly", "Create department");

    this.departmentForm.reset();
    this.onReset();
    this.departmentForm.controls['departmentId'].setValue(0);
    this.IsUpdate = false;
  }
  //edit
  else{
    console.log(department);
    department.departmentId = model.departmentId;
    this.departmentsService.updateDepartment(department.departmentId, department);
    // Toaster Notification
    this.notifyService.showSuccess("updated successfully","update department");
    
    this.departmentForm.reset();
    this.onReset();
    this.departmentForm.controls['departmentId'].setValue(0);
    this.IsUpdate = false;
  }
}

  //#region onReset() method - fires on cancel
  onReset() {
    this.isHiddenSaveActionBtn = true;
    this.isHiddenSaveCreateBtn = true;
    this.isHiddenEditActionBtn = true;
    this.isHiddenCreateActionBtn = false;
    this.departmentForm.controls['departmentId'].setValue('');
    // this.departmentForm.reset();
    this.departmentForm.disable();
  }

}



