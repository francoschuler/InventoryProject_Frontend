import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  isAdmin: any;

  constructor(private categoryService: CategoryService, 
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private util: UtilService) { }

  ngOnInit(): void {
    this.getCategories();
    this.isAdmin = this.util.isAdmin();
    
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

  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        this.openSnackBar("Categoría creada correctamente.", "Vale");
        this.getCategories();
      }else if(result == 2) {
        this.openSnackBar("Se produjo un error al crear la categoría.", "Vale");
      }
    });
  }

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: "500px",
      data: {id: id, name: name, description: description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        this.openSnackBar("Categoría actualizada correctamente.", "Vale");
        this.getCategories();
      }else if(result == 2) {
        this.openSnackBar("Se produjo un error al actualizar la categoría.", "Vale");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: "500px",
      data: {id: id, module:"category"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        this.openSnackBar("Categoría eliminada correctamente.", "Vale");
        this.getCategories();
      }else if(result == 2) {
        this.openSnackBar("Se produjo un error al eliminar la categoría.", "Vale");
      }
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.getCategories();
    }

    this.categoryService.getCategoryById(termino)
        .subscribe((resp:any) => {
          this.processCategoriesResponse(resp);
        })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  exportExcel() {
    this.categoryService.exportCategories()
        .subscribe((data:any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          let anchor = document.createElement("a");
          anchor.download = "categories.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente.", "Vale");
        }, (error:any) => {
          this.openSnackBar("Error al exportar el archivo.", "Vale");
        })
  }
  

}

export interface CategoryElement {
  name: string;
  id: number;
  description: string;
}
