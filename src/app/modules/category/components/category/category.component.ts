import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories(){
    this.categoryService.getCategories()
        .subscribe( data => {
          this.processCategoriesResponse(data);
          console.log("respuesta categories", data);

        }, error => {
          console.log("ERROR: ", error);
        })
  }

  processCategoriesResponse(resp: any){
    const dataCategory: CategoryElement[] = [];
    if(resp.metadata[0].code == "00"){
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach( (element:CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }
  

}

export interface CategoryElement {
  name: string;
  id: number;
  description: string;
}
