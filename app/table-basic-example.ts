import { FormatWidth } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

@Component({
  selector: 'table-basic-example',
  styleUrls: ['table-basic-example.css'],
  templateUrl: 'table-basic-example.html'
})
export class TableBasicExample {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private uid = 0;
  vlArr = [
    {
      product: 'contractA',
      unit: '11',
      product_id: 1,
      height: '5.5',
      weight: '55',
      vals: []
    },
    {
      product: 'No Contract',
      unit: '22',
      product_id: 2,
      height: '5.6',
      weight: '56',
      vals: [
        { ids: 2, name: 'ananth2', age: '80' },
        { ids: 3, name: 'ananth3', age: '28' }
      ]
    },
    {
      product: 'No Contract',
      unit: '23',
      product_id: 5,
      height: '5.7',
      weight: '57',
      vals: [
        { ids: 4, name: 'ananth4', age: '8' },
        { ids: 5, name: 'ananth5', age: '20' }
      ]
    }
  ];

  valArr2 = Object.entries(_.groupBy(this.vlArr, 'product'));

  @ViewChild('table') table: MatTable<any>;

  displayedColumns = ['name', 'age'];

  get productControlArray() {
    return this.form.get('products') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    this.createForm();
    this.updateValues();
  }

  createForm() {
    this.form = this.fb.group({
      products: this.fb.array([])
    });
  }

  cmpare(index) {
    return index;
  }

  save() {
    console.log('this check', this.form);
  }

  removerRate(index, hypIndex, opIndex, rateIndex) {
    let checkOpRows = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals')
      ['at'](hypIndex)
      .get('details')
      ['at'](opIndex)
      .get('vals');

    checkOpRows['at'](0).removeAt(rateIndex);

    if (_.isEmpty(checkOpRows['at'](0).value)) {
      checkOpRows.removeAt(0);
    }
  }

  removeHyperion(index, hypIndex) {
    const rows = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals');

    rows.removeAt(hypIndex);
  }

  removeOperation(index, hypIndex, opIndex) {
    let detRows = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals')
      ['at'](hypIndex)
      .get('details');
    detRows.removeAt(opIndex);
  }

  private addRow(index) {
    const rows = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals');
    rows.push(
      this.fb.group({
        product_id: ['', Validators.required],
        unit: ['', Validators.required],
        details: this.fb.array([])
      })
    );
  }

  valDisableChange(index, hypIndex, opIndex, rateIndex) {
    let opchange = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals')
      ['at'](hypIndex)
      .get('details')
      ['at'](opIndex)
      .get('vals')
      ['at'](0)
      ['at'](rateIndex);

    if (opchange.get('name').value !== 'ananth') {
      opchange.get('age').disable();
    } else {
      opchange.get('age').enable();
    }

    console.log('calling', opchange);
  }

  createDetailRows(index, c) {
    let detRows = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals')
      ['at'](c)
      .get('details');
    detRows.push(
      this.fb.group({
        height: ['', Validators.required],
        weight: ['', Validators.required],
        vals: this.fb.array([])
      })
    );
  }

  createValRows(index, c, h) {
    let checkOpRows = this.productControlArray['at'](index)
      ['at'](0)
      .get('subVals')
      ['at'](c)
      .get('details')
      ['at'](h)
      .get('vals');

    let oprows = checkOpRows;

    if (checkOpRows.value.length > 0) {
      oprows = checkOpRows['at'](0);
      oprows.push(
        this.fb.group({
          name: ['', Validators.required],
          age: [{ value: null, disabled: true }, Validators.required]
        })
      );
    } else {
      oprows.push(
        this.fb.array([
          this.fb.group({
            name: ['', Validators.required],
            age: ['', Validators.required]
          })
        ])
      );
    }
  }

  createRow(index) {
    this.addRow(index);
    this.table.renderRows();
  }

  updateValues() {
    const rows = this.productControlArray;
    this.valArr2.forEach((val, index) => {
      rows.push(
        this.fb.array([
          this.fb.group({
            keys: val[0],
            subVals: this.calcSubVals(val[1])
          })
        ])
      );
    });
  }

  calcSubVals(v) {
    let subRows = new FormArray([]);
    v.forEach((v, index) => {
      subRows.push(
        this.fb.group({
          product_id: [v.product_id, Validators.required],
          unit: [v.unit, Validators.required],
          details: this.fb.array([
            this.fb.group({
              height: [v.height, Validators.required],
              weight: [v.weight, Validators.required],
              vals:
                v.vals != []
                  ? this.fb.array([this.updateExtraData(v, index)])
                  : null
            })
          ])
        })
      );
    });
    return subRows;
  }

  updateExtraData(data, index) {
    let operationRows = new FormArray([]);
    data.vals.forEach(d => {
      operationRows.push(
        this.fb.group({
          name: [d.name, Validators.required],
          age: [d.age, Validators.required]
        })
      );
    });
    return operationRows;
  }

  print(c) {
    console.log('printing', c);
  }

  giveDataSource() {}
}
