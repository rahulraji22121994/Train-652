/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/search'],
/**
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{search} search
 */
function(currentRecord, log, search) {
    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    try {
        function saveRecord(scriptContext) {
            var searcharray=[];
            var Recod = scriptContext.currentRecord;
            var loc = Recod.getValue({
                fieldId: 'custrecord_jj_location'
            });
            console.log("loc", loc);
            var itemSearchObj = search.create({
                type: "item",
                filters:
                    [
                        ["isavailable", "is", "T"],
                        "AND",
                        ["inventorylocation", "anyof", loc]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "itemid",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({name: "salesdescription", label: "Description"}),
                        search.createColumn({name: "quantityavailable", label: "Available"}),
                        search.createColumn({name: "quantityonhand", label: "On Hand"})
                    ]
            });
            var searchResultCount = itemSearchObj.runPaged().count;
            log.debug("itemSearchObj result count", searchResultCount);
            var searchResult=itemSearchObj.run();
            searchResult.each(function(result) {
                var allValues = result.getAllValues();
                searcharray.push(allValues);
                log.debug('All values',allValues);
                return true;
            });
        }


    }
    catch (e) {
       log.debug("error",e);
    }
    return {
        saveRecord: saveRecord
    };
    
});
