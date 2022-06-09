@isTest
private with sharing class lwcAccountListingTest {

    @TestSetup
    static void makeData(){
        list<Account> lstAccounts = new list<Account>();
        for( Integer i=1; i <= 10; i++ ){
            lstAccounts.add( new Account( Name='Test Account '+i ));
        }

        insert lstAccounts;
    }

    @isTest
    private static void unitTest() {
        Test.startTest();
            list<Account> lstAccounts = lwcAccountListingCtrl.sortAccountList();
            System.assert( lstAccounts.size() == 10 );
        Test.stopTest();
    }

}
