import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    public async exportAsExcelFile(json: any[], excelFileName: string): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');

        // Add headers and data
        if (json.length > 0) {
            const columns = Object.keys(json[0]).map(key => ({ header: key, key: key, width: 20 }));
            worksheet.columns = columns;
        }

        worksheet.addRows(json);

        const buffer = await workbook.xlsx.writeBuffer();
        this.saveAsExcelFile(buffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });

        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
