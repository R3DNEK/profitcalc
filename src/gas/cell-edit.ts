import { sheetContainsCoinData, sheetContainsNFTData } from './sheet';
import { setFMVStrategyOnRow } from './formulas-coin';
import getLastRowWithDataPresent from '../last-row';

/* global GoogleAppsScript */
/* global SpreadsheetApp */

/**
 * A special function that runs when a user changes the value of any cell in a spreadsheet
 */
export default function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit): void {
    const sheet = e.range.getSheet();

    // simple check to verify that onEdit actions only happen on coin tracking sheets
    if (sheetContainsCoinData(sheet)) {
        const editedRow = e.range.getRow();
        // edit events triggered by users using the B1 dropdown
        if ((e.range.getColumn() === 2) && (editedRow === 1)) {
            const walletSelectedData = sheet.getRange('B1').getDisplayValue();
            const walletSelected = walletSelectedData.replace(/ *\([^)]*\) */g, '');
            const lastRow = getLastRowWithDataPresent(sheet.getRange('E:E').getDisplayValues());

            // if user selected anything besides All Wallets & Accounts, filter to that
            if (walletSelected.trim() !== 'All Wallets & Accounts') {
                // Because setVisibleValues() only works for pivot tables, as noted here
                // https://developers.google.com/apps-script/reference/spreadsheet/filter-criteria-builder#setVisibleValues(String)
                // will need to create a filter to hide all values not matching the user's dropdown selection
                const walletData = sheet.getRange(`B3:B${lastRow}`).getValues().filter(String) as string[][];
                const walletList = walletData.map(wallet => wallet[0]);
                const walletsToHide = walletList.filter(wallet => wallet !== walletSelected);
                const filtercriteria = SpreadsheetApp.newFilterCriteria()
                    .setHiddenValues(walletsToHide)
                    .build();
                sheet.getFilter()?.setColumnFilterCriteria(2, filtercriteria);
            } else {
                // faster to remove filter and re-add then clear the column filter with removeColumnFilterCriteria()
                sheet.getFilter()?.remove();
                sheet.getRange(`A2:U${lastRow}`).createFilter();
            }
            // scroll back to the the top of data range to ensure to make sure users notice the result of changing the filter
            sheet.getRange(3, 2).activate();
            SpreadsheetApp.flush();
        }
        // edit events triggered by the Tx column
        if ((e.range.getColumn() === 1) && (editedRow >= 3)) {
            const lastRow = getLastRowWithDataPresent(sheet.getRange('E:E').getDisplayValues());
            if (editedRow > lastRow) {
                // create filter around all transactions
                sheet.getFilter()?.remove();
                sheet.getRange(`A2:U${editedRow}`).createFilter();
                SpreadsheetApp.flush();
            }
        }
        // edit events triggered by the FMV Strategy column
        if ((e.range.getColumn() === 8) && (editedRow >= 3)) {
            // update the FMV columns
            const newStrategy = e.value;
            const oldStrategy = e.oldValue;
            const acquired = sheet.getRange(`I${editedRow}`).getValue() as number;
            const disposed = sheet.getRange(`K${editedRow}`).getValue() as number;
            setFMVStrategyOnRow(sheet, editedRow - 1, null, newStrategy, acquired, disposed, oldStrategy);
            SpreadsheetApp.flush();
        }
    } else if (sheetContainsNFTData(sheet)) {
        const editedRow = e.range.getRow();
        // edit events triggered by the Tx column
        if ((e.range.getColumn() === 1) && (editedRow >= 3)) {
            const lastRow = getLastRowWithDataPresent(sheet.getRange('F:F').getDisplayValues());
            if (editedRow > lastRow) {
                // create filter around all transactions
                sheet.getFilter()?.remove();
                sheet.getRange(`A2:AG${editedRow}`).createFilter();
                SpreadsheetApp.flush();
            }
        }
    }
}
