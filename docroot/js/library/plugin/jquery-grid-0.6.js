(function($) {

    $.widget("litmusbox.grid", {
        options : {    
            header      : {
                label            : '&nbsp;',
                isHidden         : false,
                isTableCollapsed : false
            },
            table       : {
                className        : '',                
                data             : {
                    url                    : false,
                    isLoadOnInitialization : true,
                    isLoaded               : false,
                    json                   : false, 
                    length                 : 0,
                    page                   : {
                        size    : 0,
                        current : 1,
                        max     : 0
                    },
                    sort                  : {
                        key         : false,
                        order       : 'asc',
                        refinements : {}
                    }
                },            
                header  : {
                    className : '',
                    isHidden  : false
                },
                body    : {
                    className    : '',
                    emptyMessage : 'No Search Results',
                    row          : {
                        isHighlight : false,
                        className   : ''
                    }
                },
                columns : [
                    {
                        label      : null,
                        id         : null,
                        className  : null,
                        isSortable : false
                    }
                ],
                rows    : {
                    formatRow : function(key, value) {
                        return value;
                    }
                },
                footer  : {
                    isPaging         : false,
                    isExpandCollapse : false,
                    legend           : '&nbsp;'
                }
            },                        
            debug           : false
        },
        _create : function() {    	    
            //To prevent "this" from being overwritten
            var self = this;

            //Debug message
            this._debug('Grid Options', this.options);
            
            //Create grid cache
            this.grid = {};
            
            //Create and cache the grid container
            this.grid.container = $(
                '<div class="Litmusbox_Grid_Container">' +
                '    <div class="Litmusbox_Grid_Header_Container">' +
                '        <span class="Litmusbox_Grid_Header_Label"></span>' +
                '        <span class="Litmusbox_Grid_Header_Expand"></span>' +
                '    </div>' +
                '    <div class="Litmusbox_Grid_Table_Container">' +
                '        <div class="Litmusbox_Grid_Table_Header"></div>' +
                '        <div class="Litmusbox_Grid_Table_Body"></div>' +
                '        <div class="Litmusbox_Grid_Table_Footer">' +
                '            <span class="Litmusbox_Grid_Table_Legend_Container"></span>' +
                '            <span class="Litmusbox_Grid_Table_Paging_Container"></span>' +
                '            <span class="Litmusbox_Grid_Table_Expanding_Container"></span>' +            
                '        </div>' +
                '    </div>' +                        
                '</div>'
            ).addClass(this.options.table.className);
            
            //Cache the grid header
            this.grid.header                  = {};
            this.grid.header.container        = this.grid.container.find('div.Litmusbox_Grid_Header_Container');
            this.grid.header.label            = this.grid.header.container.find('span.Litmusbox_Grid_Header_Label');
            this.grid.header.expand           = this.grid.header.container.find('span.Litmusbox_Grid_Header_Expand');
                        
            //Cache the grid table
            this.grid.table                   = {};
            this.grid.table.container         = this.grid.container.find('div.Litmusbox_Grid_Table_Container');
            this.grid.table.header            = this.grid.table.container.find('div.Litmusbox_Grid_Table_Header');
            this.grid.table.body              = this.grid.table.container.find('div.Litmusbox_Grid_Table_Body');
            this.grid.table.footer            = {};
            this.grid.table.footer.container  = this.grid.table.container.find('div.Litmusbox_Grid_Table_Footer');
            this.grid.table.footer.legend     = this.grid.table.footer.container.find('span.Litmusbox_Grid_Table_Legend_Container');
            this.grid.table.footer.paging     = this.grid.table.footer.container.find('span.Litmusbox_Grid_Table_Paging_Container');
            this.grid.table.footer.expanding  = this.grid.table.footer.container.find('span.Litmusbox_Grid_Table_Expanding_Container');   

            //Debug message
            this._debug('Grid Cache', this.grid);
                        
            //Set grid container header
            this._setHeader();     
            
            //Set table header
            this._setTableHeader();
                            
            //Load grid data is grid is visible
            if(this.options.table.data.isLoadOnInitialization && !this.options.header.isTableCollapsed) {
                this._getTableData();
            }
            else if(!this.options.table.data.isLoadOnInitialization && !this.options.header.isTableCollapsed) {
                this._displayTableData(true);
            }
                                                                                
            //Attach hide/show grid handler
            this.grid.header.container.click(function(event) {
                self.toggleTableDataDisplay();
            });
            
            //Attach grid sort handler
            this.grid.table.header.find('div.Litmusbox_Grid_Table_Header_Row_Column[is_sortable=true]').click(function(event) {
                self.sortTableData($(event.currentTarget).attr('sort_key'));
            });
            
            //Attach grid page change handler
            this.grid.table.footer.paging.delegate('span.Litmusbox_Grid_Table_Paging_Page:not(.Litmusbox_Grid_Table_Paging_Page_Active)', 'click', function(event) {
                self.changeTablePage($(event.currentTarget).attr('page'));
            });
            this.grid.table.footer.paging.delegate('span.Litmusbox_Grid_Table_Paging_Page:not(.Litmusbox_Grid_Table_Paging_Page_Active)', 'mouseover', function(event) {
                    $(event.currentTarget).css('text-decoration', 'underline');
            });
            this.grid.table.footer.paging.delegate('span.Litmusbox_Grid_Table_Paging_Page:not(.Litmusbox_Grid_Table_Paging_Page_Active)', 'mouseout', function(event) {
                    $(event.currentTarget).css('text-decoration', 'none');
            });            
            
            //Attach grid data hide/show handler
            this.grid.table.footer.expanding.click(function(event) {
                self.toggleTableAdditionalData();
            });

            //Append the grid
            this.element.append(
                this.grid.container.append(
                    this.grid.header.container
                ).append(
                    this.grid.table.container
                )
            ).append(
                $('<div>').addClass('Litmusbox_Grid_Clear')
            );
        },
        
        _destroy : function() {        
            //Unbind handlers			
            this.gridContainer.remove();
    	},  
    	  	
    	_setOption : function(option, value) {
    		$.Widget.prototype._setOption.apply(this, arguments);	
		    
    		switch(option) {
    		    case 'debug':
    		        this.options.debug = value;
    		        break;
                	        
    		}		
    	},
    	
    	_setHeader : function() {   
    	    if(!this.options.header.isHidden) {
    	        //Set the header label
    	        this.grid.header.label.html(this.options.header.label);
    	        
    	        //Set initial grid display
    	        if(this.options.header.isTableCollapsed) {
                    this.grid.table.container.hide();
    	            this.grid.header.expand.html('Expand');
    	        }
    	        else {
        	        this.grid.table.container.show();
                    this.grid.header.expand.html('Collapse');    	            
    	        }
    	    }
    	    else {
                this.grid.header.container.hide();
    	    }
    	    
    	    //Check this make sure it workes
    	    this.grid.header.container.append(
                $('<div>').addClass('Litmusbox_Grid_Clear')    	    
    	    );
    	},
    	
    	_setTableHeader : function() {
            if(!this.options.table.header.isHidden) {
            var ROW_TEMPLATE        = $('<div class="Litmusbox_Grid_Table_Header_Row"></div>');
            var ROW_COLUMN_TEMPLATE = $('<div class="Litmusbox_Grid_Table_Header_Row_Column"></div>');

            //To prevent "this" from being overwritten
            var self = this;

            //Create new grid header row template and append header class
            var gridHeaderRow = ROW_TEMPLATE.clone().addClass(this.options.table.header.className);

            jQuery.each(this.options.table.columns, function(index, column) {
                var gridHeaderColumn = ROW_COLUMN_TEMPLATE.clone().addClass(column.className).text(column.label);

                //Check to see if the column support sorting
                if(column.isSortable) {

                    //Add the sort event handler
                    gridHeaderColumn.attr({
                        is_sortable : 'true',
                        sort_key    : column.id
                    }).css({
                        cursor            : 'pointer',
                        'text-decoration' : 'underline'
                    }).addClass(self.options.table.data.sort.order == 'asc' ? 'Litmusbox_Grid_Table_Header_Row_Column_Sort_ASC' : 'Litmusbox_Grid_Table_Header_Row_Column_Sort_DESC');
                
                }

                //For each column append to the row
                gridHeaderRow.append(gridHeaderColumn);

            });

            //To make sure line display's as block due to float            
            gridHeaderRow.append(
                $('<div>').addClass('Litmusbox_Grid_Clear')            
            );

            } else {
                this.grid.table.header.hide();
    	    }
            //Append grid header to the grid
            this.grid.table.header.html(gridHeaderRow);    	    
    	},
    	
    	_getTableData : function() {
            //To prevent "this" from being overwritten
            var self = this;
            
            //Check to see if URL has been set
            if(!this.options.table.data.url) {
                //Debug message
                this._debug('No Data URL Set');
                                
                return;                
            }
                        
            //Initialize refinement data    	    
            var data = {};

            if(this.options.table.footer.isExpandCollapse) {
                //Debug message
                this._debug('Is Expand Collapse Grid');
                                
                data = {
                    method     : 'all',
                    sort       : this.options.table.data.sort,
                    refinement : this.options.table.data.refinements
                };
            }
            else if(this.options.table.footer.isPaging) {
                //Debug message
                this._debug('Is Paging Grid');
                                
                data = {
                    method     : 'range',
                    index      : (this.options.table.data.page.current - 1) * this.options.table.data.page.size,
                    length     : this.options.table.data.page.size,
                    sort       : this.options.table.data.sort,
                    refinement : this.options.table.data.refinements                
                };
            }
            else {
                //Debug message
                this._debug('Invalid Grid Type');
                                
                return;
            }

            //Debug message
            this._debug('Grid Refinement Data Options', data);

            jQuery.getJSON(this.options.table.data.url, data, function(tableData, textStatus) {
                //Mark that data has been loaded
                self.options.table.data.isLoaded = true;

                //Store data
                self.options.table.data.json = tableData.data;

                //Incase the data length has changed update paging information
                self.options.table.data.length   = tableData.length;
                self.options.table.data.page.max = Math.ceil(tableData.length / self.options.table.data.page.size);

                //Refresh the grid
                self._displayTableData();

                //Update the footer
                self._displayTableFooter();

            });   
    	},
    	
    	_displayTableData : function(isForceNoResults) {	    
            //To prevent "this" from being overwritten
            var self = this;
            
            //Templates    	    
            var ROW_TEMPLATE        = $('<div class="Litmusbox_Grid_Table_Body_Row"></div>');
            var ROW_COLUMN_TEMPLATE = $('<div class="Litmusbox_Grid_Table_Body_Row_Column"></div>');
            
            //Reset the grid
            this.grid.table.body.html('');

            //Check to see if there is any data
            if(!this.options.table.data.json.length || isForceNoResults) {
                //Append no data found message and return            
                this.grid.table.body.append(
                    ROW_TEMPLATE.clone().append(
                        ROW_COLUMN_TEMPLATE.clone().html(this.options.table.body.emptyMessage).addClass('Litmusbox_Grid_Table_Body_Row_Column_No_Results')
                    ).append(
                        $('<div>').addClass('Litmusbox_Grid_Clear')                    
                    )
                );

                //Hide the footer for visual reasons
                this.grid.table.footer.container.hide();

                return;
            }
            
            //Check to see if the table
            //var isExpanded = (gridContainer.find('.gridTableFooterExpandingContainer').attr('is_expanded') == 'true' ? true : false);            
            var isExpanded = false;
            
            //Itterate over data list
            jQuery.each(this.options.table.data.json, function(tableRowIndex, tableRow) {
                
                //Create new grid header row template and append header class
                var gridTableRow = ROW_TEMPLATE.clone().addClass(self.options.table.body.className).addClass(
                    tableRowIndex % 2 == 0 ? 'Litmusbox_Grid_Table_Body_Row_Even' : 'Litmusbox_Grid_Table_Body_Row_Odd'
                );

                //Check to see if current row index is even, if so apply highlight class
                if(self.options.table.body.row.isHighlight && tableRowIndex % 2 == 0) {
                    gridTableRow.addClass(self.options.table.body.rowClassName);
                }

                //Check to see if current row is greater then the display count
                if(!isExpanded && tableRowIndex >= self.options.table.data.page.size) {
                    gridTableRow.hide();
                }

                jQuery.each(self.options.table.columns, function(columnIndex, column) {
                    //For each column append to the row
                    gridTableRow.append(ROW_COLUMN_TEMPLATE.clone().addClass(column.className).html(
                        self.options.table.rows.formatRow(column.id, tableRow[column.id], tableRow)
                    ));
                });
                
                //To make sure line display's as block due to float
                gridTableRow.append(
                    $('<div>').addClass('Litmusbox_Grid_Clear')                
                );

                //Append table row to table body
                self.grid.table.body.append(gridTableRow);
                                
            });
            
            //To make sure line display's as block due to float            
            self.grid.table.body.append(
                $('<div>').addClass('Litmusbox_Grid_Clear')            
            );
    	},
    	    	
    	_displayTableFooter : function() {        
            //Show the footer
            this.grid.table.footer.container.show();
            
            //Set the legend
            this.grid.table.footer.legend.html(this.options.table.footer.legend);

            //Check to see if the table is paging
            if(this.options.table.footer.isPaging && this.options.table.data.length > this.options.table.data.page.size) {
                var PAGE_TEMPLATE = $('<span class="Litmusbox_Grid_Table_Paging_Page"></span>');
                
               //Reset paging container
               this.grid.table.footer.paging.html('');

               for(var i = 1; i <= this.options.table.data.page.max; i++) {

                   //Create page
                   var page = PAGE_TEMPLATE.clone().attr({
                       page : i
                   }).html(i);
                   
                   //Check to see if the current page is the active one
                   if(this.options.table.data.page.current == i) {
                       page.addClass('Litmusbox_Grid_Table_Paging_Page_Active');
                   }

                   //Add page to container
                   this.grid.table.footer.paging.append(page);
               }
           }

           //Check to see if the table is expand and collapse
           if(this.options.table.footer.isExpandCollapse && this.options.table.data.length > this.options.table.data.page.size) {
               this.grid.table.footer.expanding.html('Show More (' + (this.options.table.data.length - this.options.table.data.page.size) + ')');
           }
        },   
         	
        _sortTableData : function(self, element1, element2) {
            if(element1[self.options.table.data.sort.key] < element2[self.options.table.data.sort.key]) {
                return self.options.table.data.sort.order == 'desc' ? 1 : -1;
            }
            else if(element1[self.options.table.data.sort.key] > element2[self.options.table.data.sort.key]) {
                return self.options.table.data.sort.order == 'desc' ? -1 : 1;
            }        
            else {
                return 0;
            }        
        },  
          	
    	_debug : function() {
    	    if(this.options.debug) {
    	        console.log(arguments);
    	    }
    	},
    	
    	/* PUBLIC FUNCTIONS */
    	
    	toggleTableDataDisplay : function(isHide) {	    
    	    if(this.grid.table.container.is(':visible') || isHide) {
                //Debug message
                this._debug('Hiding Table Data');
                    	        
    	        this.grid.table.container.hide();
                this.grid.header.expand.html('Expand');
    	    }
    	    else {    	        
    	        if(!this.options.table.data.isLoaded) {
                    //Debug message
                    this._debug('Loading Table Data');
                                        
                    this._getTableData();            
                }
                
                //Debug message
                this._debug('Showing Table Data');
                                
    	        this.grid.table.container.show();
                this.grid.header.expand.html('Collapse');    	        
    	    }
    	},
    	
	    toggleTableAdditionalData : function(isHide) {
    	    var jQueryAdditionalRows = this.grid.table.body.find('div.Litmusbox_Grid_Table_Body_Row:gt(' + this.options.table.data.page.size + ')');
    	    
    	    if(jQueryAdditionalRows.first().is(':visible') || isHide) {
    	        jQueryAdditionalRows.hide();
    	        this.grid.table.footer.expanding.html('Show More (' + (this.options.table.data.length - this.options.table.data.page.size) + ')');
    	        
    	    }
    	    else {
    	        jQueryAdditionalRows.show();
    	        this.grid.table.footer.expanding.html('Show Less (' + (this.options.table.data.length - this.options.table.data.page.size) + ')');    	        
    	    }
    	},    	
    	
    	sortTableData : function(sortKey, sortOrder) {   
            //To prevent "this" from being overwritten
            var self = this;
            
            //Remove any existing sort arrows
            this.grid.table.header.find('div.Litmusbox_Grid_Table_Header_Row_Column[is_sortable=true]').removeClass('Litmusbox_Grid_Table_Header_Row_Column_Sort_ASC').removeClass('Litmusbox_Grid_Table_Header_Row_Column_Sort_DESC');

            //Update the sort key and order
            this.options.table.data.sort.key   = sortKey;
            this.options.table.data.sort.order = sortOrder ||  (this.options.table.data.sort.order == 'asc' ? 'desc' : 'asc');

            //Add sort arrow to new column
            this.grid.table.header.find('div.Litmusbox_Grid_Table_Header_Row_Column[is_sortable=true][sort_key=' + sortKey + ']').addClass(
               this.options.table.data.sort.order == 'asc' ? 'Litmusbox_Grid_Table_Header_Row_Column_Sort_ASC' : 'Litmusbox_Grid_Table_Header_Row_Column_Sort_DESC'            
            );

            //Debug message
            this._debug('Sorting Table By', sortKey, this.options.table.data.sort.order);

            if(this.options.table.footer.isExpandCollapse) {                                            

                //Sort the data
                this.options.table.data.json.sort(function(A, B) {
                    return self._sortTableData(self, A, B);
                });

                //Refresh the grid
                this._displayTableData(this.options.table.data.json);
            }
            else {
                this._getTableData();
            }    	    
    	},
    	
    	changeTablePage : function(page) {
            //Get currently active page
            var jQueryCurrentPage = this.grid.table.footer.paging.find('span.Litmusbox_Grid_Table_Paging_Page_Active');

            //Do not fetch data if trying to run on the same page
            if(jQueryCurrentPage.attr('page') == page) {
                //Debug message
                this._debug('Request Page Is Current Page');
                
                return;
            }

            //Debug message
            this._debug('Changing To Page', page);

            //Deactive current page and active new one
            jQueryCurrentPage.removeClass('Litmusbox_Grid_Table_Paging_Page_Active');
            this.grid.table.footer.paging.find('span.Litmusbox_Grid_Table_Paging_Page_Active[page' + page + ']').addClass('Litmusbox_Grid_Table_Paging_Page_Active');

            //Update the current page
            this.options.table.data.page.current = page;

            //Fetch data
            this._getTableData();   
    	},

        filterTableData : function(refinements, sortOrder) {
            this._debug('Updating Search Results');
            
            //Update the refinements
            this.options.table.data.refinements = refinements || this.options.table.data.refinements;            
            
            //Update the sort order if set            
            this.options.table.data.sort = sortOrder || this.options.table.data.sort;

            //Refresh the data
            this._getTableData();            
        },
    	
    	clearTableData : function() {
            this._debug('Clearing Search Results');
            
            //Clear table data
            this._displayTableData(true);    	    
    	}
    });

})(jQuery);
