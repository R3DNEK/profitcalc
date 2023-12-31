/* global GoogleAppsScript */
/* global SpreadsheetApp */

import resetTotalSheet from './totals';
import { formatSheet } from './format';
import { newCoinSheet } from './new-coin';
import { updateFMVFormulas } from './formulas-coin';
import { newNFTSheet } from './new-nft';
import { updateNFTFormulas } from './formulas-nft';
import { formatNFTSheet } from './format-nft';

/**
 * Creates example coins with data showing how HODL Totals works
 *
 * @return the first of the two sheets that are created
 */
export function loadExample(): GoogleAppsScript.Spreadsheet.Sheet | null {
    // delete any pre-existing pretendCOIN example sheets
    if (typeof ScriptApp !== 'undefined') {
        const sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pretendCOIN1');
        const sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pretendCOIN2');
        const sheet3 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pretendMetamask NFTs');
        if (sheet1 != null) {
            SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet1);
        }
        if (sheet2 != null) {
            SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet2);
        }
        if (sheet3 != null) {
            SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet3);
        }
    }

    const newSheet1 = newCoinSheet('pretendCOIN1');
    const newSheet2 = newCoinSheet('pretendCOIN2');
    const newSheet3 = newNFTSheet('pretendMetamask');
    if (newSheet1 !== null) {
        coin1Example(newSheet1);
    }
    if (newSheet2 !== null) {
        coin2Example(newSheet2);
    }
    if (newSheet3 !== null) {
        nftExample(newSheet3);
    }

    // reset totals sheet to account for the newly added pretendCoin wallets
    resetTotalSheet();

    // format coin sheets after reseting the Totals sheet to make reconciliation dropdowns correct
    formatSheet(newSheet1);
    formatSheet(newSheet2);
    formatNFTSheet(newSheet3);

    return newSheet1;
}

/**
 * Classically known as "the cost basis example"
 *
 */
function coin1Example(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
    // sample data set
    const initialData: string[][] = [
        ['FALSE', 'Coinbase Account', '321432-babbcd-00435', 'Crypto given to me at SXSW by a friendly entrepenuer', '2017-03-15 0:00:00', 'Gift Received', '+0.2', 'Value Known', '0.20000000', '200.00', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Coinbase Account', '88811-eee-pl33z', 'Purchased at coinbase for $600, fees included', '2018-02-01 0:00:48', 'USD Deposit', '+0.6', 'Value Known', '0.60000000', '600.00', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Coinbase Account', '8576309-yolo-8576309', 'Bought a pizza with pretendCOIN1', '2018-02-01 9:23:45', 'Spent', '-0.05', 'Value Known', '0', '0', '0.05000000', '100.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Coinbase Account', '8576309-yolo-8576309', 'Tx Fee for buying a pizza with pretendCOIN1', '2018-02-01 9:23:45', 'Tx Fee', '-0.05', 'Value Known', '0', '0', '0.05000000', '100.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Coinbase Account', '77777rrre5re5re5re5re77777', 'Sold pretendCOIN1 for $601.11 USD on coinbase, fees included', '2018-03-21 17:20:22', 'USD Withdrawal', '-0.3', 'Value Known', '0', '0', '0.30000000', '601.11', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'eeeeyyyyoorree5555bbbbdddaaaayyy', 'Distributed to everyone that filled out the gleam.io form last month', '2018-03-22 8:08:08', 'Active Airdrop', '+0.4', 'Value Known', '0.40000000', '400.00', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Coinbase Account', 'yyyyzzz-343434-525210', 'Transfer from Coinbase to Metamask', '2018-03-23 9:09:09', 'Transfer Out', '-0.4', 'Value Known', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '1a2b3c4d5e6f7g8h9i10j11k12l13m14n15o16p', 'Transfer from Coinbase to Metamask', '2018-03-23 9:11:50', 'Transfer In', '+0.4', 'Value Known', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'deadbeef42deadbeef69', 'pretendCOIN2, pretendCOIN1: Uniswap traded 2 pretendCOIN2 for 0.6 pretendCOIN1', '2021-04-01 0:15:00', 'Trade Inflow', '+0.6', 'Value Known', '0.60000000', '108.50', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'e11it3hkr8zb3wr3maB2much4u2hnd13', 'Tx Fee for buying Sweet NFT #4242', '2022-03-06 13:10:11', 'Tx Fee', '-0.05', 'Value Known', '0', '0', '0.05000000', '50.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'e11it3hkr8zb3wr3maB2much4u2hnd13', 'Minted Sweet NFT #4242', '2022-03-06 13:10:11', 'Sold for Goods', '-0.1', 'Value Known', '0', '0', '0.10000000', '100.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'fu72fu72fu72fu72fu72fu72fu72', 'prentedCOIN1 Gift for my boo', '2022-03-07 10:00:00', 'Given Away', '-0.1', 'Value Known', '0', '0', '0.10000000', '200.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '33op3ns33brkns33sal34pr0f1t', 'Tx Fee for listing Sweet NFT #4242 on opensea for 1.0 pretendCoin1', '2022-03-08 10:00:00', 'Tx Fee', '-0.04', 'Value Known', '0', '0', '0.04000000', '35.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '1w1nn1ngb1dd3rg0trekt2day', 'Sold Sweet NFT #4242 on opensea for 10x profit', '2022-04-14 13:13:13', 'NFT Sales Inflow', '+0.91250000', 'Value Known', '0.91250000', '1277.50', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '4sureNvrkn0w102qu1tWen0nt0p', 'Tx Fee for buying Sweet NFT #6969', '2022-05-01 23:32:20', 'Tx Fee', '-0.03', 'Value Known', '', '', '0.03000000', '50.00', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '4sureNvrkn0w102qu1tWen0nt0p', 'Bought Sweet NFT #6969 on opensea', '2022-05-01 23:32:20', 'Sold for Goods', '-0.5', 'Value Known', '', '', '0.5', '800.00', '', '', '', '', '', '', '', '', '']
    ];
    initialData.push(...instructionData());

    for (let i = 0; i < initialData.length; i++) {
        sheet.getRange(`A${i + 3}:U${i + 3}`).setValues([initialData[i]]);
    }

    // FMV on this sheet is all value known, so hide the strategy & FMV columns and thus hide some complexity
    sheet.hideColumns(8);
    sheet.hideColumns(13, 3);
}

/**
 * Classically known as "the Fair Market Value example"
 *
 */
function coin2Example(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
    // sample data set
    const initialData: string[][] = [
        ['FALSE', 'Metamask', 'aaa1112222333bbb', 'Distributed on project launch day to people who performed the requested actions on twitter', '2015-12-01 15:20:10', 'Active Airdrop', '+1.0', 'Avg Daily Price Variation', '1.00000000', '', '', '', '1.111100', '0.992222', '', '', '', '', '', '', ''],
        ['FALSE', 'Coinbase Account', 'BBBB444445555CCC', 'coinbase.com Coinbase Earn pretendCOIN promotion', '2018-02-28 20:23:59', 'Promotion', '+1.0', 'Value Known', '1.00000000', '1', '', '', '0', '0', '0', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'Ccccc6666667777ddddddd', 'Spent 1 pretendCOIN2 on a digital ticket to a concert in the metaverse, tx fee included', '2018-03-01 2:04:01', 'Spent', '-1.0', 'Value Known', '', '', '1.00000000', '5', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'eeee-89898989-fffff', 'Offline purchase of 23 pretendCOIN2 from John Doe @ 34 USD/pretendCOIN2', '2019-02-28 0:00:02', 'USD Deposit', '+23.0', 'Price Known', '23.00000000', '', '', '', '0', '0', '34', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'deadbeef42deadbeef69', 'pretendCOIN2, pretendCOIN1: Uniswap traded 2 pretendCOIN2 for 0.6 pretendCOIN1', '2021-04-01 0:15:00', 'Trade Outflow', '-2.0', 'Avg Daily Price Variation', '', '', '2.00000000', '', '2.312002', '1.8222', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '345sixSEVENeight9ten', 'Tx Fee to Transfer my Metamask balance to binance for cash out', '2021-04-01 12:00:05', 'Tx Fee', '-0.02', 'Value Known', '', '', '0.02000000', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', '345sixSEVENeight9ten', 'Transfer my Metamask balance to binance for cash out', '2021-04-01 12:00:05', 'Transfer Out', '-20.98', 'n/a', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Binance.us Account', '345sixSEVENeight9ten', 'Transfer my Metamask balance to binance for cash out', '2021-04-01 12:00:05', 'Transfer In', '+20.98', 'n/a', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', 'Binance.us Account', 'IJijIJijIJijIJ3434334343', 'binance.us traded 20 pretendCOIN2 for USD', '2021-04-02 9:00:00', 'USD Withdrawal', '-20.0', 'Avg Daily Price Variation', '', '', '20.00000000', '', '=0.0003561*7088.25', '=0.0003561*6595.92', '', '', '', '', '', '', ''],
        ['FALSE', 'Metamask', 'onetwo3456seven-EightNine', 'unsolicited distribution of pretendCOIN2 from a total stranger sent to random addresses', '2022-05-31 10:12:12', 'Passive Airdrop', '+26.92', 'Avg Daily Price Variation', '26.92000000', '', '', '', '=0.0069319*9700.34/I12', '=0.0069319*9432.3/I12', '', '', '', '', '', '', ''],
    ];
    initialData.push(...instructionData());

    for (let i = 0; i < initialData.length; i++) {
        sheet.getRange(`A${i + 3}:U${i + 3}`).setValues([initialData[i]]);
    }

    updateFMVFormulas(sheet);
}

/**
 * Instructions to tack onto the bottom of all example coins
 *
 */
function instructionData(): string[][] {
    const instructionsData: string[][] = [
        ['FALSE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'NEXT: RECONCILE YOUR RECORDS', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Login to each wallet/account you have for this coin and enter each balance in the totals sheet.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Put today\'s date in the "on Date" column as the day you have reconciled each balance.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Check that the reported total balance matches the total tracked coin balance.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Fix any data discrpencies, and check the "Tx ✔" box for each reconciled row.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'After pasting data into the sheet, use "Format columns" from the menubar to clean up the data.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'THEN: DETERMINE FAIR MARKET VALUE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Make sure that the Value(USD) columns are populated correctly.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'If the USD value is not known, choose a Valuation Strategy and fill in the Fair Market Value columns.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'After pasting price values into the sheet, use "Update formulas" to fill in the Value(USD) formulas.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'FINALLY: CALCULATE YOUR GAIN/LOSS', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Using the column header, order your transactions from oldest to newest, Sort from A→Z.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['FALSE', '', '', 'Run a calculation by selecting "Calculate gain/loss" from the menubar.', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ];
    return instructionsData;
}

/**
 * Classically known as "the NFT example"
 *
 */
function nftExample(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
    // sample data set
    const initialData: string[][] = [
        ['FALSE', 'Sweet NFT', '4242', 'e11it3hkr8zb3wr3maB2much4u2hnd13', 'Minted Sweet NFT #4242', '2022-03-06 13:10:11', 'Mint', '0.1', '100.00', '0.05', '50.00', '0', '0', '', '', '', '', 'FALSE', '33op3ns33brkns33sal34pr0f1t, 1w1nn1ngb1dd3rg0trekt2day', 'Sold on opensea for 10x profit', 'Sold for Crypto', '2022-04-14 13:13:13', '1.0', '1400.00', '0', '0', '0.0875', '122.50', '', '', '', '', ''],
        ['FALSE', 'Sweet NFT', '6969', '4sureNvrkn0w102qu1tWen0nt0p', 'Bought NFT #6969 on opensea', '2022-05-01 23:32:20', 'Purchased (Fixed Price)', '0.5', '800.00', '0.03', '50', '0', '0', '', '', '', '', 'FALSE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];

    for (let i = 0; i < initialData.length; i++) {
        sheet.getRange(`A${i + 3}:AG${i + 3}`).setValues([initialData[i]]);
    }

    updateNFTFormulas(sheet);
}
