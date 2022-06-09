public with sharing class lwcAccountListingCtrl {
 
    @AuraEnabled(Cacheable = true)
    public static List<Account> sortAccountList(){
        
        //Query 10 accounts
        List<Account> accListObj= [SELECT Name, OwnerId, Owner.Name, Phone, Industry, Website, AnnualRevenue FROM Account WITH SECURITY_ENFORCED Order By Name asc limit 10 ];
        //Return list of accounts
        return accListObj;
    }
 
}
