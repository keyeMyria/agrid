import {
  Component, Input, Output, EventEmitter,
  ElementRef, ViewChild, ViewEncapsulation,
  ContentChildren, ContentChild
} from '@angular/core';
import { AGridColumnComponent } from './aGridColumn/agridcolumn.component';

import { AGridGroupDirective } from './aGridGroup/aGridGroup.directive';

import { DomSanitizer } from '@angular/platform-browser';

import { isFinite } from 'lodash';
import { AGridDetailDirective } from "./aGridDetail/aGridDetail.directive";

@Component({
  selector: 'a-grid',
  templateUrl: './agrid.template.html',
  styleUrls: ['./agrid.styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AGridComponent {

  @Input() public items;

  @Input() public showHeader = true;

  @Output() public onRowClick = new EventEmitter();

  @Output() public onRowDoubleClick = new EventEmitter();

  @Output() public onBodyScroll = new EventEmitter();

  @Input() public selectedProperty: string;

  @Input() public checkedProperty: string;

  @ContentChildren(AGridColumnComponent) private columns;

  @ContentChild(AGridGroupDirective) private group;

  @ContentChild(AGridDetailDirective) private detail;

  private selectedPropertyDefault = 'aGridSelected';

  private checkedPropertyDefault = 'aGridChecked';

  private bodyColumns: AGridColumnComponent[] = [];

  private bodyHeight;

  private headerHeight = 0;

  private bottomHeight = 0;

  constructor(private sanitizer: DomSanitizer) {
    this.setBodyHeight();
  }

  public ngAfterContentInit() {
    this.updateBodyBindings();
  }

  public ngOnChanges() {
    this.updateBodyBindings();
  }

  public rowClick(row) {
    // selection logic is in the source
    this.onRowClick.next(row);
  }

  public rowDoubleClick(row) {
    // check logic is in the source
    this.onRowDoubleClick.next(row);
  }

  private setBodyHeight() {
    if (this.headerHeight || this.bottomHeight) {
      this.bodyHeight = this.sanitizer
        .bypassSecurityTrustStyle(`calc(100% - ${this.headerHeight + this.bottomHeight}px)`);
    } else {
      this.bodyHeight = null;
    }
  }

  private headerHeightChanged(headerHeight) {
    if (isFinite(headerHeight)) {
      this.headerHeight = headerHeight;
      this.setBodyHeight();
    }
  }

  private bottomHeightChanged(bottomHeight) {
    if (isFinite(bottomHeight)) {
      this.bottomHeight = bottomHeight;
      this.setBodyHeight();
    }
  }

  private updateBodyBindings() {
    if (this.columns) {
      this.bodyColumns = [...this.columns._results];
    }
  }

  private get lastColumnResizable() {
    return !!(this.bodyColumns && this.bodyColumns.length &&
      this.bodyColumns[this.bodyColumns.length - 1].resizable);
  }
}
