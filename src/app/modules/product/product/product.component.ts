import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

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

}

export interface ProductElement {
  id: number;
  name: string;
  price: number;
  amount: number;
  category: any;
  picture: any;
}

