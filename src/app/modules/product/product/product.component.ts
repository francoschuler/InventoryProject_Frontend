import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { ProductService } from '../../shared/services/product.service';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProducts();
  }

  displayedColumns: string[] = ['id', 'name', 'price', 'amount', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts() {
    this.productService.getProducts()
        .subscribe( (data:any) => {
          console.log("RESPUESTA DE PRODUCTOS: ", data);
          this.processProductResponse(data);
        }, (error:any) => {
          console.log("ERROR: ", error);
        });
  }

  processProductResponse(resp: any) {
    const dataProduct: ProductElement[] = [];
    if(resp.metadata[0].code == "00"){
      let listProduct = resp.product.products;

      listProduct.forEach((element: ProductElement) => {
        element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dataProduct.push(element);
      });

      // Setear datasource

      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;

    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        this.openSnackBar("Producto creado correctamente.", "Vale");
        this.getProducts();
      }else if(result == 2) {
        this.openSnackBar("Se produjo un error al crear el producto.", "Vale");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 4000
    });
  }

}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  amount: number;
  category: any;
  picture: any;
}

