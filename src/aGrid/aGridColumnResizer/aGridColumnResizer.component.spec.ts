import { AGridColumnResizerComponent } from './aGridColumnResizer.component';
import { async, inject, TestBed } from '@angular/core/testing';

describe('aGridColumnResizer.component', () => {
    let instance;


    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridColumnResizerComponent
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridColumnResizerComponent).componentInstance;
        });
    }));

    it('mouseDown sets active to true and save startRight, rightNumber and xPrev', () => {
        let e = { pageX: 123, target: { parentNode: { aaa: 123 } } };

        instance.colResizerMouseDown(e);

        expect(instance.active).toEqual(true);

        expect(instance.startRight).toEqual(0);

        expect(instance.rightNumber).toEqual(0);

        expect(instance.xPrev).toEqual(123);
    });

    it('columnResized.next should fire on colResizerMouseUp when active === true', () => {
        instance.active = true;
        instance.startRight = 30;
        instance.rightNumber = 14;
        instance.right = 'right';
        spyOn(instance.columnResized, 'next');

        instance.colResizerMouseUp();

        expect(instance.active).toEqual(false);
        expect(instance.columnResized.next).toHaveBeenCalledWith(instance.startRight - instance.rightNumber);
    });

    it('columnResized.next should not fire on colResizerMouseUp when active === false', () => {
        instance.active = false;
        spyOn(instance.columnResized, 'next');
        instance.colResizerMouseUp();

        expect(instance.columnResized.next).not.toHaveBeenCalled();
    });


    it('mouseMove fires columnResized.next when active', () => {
        let startRight = 30, e = { pageX: 15 };

        let rightNumber = startRight - (e.pageX - instance.xPrev);

        spyOn(instance.columnResized, 'next');

        instance.active = true;
        instance.xPrev = 12;
        instance.startRight = startRight;

        instance.colResizerMouseMove(e);

        expect(instance.columnResized.next).toHaveBeenCalledWith(startRight - rightNumber);
    });

    it('mouseMove do not fires columnResized.next when active is false', () => {
        let startRight = 30, e = { pageX: 15 };

        let rightNumber = startRight - (e.pageX - instance.xPrev);

        spyOn(instance.columnResized, 'next');
        instance.active = false;
        instance.xPrev = 12;
        instance.startRight = startRight;

        instance.colResizerMouseMove(e);

        expect(instance.columnResized.next).not.toHaveBeenCalled();
    });

});