import { LightningElement , wire, api, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import sortAccountItem from '@salesforce/apex/lwcAccountListingCtrl.sortAccountList';

const columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        sortable: "true",
        editable: true,

    },
     {
        label: 'Account Owner',
        fieldName: 'Alias', 
        type: 'text',
        sortable: "true",
        editable: true,
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        editable: true,
    }, {
        label: 'Industry',
        fieldName: 'Industry',
        type: 'Picklist',
        editable: true,
    
    }, {
        label: 'AnnualRevenue',
        fieldName: 'AnnualRevenue',
        type: 'Currency',
        typeAttributes: { currencyCode: 'USD'},
        editable: true,
    }, {
        label: 'Website',
        fieldName: 'Website',
        type: 'URL',
        editable: true,
        
    },
];

export default class LwcSortingDataTable extends LightningElement {
    @api recordId;
    @api label;
    @track accounts;
    @track data;
    @track columns = columns;
    @track sortBy;
    @track sortDirection;

    @wire(sortAccountItem)
    accounts(result) {
        if (result.data) {
            this.data = result.data;
            this.error = undefined;
            
            //available account
            this.availableAccounts = data;
            this.initialRecords = data;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }




    handleSortAccountData(event) {       
        this.sortBy = event.detail.fieldName;       
        this.sortDirection = event.detail.sortDirection;       
        this.sortAccountData(event.detail.fieldName, event.detail.sortDirection);

    }


    sortAccountData(fieldname, direction) {
        
        let parseData = JSON.parse(JSON.stringify(this.data));
       
        let keyValue = (a) => {
            return a[fieldname];
        };


       let isReverse = direction === 'asc' ? 1: -1;


           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
           
            return isReverse * ((x > y) - (y > x));
        });
        
        this.data = parseData;


    }

    //Custom navigation
    navigateToRecordViewPage = () => {
        
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                actionName: 'view',
            }
        });
    }

    //Search bar contents
    handleSearchChange( event ) {

        this.searchString = event.detail.value;
        console.log( 'Updated Search String is ' + this.searchString );

    }

    handleSearch( event ) {

        const searchKey = event.target.value.toLowerCase();
        console.log( 'Search String is ' + searchKey );

        if ( searchKey ) {

            this.availableAccounts = this.initialRecords;
            console.log( 'Account Records are ' + JSON.stringify( this.availableAccounts ) );
            
            if ( this.availableAccounts ) {

                let recs = [];
                
                for ( let rec of this.availableAccounts ) {

                    console.log( 'Rec is ' + JSON.stringify( rec ) );
                    let valuesArray = Object.values( rec );
                    console.log( 'valuesArray is ' + JSON.stringify( valuesArray ) );
 
                    for ( let val of valuesArray ) {

                        console.log( 'val is ' + val );
                        let strVal = String( val );
                        
                        if ( strVal ) {

                            if ( strVal.toLowerCase().includes( searchKey ) ) {

                                recs.push( rec );
                                break;
                        
                            }

                        }

                    }
                    
                }

                console.log( 'Matched Accounts are ' + JSON.stringify( recs ) );
                this.availableAccounts = recs;

             }
 
        }  else {

            this.availableAccounts = this.initialRecords;

        }        

    }


}
